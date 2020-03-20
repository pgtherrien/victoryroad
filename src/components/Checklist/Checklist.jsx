import React from "react";
import {
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Snackbar
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { withStyles, withTheme } from "@material-ui/core/styles";

import MuiAlert from "@material-ui/lab/Alert";
import { List } from "react-virtualized";

import { db } from "../../utils/firebase";
import Actions from "./Actions";
import Filters from "./Filters";
import pokedex from "../../data/pokedex";
import Pokemon from "../Pokemon";
import styles from "./Checklist.module.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: "#333333"
  },
  bar: {
    backgroundColor: lightBlue[400]
  }
})(LinearProgress);

const DEFAULT_FILTERS = {
  checked: false,
  gen1: true,
  gen2: true,
  gen3: true,
  gen4: true,
  gen5: true,
  gen7: true,
  search: "",
  showEventForms: false,
  type: "normal"
};

class ChecklistRaw extends React.PureComponent {
  constructor(props) {
    super(props);

    this.SMALL = window.innerWidth < props.theme.breakpoints.values.md;
    this.LARGE = window.innerWidth > props.theme.breakpoints.values.lg;
    this.ENTRIES_PER_ROW = this.SMALL ? 3 : 12;
    this.ROW_HEIGHT = this.SMALL ? 170 : this.LARGE ? 250 : 170;

    this.list = null;
    this.state = {
      alert: { type: "", value: "" },
      available: {
        lucky: [],
        normal: [],
        shiny: []
      },
      filters:
        JSON.parse(localStorage.getItem("vrFilters")) ||
        Object.assign({}, DEFAULT_FILTERS),
      rowCount: 0,
      rowData: [],
      showFilters: false,
      userLists: {
        lucky: [],
        normal: [],
        shiny: []
      }
    };
  }

  componentWillMount() {
    const { filters } = this.state;
    db.collection("available")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          let available = {
            lucky: JSON.parse(data.lucky),
            normal: JSON.parse(data.normal),
            shiny: JSON.parse(data.shiny)
          };
          this.getUserChecklists(available, filters);
          this.setState({ available: available });
        });
      });
  }

  // buildRow builds a single row of data
  buildRow = (i, dex) => {
    let row = {};

    if (Object.keys(dex).length <= this.ENTRIES_PER_ROW) {
      Object.keys(dex).forEach(function(number) {
        row[number] = dex[number];
      });
    } else {
      while (
        dex[Object.keys(dex)[i]] &&
        Object.keys(row).length < this.ENTRIES_PER_ROW
      ) {
        row[Object.keys(dex)[i]] = dex[Object.keys(dex)[i]];
        i++;
      }
    }

    return { row: row, index: i };
  };

  // buildRowData aggregates the data into rows
  buildRowData = (count, dex) => {
    let i = 0;
    let rowIndex = 0;
    let row;
    let rows = [];

    if (dex) {
      while (rowIndex < count) {
        row = this.buildRow(i, dex);
        i = row.index;
        rows.push(row.row);
        rowIndex++;
      }
    }
    return rows;
  };

  // filterDex returns the remaining entries after filters are applied
  filterDex = (updatedAvailable, updatedFilters, updatedLists) => {
    const {
      baby,
      checked,
      legendary,
      mythical,
      regional,
      search,
      showEventForms,
      type
    } = updatedFilters;
    let entries = {};
    let add;
    let gen;

    Object.keys(pokedex).forEach(number => {
      add = true;
      gen = "gen" + pokedex[number].generation.toString();
      switch (type) {
        case "lucky":
        case "normal":
        case "shiny":
        default:
          if (!updatedAvailable[type].includes(number)) {
            add = false;
          }
      }

      if (add && !checked && updatedLists[type].includes(number)) {
        add = false;
      }
      if (add && !showEventForms && number.length > 6) {
        add = false;
      }
      if (add && updatedFilters[gen] === false) {
        add = false;
      }
      if (add && search.length > 0) {
        if (
          !pokedex[number].name.toLowerCase().includes(search.toLowerCase()) &&
          !pokedex[number].number.includes(search)
        ) {
          add = false;
        }
      }
      if (add && baby) {
        if (!pokedex[number].tags.includes("baby")) {
          add = false;
        }
      }
      if (add && legendary) {
        if (!pokedex[number].tags.includes("legendary")) {
          add = false;
        }
      }
      if (add && mythical) {
        if (!pokedex[number].tags.includes("mythical")) {
          add = false;
        }
      }
      if (add && regional) {
        if (!pokedex[number].tags.includes("regional")) {
          add = false;
        }
      }
      if (add) {
        entries[number] = pokedex[number];
      }
    });

    return entries;
  };

  // getUserChecklists attempts to pull the active user's checklists from the db
  getUserChecklists = (available, updatedFilters) => {
    const { user } = this.props;
    const { userLists } = this.state;
    let dex, count;

    if (user.uid) {
      var docRef = db.collection("checklists").doc(user.uid);
      docRef.get().then(doc => {
        if (doc.exists) {
          let data = doc.data();
          let lists = {
            lucky: JSON.parse(data.lucky),
            normal: JSON.parse(data.normal),
            shiny: JSON.parse(data.shiny)
          };
          dex = this.filterDex(available, updatedFilters, lists);
          count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);

          this.setState({
            rowCount: count,
            rowData: this.buildRowData(count, dex),
            userLists: lists
          });
          return;
        }
      });
    }

    dex = this.filterDex(available, updatedFilters, userLists);
    count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);
    this.setState({
      rowCount: count,
      rowData: this.buildRowData(count, dex)
    });
  };

  // handleApplyFilters applies the filter changes to the data and updates the state
  handleApplyFilters = updatedFilters => {
    const { available, userLists } = this.state;
    let dex = this.filterDex(available, updatedFilters, userLists);
    let count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);

    if (this.list) {
      this.list.forceUpdateGrid();
    }

    localStorage.setItem("vrFilters", JSON.stringify(updatedFilters));
    this.setState({
      filters: updatedFilters,
      rowCount: count,
      rowData: this.buildRowData(count, dex)
    });
  };

  // handleCheck updates the
  handleCheck = number => {
    const { filters, userLists } = this.state;
    const { user } = this.props;
    let lists = Object.assign({}, userLists);

    if (lists[filters.type].includes(number)) {
      lists[filters.type].splice(lists[filters.type].indexOf(number), 1);
    } else {
      lists[filters.type].push(number);
    }

    if (user.uid && user.uid.length > 0) {
      this.handleSave(lists);
    }
    this.setState({ userLists: lists });
  };

  // handleSave updates the user checklists in the database
  handleSave = userLists => {
    const { user } = this.props;

    db.collection("checklists")
      .doc(user.uid)
      .set({
        lucky: JSON.stringify(userLists.lucky),
        normal: JSON.stringify(userLists.normal),
        shiny: JSON.stringify(userLists.shiny)
      })
      .then(() => {
        this.setState({
          alert: {
            type: "success",
            value: "Saved the checklist!"
          }
        });
      })
      .catch(function(error) {
        console.error("Error updating the checklists: ", error);
        this.setState({
          alert: {
            type: "error",
            value: "Failed to save the checklist"
          }
        });
      });
  };

  // handleUpdateFilter updates and applies new filters
  handleUpdateFilter = (field, value) => {
    const { filters } = this.state;
    let updatedFilters = Object.assign({}, filters);

    updatedFilters[field] = value;
    this.handleApplyFilters(updatedFilters);
  };

  // handleUpdateType applies the type change to the filters
  handleUpdateType = (e, type) => {
    const { filters } = this.state;
    let updatedFilters = Object.assign({}, filters);

    updatedFilters.type = type;
    this.handleApplyFilters(updatedFilters);
  };

  // renderRow renders a single row
  renderRow = ({ key, index, isScrolling, isVisible, style }) => {
    const { filters, rowData, userLists } = this.state;
    let entries = [];
    let i = 0;

    if (rowData[index]) {
      Object.keys(rowData[index]).forEach(number => {
        entries.push(
          <Pokemon
            checked={
              userLists[filters.type] &&
              userLists[filters.type].includes(number)
            }
            entriesPerRow={this.ENTRIES_PER_ROW}
            entry={pokedex[number]}
            handleCheck={() => this.handleCheck(number)}
            key={i}
            listType={filters.type}
            number={number}
            rowHeight={this.ROW_HEIGHT}
          />
        );
        i++;
      });

      return (
        <div key={key} style={style}>
          <Grid
            container
            style={{ height: `${this.ROW_HEIGHT}px`, justifyContent: "center" }}
          >
            {entries}
          </Grid>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    const {
      alert,
      available,
      filters,
      rowCount,
      showFilters,
      userLists
    } = this.state;
    const { theme } = this.props;
    let progress =
      userLists[filters.type].length / available[filters.type].length;

    return (
      <div className={styles.list}>
        <BorderLinearProgress
          className={styles.progress}
          variant="determinate"
          value={progress * 100}
        />
        <Paper
          className={
            window.innerWidth < theme.breakpoints.values.sm
              ? styles.tabsMobile
              : styles.tabs
          }
          square
        >
          <Tabs
            indicatorColor="secondary"
            onChange={this.handleUpdateType}
            textColor="secondary"
            value={filters.type}
          >
            <Tab label="Lucky" value="lucky" />
            <Tab label="Normal" value="normal" />
            <Tab label="Shiny" value="shiny" />
          </Tabs>
        </Paper>
        <List
          className={styles.virtualized}
          height={window.innerHeight - 148}
          overscanRowCount={2}
          ref={c => (this.list = c)}
          rowCount={rowCount}
          rowHeight={this.ROW_HEIGHT}
          rowRenderer={this.renderRow}
          style={{
            margin: "0 auto",
            outline: "none"
          }}
          width={window.innerWidth * 0.9}
        />
        <Snackbar
          open={alert.value.length > 0}
          autoHideDuration={6000}
          onClose={() => this.setState({ alert: { type: "", value: "" } })}
        >
          <Alert
            onClose={() => this.setState({ alert: { type: "", value: "" } })}
            severity={alert.type}
          >
            {alert.value}
          </Alert>
        </Snackbar>
        <Actions
          handleShowFilters={() => this.setState({ showFilters: true })}
        />
        <Filters
          resetFilters={() =>
            this.handleApplyFilters(Object.assign({}, DEFAULT_FILTERS))
          }
          filters={filters}
          handleUpdateFilter={this.handleUpdateFilter}
          onClose={() => {
            this.setState({
              showFilters: false
            });
          }}
          open={showFilters}
        />
      </div>
    );
  }
}

const Checklist = withTheme(ChecklistRaw);

export default Checklist;
