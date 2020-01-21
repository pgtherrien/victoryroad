import React, { useEffect, useState } from "react";
import { Button, Fab, Grid, LinearProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import {
  lighten,
  makeStyles,
  useTheme,
  withStyles
} from "@material-ui/core/styles";

import { Save as SaveIcon, GitHub as GitHubIcon } from "@material-ui/icons";
import { List as VirtualizedList } from "react-virtualized";

import { db } from "../../firebase";
import pokedex from "../../data/pokedex";
import Pokemon from "../Pokemon";

const BorderLinearProgress = withStyles({
  root: {
    height: 15,
    backgroundColor: lighten(green[400], 0.5)
  },
  bar: {
    backgroundColor: green[400]
  }
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: "#333333",
    display: "flex",
    height: "50px",
    justifyContent: "center",
    marginTop: "20px",
    width: "100%"
  },
  list: {
    backgroundColor: "#212121 !important",
    flexGrow: 1,
    height: "100%",
    paddingTop: "100px",
    width: "100%"
  },
  progress: {
    margin: "0 auto",
    width: "80%"
  },
  save: {
    bottom: "80px",
    right: "30px",
    position: "absolute"
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
      backgroundColor: "#000000 !important",
      outline: "1px solid black !important"
    }
  }
}));

const DEFAULT_FILTERS = {
  available: {
    normal: [],
    shiny: []
  },
  onlyChecked: false,
  onlyUnchecked: true,
  showEventForms: true,
  type: "normal"
};

export default function List(props) {
  const theme = useTheme();

  const SMALL = window.innerWidth < theme.breakpoints.values.md;
  const LARGE = window.innerWidth > theme.breakpoints.values.lg;
  const ENTRIES_PER_ROW = LARGE ? 12 : SMALL ? 3 : 6;
  const ROW_HEIGHT = LARGE ? 250 : SMALL ? 170 : 234;

  const [filteredDex, setFilteredDex] = useState({});
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
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
          if (pokedex[number].tags.indexOf("not_tradable") > -1) {
            add = false;
          }
          break;
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

  // getCheckedCount returns the sum total of checked entries in the applicable user list
  const getCheckedCount = () => {
    let count = 0;
    if (filteredDex) {
      Object.keys(filteredDex).forEach(number => {
        if (userLists[filters.type].indexOf(number) > -1) {
          count++;
        }
      });
    }
    return count;
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
        // update the save state here
      })
      .catch(function(error) {
        console.error("Error updating the checklists: ", error);
        // update the save state here
      });
  };

  // handleUpdateFilters applies the filter changes to the data and updates the state
  const handleUpdateFilters = updatedFilters => {
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

  // handleUpdateType applies the type change to the filters
  const handleUpdateType = type => {
    let updatedFilters = Object.assign({}, filters);
    updatedFilters.type = type;
    handleUpdateFilters(updatedFilters);
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
      <VirtualizedList
        className={classes.virtualized}
        height={window.innerHeight - 185}
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
        aria-label="save"
        className={classes.save}
        onClick={handleSave}
        style={{ backgroundColor: green[400], color: "white" }}
        title="Save Checklist"
      >
        <SaveIcon />
      </Fab>
      <div className={classes.footer}>
        <Button
          href="https://github.com/pgtherrien/victoryroad"
          startIcon={<GitHubIcon />}
        >
          Victory Road
        </Button>
      </div>
    </div>
  );
}