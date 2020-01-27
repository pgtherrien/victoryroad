import React, { useEffect, useState } from "react";
import {
  Fab,
  Grid,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Snackbar
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { FilterList, Save as SaveIcon } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { List as VirtualizedList } from "react-virtualized";

import { db } from "../../firebase";
import Filters from "./Filters";
import pokedex from "../../data/pokedex";
import Pokemon from "../Pokemon";

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

const useStyles = makeStyles(theme => ({
  filter: {
    bottom: "90px",
    right: "10px",
    position: "absolute"
  },
  list: {
    backgroundColor: "#212121 !important",
    flexGrow: 1,
    height: "100%",
    paddingTop: "85px",
    width: "100%"
  },
  progress: {
    margin: "0 auto",
    width: "80%"
  },
  save: {
    bottom: "20px",
    right: "10px",
    position: "absolute"
  },
  tabs: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      width: "100%"
    },
    backgroundColor: "#212121",
    boxShadow: "none",
    margin: "0 auto",
    width: "500px"
  },
  virtualized: {
    "&::-webkit-scrollbar": {
      width: "0.4em !important"
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00) !important",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00) !important"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#333333 !important",
      outline: "1px solid #333333 !important"
    }
  }
}));

const DEFAULT_FILTERS = {
  available: {
    lucky: [],
    normal: [],
    shiny: []
  },
  onlyChecked: false,
  onlyUnchecked: true,
  showEventForms: false,
  type: "normal"
};

export default function List(props) {
  const theme = useTheme();

  const SMALL = window.innerWidth < theme.breakpoints.values.md;
  const ENTRIES_PER_ROW = SMALL ? 3 : 12;
  const ROW_HEIGHT = SMALL ? 170 : 170;

  const [alert, setAlert] = useState({ type: "", value: "" });
  const [filteredDex, setFilteredDex] = useState({});
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [userLists, setUserLists] = useState({
    lucky: [],
    normal: [],
    shiny: []
  });
  const [rowCount, setRowCount] = useState(0);
  const [rowData, setRowData] = useState([]);

  const { user } = props;
  let classes = useStyles();
  let list;

  useEffect(() => {
    db.collection("available")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let available = doc.data();
          let updatedFilters = Object.assign({}, DEFAULT_FILTERS);
          updatedFilters.available = {
            lucky: JSON.parse(available.lucky),
            normal: JSON.parse(available.normal),
            shiny: JSON.parse(available.shiny)
          };
          setFilters(updatedFilters);
          getUserChecklists(updatedFilters);
        });
      });
  }, []);

  // buildRowData aggregates the data into rows
  const buildRowData = (count, dex) => {
    let i = 0;
    let rowIndex = 0;
    let row;
    let rows = [];

    if (dex) {
      while (rowIndex < count) {
        row = buildRow(i, dex);
        i = row.index;
        rows.push(row.row);
        rowIndex++;
      }
    }
    return rows;
  };

  // buildRow builds a single row of data
  const buildRow = (i, dex) => {
    let row = {};

    if (Object.keys(dex).length <= ENTRIES_PER_ROW) {
      Object.keys(dex).forEach(function(number) {
        row[number] = dex[number];
      });
    } else {
      while (
        dex[Object.keys(dex)[i]] &&
        Object.keys(row).length < ENTRIES_PER_ROW
      ) {
        row[Object.keys(dex)[i]] = dex[Object.keys(dex)[i]];
        i++;
      }
    }

    return { row: row, index: i };
  };

  // clearFilters sets the filters back to their default state
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // filterDex returns the remaining entries after filters are applied
  const filterDex = (updatedFilters, updatedLists) => {
    const {
      available,
      onlyChecked,
      onlyUnchecked,
      showEventForms,
      type
    } = updatedFilters;
    let entries = {};
    let add;

    Object.keys(pokedex).forEach(number => {
      add = true;
      switch (type) {
        case "lucky":
        case "normal":
        case "shiny":
        default:
          if (!available[type].includes(number)) {
            add = false;
          }
      }

      if (add && onlyChecked && !updatedLists[type].includes(number)) {
        add = false;
      }
      if (add && onlyUnchecked && updatedLists[type].includes(number)) {
        add = false;
      }
      if (add && !showEventForms && number.length > 6) {
        add = false;
      }
      if (add) {
        entries[number] = pokedex[number];
      }
    });

    return entries;
  };

  // getUserChecklists attempts to pull the active user's checklists from the db
  const getUserChecklists = updatedFilters => {
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
          dex = filterDex(updatedFilters, lists);
          count = Math.ceil(Object.keys(dex).length / ENTRIES_PER_ROW);
          setFilteredDex(dex);
          setRowCount(count);
          setRowData(buildRowData(count, dex));
          setUserLists(lists);
          return;
        }
      });
    }

    dex = filterDex(updatedFilters, userLists);
    count = Math.ceil(Object.keys(dex).length / ENTRIES_PER_ROW);
    setFilteredDex(dex);
    setRowCount(count);
    setRowData(buildRowData(count, dex));
  };

  // handleApplyFilters applies the filter changes to the data and updates the state
  const handleApplyFilters = updatedFilters => {
    let dex = filterDex(updatedFilters, userLists);
    let count = Math.ceil(Object.keys(dex).length / ENTRIES_PER_ROW);

    if (list) {
      list.forceUpdateGrid();
    }

    setFilters(updatedFilters);
    setFilteredDex(dex);
    setRowCount(count);
    setRowData(buildRowData(count, dex));
  };

  // handleCheck updates the
  const handleCheck = number => {
    const { type } = filters;
    let lists = Object.assign({}, userLists);

    if (lists[type].includes(number)) {
      lists[type].splice(lists[type].indexOf(number), 1);
    } else {
      lists[type].push(number);
    }

    setUserLists(lists);
    // Here is where I would determine checked count to update the progress bar
  };

  // handleSave updates the user checklists in the database
  const handleSave = () => {
    db.collection("checklists")
      .doc(user.uid)
      .set({
        lucky: JSON.stringify(userLists.lucky),
        normal: JSON.stringify(userLists.normal),
        shiny: JSON.stringify(userLists.shiny)
      })
      .then(() => {
        setAlert({
          type: "success",
          value: "Saved the checklist!"
        });
      })
      .catch(function(error) {
        console.error("Error updating the checklists: ", error);
        setAlert({
          type: "error",
          value: "Failed to save the checklist"
        });
      });
  };

  const handleUpdateBoolFilter = field => {
    let updatedFilters = Object.assign({}, filters);
    updatedFilters[field] = !filters[field];
    handleApplyFilters(updatedFilters);
  };

  // handleUpdateType applies the type change to the filters
  const handleUpdateType = (e, type) => {
    e.stopPropagation();
    let updatedFilters = Object.assign({}, filters);
    updatedFilters.type = type;
    handleApplyFilters(updatedFilters);
  };

  // renderRow renders a single row
  const renderRow = ({ key, index, isScrolling, isVisible, style }) => {
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
            entriesPerRow={ENTRIES_PER_ROW}
            entry={pokedex[number]}
            handleCheck={() => handleCheck(number)}
            key={i}
            listType={filters.type}
            number={number}
            rowHeight={ROW_HEIGHT}
          />
        );
        i++;
      });

      return (
        <div key={key} style={style}>
          <Grid
            container
            style={{ height: `${ROW_HEIGHT}px`, justifyContent: "center" }}
          >
            {entries}
          </Grid>
        </div>
      );
    } else {
      return null;
    }
  };

  let progress =
    userLists[filters.type].length / filters.available[filters.type].length;

  return (
    <div className={classes.list}>
      <BorderLinearProgress
        className={classes.progress}
        variant="determinate"
        value={progress * 100}
      />
      <Paper className={classes.tabs} square>
        <Tabs
          indicatorColor="secondary"
          onChange={handleUpdateType}
          textColor="secondary"
          value={filters.type}
        >
          <Tab label="Lucky" value="lucky" />
          <Tab label="Normal" value="normal" />
          <Tab label="Shiny" value="shiny" />
        </Tabs>
      </Paper>
      <VirtualizedList
        className={classes.virtualized}
        height={window.innerHeight - 148}
        overscanRowCount={2}
        ref={c => (list = c)}
        rowCount={rowCount}
        rowHeight={ROW_HEIGHT}
        rowRenderer={renderRow}
        style={{
          margin: "0 auto",
          outline: "none"
        }}
        width={window.innerWidth * 0.9}
      />
      <Fab
        aria-label="filter"
        className={classes.filter}
        onClick={() => setShowFilters(!showFilters)}
        style={{ backgroundColor: "#2AB6F6", color: "white" }}
        title="Filter Checklist"
      >
        <FilterList />
      </Fab>
      <Fab
        aria-label="save"
        className={classes.save}
        onClick={handleSave}
        style={{ backgroundColor: "#2AB6F6", color: "white" }}
        title="Save Checklist"
      >
        <SaveIcon />
      </Fab>
      <Snackbar
        open={alert.value.length > 0}
        autoHideDuration={6000}
        onClose={() => setAlert({ type: "", value: "" })}
      >
        <Alert
          onClose={() => setAlert({ type: "", value: "" })}
          severity={alert.type}
        >
          {alert.value}
        </Alert>
      </Snackbar>
      <Filters
        clearFilters={clearFilters}
        filters={filters}
        handleUpdateBoolFilter={handleUpdateBoolFilter}
        onClose={() => setShowFilters(false)}
        open={showFilters}
      />
    </div>
  );
}
