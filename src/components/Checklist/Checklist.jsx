import React from "react";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import { List } from "react-virtualized";
import { Dimmer, Grid, Loader, Menu, Responsive } from "semantic-ui-react";

import pokedex from "../../data/pokedex";
import styles from "./Checklist.module.css";
import ChecklistSidebar from "./ChecklistSidebar";
import Entry from "./Entry";
import { PokemonModal } from "../Modals";
import Progress from "./Progress";

const DEFAULT_FILTERS = {
  generations: [],
  onlyChecked: false,
  onlyUnchecked: false,
  search: "",
  showEventForms: false,
  tags: [],
  type: "normal"
};

const DEFAULT_SAVE_STATE = {
  color: "grey",
  label: "Click to save changes",
  name: "save"
};

const ENTRIES_PER_ROW =
  window.innerWidth < Responsive.onlyMobile.maxWidth
    ? 3
    : window.innerWidth > Responsive.onlyComputer.minWidth
    ? 8
    : 5;

const ROW_HEIGHT =
  window.innerWidth < Responsive.onlyMobile.maxWidth
    ? 175
    : window.innerWidth < 1400
    ? 220
    : window.innerWidth < 1700
    ? 260
    : window.innerWidth < 1900
    ? 280
    : window.innerWidth < 2100
    ? 300
    : 320;

export default class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);

    let localFilters = localStorage.getItem("victory_road_checklist_filters");
    let rowCount = Math.ceil(Object.keys(pokedex).length / ENTRIES_PER_ROW);

    this.state = {
      filteredPokedex: pokedex,
      filters:
        localFilters === null
          ? Object.assign({}, DEFAULT_FILTERS)
          : JSON.parse(localFilters),
      lists: {},
      openPokemon: "",
      rowCount: rowCount,
      rowData: this.buildRowData(pokedex, rowCount),
      saveState: DEFAULT_SAVE_STATE
    };
  }

  // If the user is logged in, get their Checklist object
  componentWillMount() {
    const { filters } = this.state;
    const { user } = this.props;
    let oThis = this;
    if (user.uid) {
      var docRef = db.collection("checklists").doc(user.uid);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          let data = doc.data();
          let lists = {
            lucky: JSON.parse(data.lucky),
            normal: JSON.parse(data.normal),
            shiny: JSON.parse(data.shiny)
          };
          let filteredDex = oThis.getFilteredDex(filters, lists);
          let rowCount = Math.ceil(
            Object.keys(filteredDex).length / ENTRIES_PER_ROW
          );

          oThis.setState({
            filteredDex: filteredDex,
            lists: lists,
            rowCount: rowCount,
            rowData: oThis.buildRowData(filteredDex, rowCount)
          });

          return;
        }
      });
    }
    let lists = {
      lucky: [],
      normal: [],
      shiny: []
    };
    let filteredDex = oThis.getFilteredDex(filters, lists);
    let rowCount = Math.ceil(Object.keys(filteredDex).length / ENTRIES_PER_ROW);
    this.setState({
      filteredDex: filteredDex,
      lists: lists,
      rowCount: rowCount,
      rowData: this.buildRowData(filteredDex, rowCount)
    });
  }

  clearFilters = () => {
    let filters = Object.assign({}, DEFAULT_FILTERS);
    filters.generations = [];
    filters.tags = [];

    this.handleSetFilters(filters);
  };

  buildIndividualRow = (filteredDex, index) => {
    let row = {};

    if (Object.keys(filteredDex).length <= ENTRIES_PER_ROW) {
      Object.keys(filteredDex).forEach(function(number) {
        row[number] = filteredDex[number];
      });
    } else {
      while (
        filteredDex[Object.keys(filteredDex)[index]] &&
        Object.keys(row).length < ENTRIES_PER_ROW
      ) {
        row[Object.keys(filteredDex)[index]] =
          filteredDex[Object.keys(filteredDex)[index]];
        index++;
      }
    }

    return { row: row, index: index };
  };

  // Group the pokedex entries into rows
  buildRowData = (filteredDex, rowCount) => {
    let oThis = this;
    let rowIndex = 0;
    let rows = [];
    let index = 0;
    let retval;

    if (filteredDex) {
      while (rowIndex < rowCount) {
        retval = oThis.buildIndividualRow(filteredDex, index);
        index = retval.index;
        rows.push(retval.row);
        rowIndex++;
      }
    }
    return rows;
  };

  // Get the count of checked entries in the current filtered Pokedex
  getCheckedCount = filteredDex => {
    const { filters, lists } = this.state;
    let count = 0;

    if (filteredDex) {
      Object.keys(filteredDex).forEach(function(number) {
        if (lists[filters.type].indexOf(number) > -1) {
          count++;
        }
      });
    }

    return count;
  };

  // Get the visible entries from the Pokedex based upon the acitve filters
  getFilteredDex = (filters, lists) => {
    const {
      generations,
      onlyChecked,
      onlyUnchecked,
      showEventForms,
      search,
      tags,
      type
    } = filters;
    let entries = {};
    let add;

    Object.keys(pokedex).forEach(function(number) {
      add = true;
      switch (type) {
        case "lucky":
          if (pokedex[number].tags.indexOf("not_tradable") > -1) {
            add = false;
          }
          break;
        case "shiny":
          if (!pokedex[number].shiny) {
            add = false;
          }
          break;
        default:
          break;
      }

      if (add && search.length > 0) {
        if (
          !pokedex[number].name.toLowerCase().includes(search.toLowerCase()) &&
          !pokedex[number].number.toLowerCase().includes(search.toLowerCase())
        ) {
          add = false;
        }
      }
      if (add && onlyChecked && lists[type].indexOf(number) === -1) {
        add = false;
      }
      if (add && onlyUnchecked && lists[type].indexOf(number) > -1) {
        add = false;
      }
      if (add && !showEventForms && number.length > 6) {
        add = false;
      }
      if (
        add &&
        generations.length > 0 &&
        generations.indexOf(pokedex[number].generation) === -1
      ) {
        add = false;
      }

      if (add && tags.length > 0) {
        add = false;
        for (let tag of tags) {
          if (pokedex[number].tags.indexOf(tag) > -1) {
            add = true;
          }
        }
      }

      if (add) {
        entries[number] = pokedex[number];
      }
    });

    return entries;
  };

  // Update the current checklist, and update the progress bar with the count
  handleCheck = number => {
    const { filters, lists } = this.state;
    const { type } = filters;

    if (lists[type].indexOf(number) > -1) {
      lists[type].splice(lists[type].indexOf(number), 1);
    } else {
      lists[type].push(number);
    }

    let filteredDex = this.getFilteredDex(filters, lists);
    let count = this.getCheckedCount(filteredDex);

    this.child.setCounts({
      checked: count,
      total: Object.keys(filteredDex).length
    });
  };

  // Updates the database checklist object
  handleSave = () => {
    const { uid } = this.props.user;
    const { lists } = this.state;
    let oThis = this;

    db.collection("checklists")
      .doc(uid)
      .set({
        lucky: JSON.stringify(lists.lucky),
        normal: JSON.stringify(lists.normal),
        shiny: JSON.stringify(lists.shiny)
      })
      .then(() =>
        this.setState({
          saveState: {
            color: "green",
            label: "Successfully saved your changes!",
            name: "check"
          }
        })
      )
      .catch(function(error) {
        console.error("Error updating the checklists: ", error);
        oThis.setState({
          saveState: {
            color: "red",
            label: "Error saving your changes...",
            name: "close"
          }
        });
      });
  };

  // Update the local storage and then the state with the filters
  handleSetFilters = filters => {
    const { lists } = this.state;
    let filteredDex = this.getFilteredDex(filters, lists);
    let rowCount = Math.ceil(Object.keys(filteredDex).length / ENTRIES_PER_ROW);

    localStorage.setItem(
      "victory_road_checklist_filters",
      JSON.stringify(filters)
    );

    if (this.list) {
      this.list.forceUpdateGrid();
    }

    this.setState({
      filters: filters,
      filteredDex: filteredDex,
      rowCount: rowCount,
      rowData: this.buildRowData(filteredDex, rowCount)
    });
  };

  // Determine the current type, and update the filters
  handleTypeChange = type => {
    const { filters } = this.state;
    let newFilters = Object.assign({}, filters);
    newFilters.type = type;
    this.handleSetFilters(newFilters);
  };

  renderRow = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    const { lists, filters, rowData } = this.state;
    let entries = [];
    let oThis = this;
    let i = 0;

    Object.keys(rowData[index]).forEach(function(number) {
      entries.push(
        <Entry
          checked={
            lists[filters.type] && lists[filters.type].indexOf(number) > -1
          }
          entry={pokedex[number]}
          handleCheck={() => oThis.handleCheck(number)}
          key={i}
          listType={filters.type}
          number={number}
          openPokemon={number => oThis.setState({ openPokemon: number })}
        />
      );
      i++;
    });

    return (
      <div key={key} style={style}>
        <Grid textAlign="center">{entries}</Grid>
      </div>
    );
  };

  render() {
    const {
      filteredDex,
      filters,
      lists,
      openPokemon,
      rowCount,
      saveState
    } = this.state;
    let totalCount = filteredDex ? Object.keys(filteredDex).length : 0;
    const { admins, user } = this.props;
    const { type } = filters;

    if (lists[type]) {
      if (this.child) {
        let count = this.getCheckedCount(filteredDex);
        this.child.setCounts({
          checked: count,
          total: totalCount
        });
      }

      return (
        <div
          className={styles["checklist-container"]}
          onScroll={this.handleScroll}
        >
          <Progress
            checkedCount={this.getCheckedCount(filteredDex)}
            handleSave={this.handleSave}
            listType={type}
            onRef={ref => (this.child = ref)}
            totalCount={totalCount}
            user={user}
          />
          <div className={styles["checklist-button-wrapper"]}>
            <Menu inverted pointing secondary>
              <Menu.Item
                active={filters.type === "lucky"}
                name="lucky"
                onClick={() => this.handleTypeChange("lucky")}
              />
              <Menu.Item
                active={filters.type === "normal"}
                name="normal"
                onClick={() => this.handleTypeChange("normal")}
              />
              <Menu.Item
                active={filters.type === "shiny"}
                name="shiny"
                onClick={() => this.handleTypeChange("shiny")}
              />
            </Menu>
          </div>
          <List
            height={window.innerHeight - 175}
            overscanRowCount={2}
            ref={c => (this.list = c)}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            rowRenderer={this.renderRow}
            style={{ outline: "none" }}
            width={window.innerWidth * 0.8}
          />
          <ChecklistSidebar
            admins={admins}
            clearFilters={this.clearFilters}
            filters={filters}
            handleSave={this.handleSave}
            saveState={saveState}
            setFilters={filters => this.handleSetFilters(filters)}
            user={user}
          />
          {openPokemon.length > 0 && (
            <PokemonModal
              filteredDex={filteredDex}
              list={lists[type]}
              number={openPokemon}
              onClose={() => this.setState({ openPokemon: "" })}
              shinyImg={type === "shiny"}
              type={type}
            />
          )}
        </div>
      );
    } else {
      return (
        <Dimmer active>
          <Loader>Loading Checklists...</Loader>
        </Dimmer>
      );
    }
  }
}

Checklist.propTypes = {
  admins: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};
