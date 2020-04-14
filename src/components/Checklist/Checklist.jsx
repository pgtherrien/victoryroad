import React from "react";
import { lightBlue } from "@material-ui/core/colors";
import {
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Snackbar,
} from "@material-ui/core";
import { List } from "react-virtualized";
import { withStyles, withTheme } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";

import { db } from "../../utils/firebase";
import { DEFAULT_FILTERS } from "../../data/constants";
import AuthContext from "../../contexts/AuthContext";
import Filters from "../Filters";
import Header from "../Header";
import pokedex from "../../data/pokedex";
import Pokemon from "../Pokemon";
import styles from "./Checklist.module.css";

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: "#333333",
  },
  bar: {
    backgroundColor: lightBlue[400],
  },
})(LinearProgress);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class RawChecklist extends React.PureComponent {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.list = null;
    this.SMALL = window.innerWidth < props.theme.breakpoints.values.md;
    this.LARGE = window.innerWidth > props.theme.breakpoints.values.lg;
    this.ENTRIES_PER_ROW = this.SMALL ? 3 : 12;
    this.ROW_HEIGHT = this.SMALL ? 170 : this.LARGE ? 250 : 170;

    this.state = {
      alert: { type: "", value: "" },
      available: {
        lucky: [],
        normal: [],
        shiny: [],
      },
      filters:
        JSON.parse(localStorage.getItem("victoryFilters")) ||
        Object.assign({}, DEFAULT_FILTERS),
      rowCount: 0,
      rowData: [],
      userLists: {
        lucky: [],
        normal: [],
        shiny: [],
      },
    };
  }

  // Get the available lists and set them into the state
  componentWillMount() {
    const { filters } = this.state;

    db.collection("available")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let available = {
            lucky: JSON.parse(data.lucky),
            normal: JSON.parse(data.normal),
            shiny: JSON.parse(data.shiny),
          };

          this.getUserChecklists(available, filters);
          this.setState({
            available: available,
          });
        });
      });
  }

  // buildRow builds a single row of data
  buildRow = (i, dex) => {
    let row = {};

    if (Object.keys(dex).length <= this.ENTRIES_PER_ROW) {
      Object.keys(dex).forEach((number) => {
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

    return { index: i, row: row };
  };

  // buildRowData divides the data into rows
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
  filterDex = (available, filters, lists) => {
    const {
      baby,
      checked,
      legendary,
      mythical,
      regional,
      search,
      selectedList,
      showEventForms,
    } = filters;
    let add;
    let currentGen;
    let entries = {};

    Object.keys(pokedex).forEach((number) => {
      add = true;
      currentGen = `gen${pokedex[number].generation.toString()}`;

      switch (selectedList) {
        case "lucky":
        case "normal":
        case "shiny":
        default:
          if (!available[selectedList].includes(number)) {
            add = false;
          }
      }

      if (add && !checked && lists[selectedList].includes(number)) {
        add = false;
      }

      if (add && !showEventForms && number.length > 6) {
        add = false;
      }

      if (add && !filters[currentGen]) {
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

  // getUserChecklists attempts to pull the active user's checklists and update the state
  getUserChecklists = (available, filters) => {
    const { user } = this.context;
    const { userLists } = this.state;
    let dex, count;

    if (user.uid) {
      let docRef = db.collection("checklists").doc(user.uid);
      docRef.get().then((doc) => {
        let data = doc.data();
        let lists = {
          lucky: JSON.parse(data.lucky),
          normal: JSON.parse(data.normal),
          shiny: JSON.parse(data.shiny),
        };
        dex = this.filterDex(available, filters, lists);
        count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);

        this.setState({
          rowCount: count,
          rowData: this.buildRowData(count, dex),
          userLists: lists,
        });

        return;
      });
    }

    dex = this.filterDex(available, filters, userLists);
    count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);
    this.setState({
      rowCount: count,
      rowData: this.buildRowData(count, dex),
    });
  };

  // handleApplyFilters updates the state with filtered data
  handleApplyFilters = (updatedFilters) => {
    const { available, userLists } = this.state;
    let dex = this.filterDex(available, updatedFilters, userLists);
    let count = Math.ceil(Object.keys(dex).length / this.ENTRIES_PER_ROW);

    if (this.list) {
      this.list.forceUpdateGrid();
    }

    localStorage.setItem("victoryFilters", JSON.stringify(updatedFilters));
    this.setState({
      filters: updatedFilters,
      rowCount: count,
      rowData: this.buildRowData(count, dex),
    });
  };

  // handleCheck updates the checklist state and saves if a user is logged in
  handleCheck = (number) => {
    const { filters, userLists } = this.state;
    const { selectedList } = filters;
    const { user } = this.context;
    let lists = Object.assign({}, userLists);

    if (lists[selectedList].includes(number)) {
      lists[selectedList].splice(lists[selectedList].indexOf(number), 1);
    } else {
      lists[selectedList].push(number);
    }

    if (user.uid && user.uid.length > 0) {
      this.handleSave(lists);
    }
    this.setState({ userLists: lists });
  };

  // handleSave saves the checklist changes to the db
  handleSave = (userLists) => {
    const { user } = this.context;

    db.collection("checklists")
      .doc(user.uid)
      .set({
        lucky: JSON.stringify(userLists.lucky),
        normal: JSON.stringify(userLists.normal),
        shiny: JSON.stringify(userLists.shiny),
      })
      .then(() => {
        this.setState({
          alert: {
            type: "success",
            value: "Saved the checklist!",
          },
        });
      })
      .catch(function (error) {
        console.error("Error updating the checklists: ", error);
        this.setState({
          alert: {
            type: "error",
            value: "Failed to save the checklist",
          },
        });
      });
  };

  // handleUpdateFilter updates the state and applies a filter change
  handleUpdateFilter = (field, value) => {
    let updatedFilters = Object.assign({}, this.state.filters);
    updatedFilters[field] = value;
    this.handleApplyFilters(updatedFilters);
  };

  // handleUpdateSelectedList updates the state and applies a selected list change
  handleUpdateSelectedList = (e, selectedList) => {
    let updatedFilters = Object.assign({}, this.state.filters);
    updatedFilters.selectedList = selectedList;
    this.handleApplyFilters(updatedFilters);
  };

  renderRow = ({ key, index, isScrolling, isVisible, style }) => {
    const { filters, rowData, userLists } = this.state;
    let entries = [];
    let i = 0;

    if (rowData[index]) {
      Object.keys(rowData[index]).forEach((number) => {
        entries.push(
          <Pokemon
            checked={
              userLists[filters.selectedList] &&
              userLists[filters.selectedList].includes(number)
            }
            entriesPerRow={this.ENTRIES_PER_ROW}
            entry={pokedex[number]}
            handleCheck={() => this.handleCheck(number)}
            key={i}
            listType={filters.selectedList}
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
    const { alert, available, filters, rowCount, userLists } = this.state;
    const { selectedList } = filters;
    const { theme } = this.props;
    let progress =
      userLists[selectedList].length / available[selectedList].length;

    return (
      <div>
        <Header
          searchOnChange={(e) =>
            this.handleUpdateFilter("search", e.target.value)
          }
          showSearch={true}
          sidebarChildren={
            <Filters
              filters={filters}
              handleUpdateFilter={this.handleUpdateFilter}
              resetFilters={() => this.setState({ filters: DEFAULT_FILTERS })}
            />
          }
        />
        <div className={styles.list}>
          <BorderLinearProgress
            className={styles.progress}
            value={progress * 100}
            variant="determinate"
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
              onChange={this.handleUpdateSelectedList}
              textColor="secondary"
              value={selectedList}
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
            ref={(c) => (this.list = c)}
            rowCount={rowCount}
            rowHeight={this.ROW_HEIGHT}
            rowRenderer={this.renderRow}
            style={{
              margin: "0 auto",
              outline: "none",
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
        </div>
      </div>
    );
  }
}

const Checklist = withTheme(RawChecklist);

Checklist.propTypes = {};

export default Checklist;
