import React from "react";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import { Dimmer, Grid, Loader, Menu } from "semantic-ui-react";

import pokedex from "../../data/pokedex";
import styles from "./Checklist.module.css";
import ChecklistSidebar from "./ChecklistSidebar";
import Entry from "./Entry";
import Progress from "./Progress";

const DEFAULT_FILTERS = {
  generations: [],
  onlyChecked: false,
  onlyUnchecked: false,
  search: "",
  showEventForms: false,
  type: "normal"
};

export default class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);

    let localFilters = localStorage.getItem("victory_road_checklist_filters");

    this.state = {
      filters:
        localFilters === null ? DEFAULT_FILTERS : JSON.parse(localFilters),
      lists: {},
      saveState: {
        color: "grey",
        label: "Click to save changes",
        name: "save"
      }
    };
  }

  // If the user is logged in, get their Checklist object
  componentWillMount() {
    const { user } = this.props;
    let oThis = this;
    if (user.uid) {
      var docRef = db.collection("checklists").doc(user.uid);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          let data = doc.data();
          oThis.setState({
            lists: {
              lucky: JSON.parse(data.lucky),
              normal: JSON.parse(data.normal),
              shiny: JSON.parse(data.shiny)
            }
          });
        }
      });
    } else {
      this.setState({
        lists: {
          lucky: [],
          normal: [],
          shiny: []
        }
      });
    }
  }

  // Get the count of checked entries in the current filtered Pokedex
  getCheckedCount = filteredDex => {
    const { filters, lists } = this.state;
    let count = 0;
    Object.keys(filteredDex).forEach(function(number) {
      if (lists[filters.type].indexOf(number) > -1) {
        count++;
      }
    });
    return count;
  };

  // Get the visible entries from the Pokedex based upon the acitve filters
  getFilteredDex = () => {
    const { filters, lists } = this.state;
    const {
      generations,
      onlyChecked,
      onlyUnchecked,
      showEventForms,
      search,
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
      if (search.length > 0) {
        if (
          !pokedex[number].name.toLowerCase().includes(search.toLowerCase()) &&
          !pokedex[number].number.toLowerCase().includes(search.toLowerCase())
        ) {
          add = false;
        }
      }
      if (onlyChecked && lists[type].indexOf(number) === -1) {
        add = false;
      }
      if (onlyUnchecked && lists[type].indexOf(number) > -1) {
        add = false;
      }
      if (!showEventForms && number.length > 6) {
        add = false;
      }
      if (
        generations.length > 0 &&
        generations.indexOf(pokedex[number].generation) === -1
      ) {
        add = false;
      }

      if (add) {
        entries[number] = pokedex[number];
      }
    });

    return entries;
  };

  // Update the current checklist, and update the progress bar with the count
  handleCheck = number => {
    const { lists, filters } = this.state;
    const { type } = filters;

    if (lists[type].indexOf(number) > -1) {
      lists[type].splice(lists[type].indexOf(number), 1);
    } else {
      lists[type].push(number);
    }
    let filteredDex = this.getFilteredDex();
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
        this.setState({
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
    localStorage.setItem(
      "victory_road_checklist_filters",
      JSON.stringify(filters)
    );
    this.setState({ filters: filters });
  };

  // Determine the current type, and update the filters
  handleTypeChange = type => {
    const { filters } = this.state;
    let newFilters = Object.assign({}, filters);
    newFilters.type = type;
    this.handleSetFilters(newFilters);
  };

  // Render all the pokedex entries for the current checklist type
  renderEntries = filteredDex => {
    const { filters, lists } = this.state;
    const { type } = filters;
    let entries = [];
    let oThis = this;
    let i = 0;

    Object.keys(filteredDex).forEach(function(number) {
      entries.push(
        <Entry
          checked={lists[type] && lists[type].indexOf(number) > -1}
          entry={pokedex[number]}
          handleCheck={() => oThis.handleCheck(number)}
          key={i}
          listType={type}
          number={number}
        />
      );
      i++;
    });

    return entries;
  };

  render() {
    const { filters, lists, saveState } = this.state;
    const { user } = this.props;
    const { type } = filters;

    if (lists[type]) {
      let filteredDex = this.getFilteredDex();
      if (this.child) {
        let count = this.getCheckedCount(filteredDex);
        this.child.setCounts({
          checked: count,
          total: Object.keys(filteredDex).length
        });
      }

      return (
        <div className={styles["checklist-container"]}>
          <Progress
            checkedCount={this.getCheckedCount(filteredDex)}
            handleSave={this.handleSave}
            listType={type}
            onRef={ref => (this.child = ref)}
            totalCount={Object.keys(filteredDex).length}
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
          <Grid>{this.renderEntries(filteredDex)}</Grid>
          <ChecklistSidebar
            filters={filters}
            handleSave={this.handleSave}
            saveState={saveState}
            setFilters={filters => this.handleSetFilters(filters)}
            user={user}
          />
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
  user: PropTypes.object.isRequired
};
