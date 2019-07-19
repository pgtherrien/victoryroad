import React from "react";
import PropTypes from "prop-types";
import { Icon, Menu, Popup, Responsive } from "semantic-ui-react";

import styles from "../Checklist.module.css";
import ChecklistSidebarOpen from "./ChecklistSidebarOpen";

let IGNORE_STRINGS = [
  "FORMS",
  "SPAWN",
  "BELUGA",
  "SETTINGS",
  "STORAGE",
  "NORMAL"
];

let FILE_READER;

export default class ChecklistSidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.fileInputRef = React.createRef();

    this.state = {
      showSidebar: false
    };
  }

  fileChange = file => {
    FILE_READER = new FileReader();
    FILE_READER.onloadend = this.handleNewGameMaster;
    FILE_READER.readAsText(file);
  };

  handleNewGameMaster = e => {
    let gameMaster = JSON.parse(FILE_READER.result);
    let output = {};
    let index;
    let add;

    gameMaster.itemTemplates.forEach(function(item) {
      add = true;
      IGNORE_STRINGS.forEach(function(ignore) {
        if (item.templateId.includes(ignore)) {
          add = false;
        }
      });

      if (add && item.templateId.includes("_POKEMON_")) {
        index = item.templateId.split("_")[0];
        index = index.split("V0")[1];

        if (!output[index]) {
          output[index] = [];
        }
        output[index].push(item);
      } else if (
        item.templateId.includes("_MOVE_") &&
        !item.templateId.includes("COMBAT_") &&
        !item.templateId.includes("ITEM")
      ) {
        output[item.moveSettings.movementId] = item;
      }
    });

    console.log(JSON.stringify(output));
  };

  handleChange = filter => {
    const { filters, setFilters } = this.props;
    let newFilters = Object.assign({}, filters);

    switch (filter) {
      case 1:
      case 2:
      case 3:
      case 4:
        if (newFilters.generations.indexOf(filter) > -1) {
          newFilters.generations.splice(
            newFilters.generations.indexOf(filter),
            1
          );
        } else {
          newFilters.generations.push(filter);
        }
        break;
      case "onlyChecked":
      case "onlyUnchecked":
      case "showEventForm":
      default:
        newFilters[filter] = !newFilters[filter];
        break;
    }

    setFilters(newFilters);
  };

  handleSearch = event => {
    const { filters, setFilters } = this.props;
    let newFilters = Object.assign({}, filters);

    newFilters.search = event.currentTarget.value;
    setFilters(newFilters);
  };

  render() {
    const {
      admins,
      clearFilters,
      filters,
      handleSave,
      saveState,
      setFilters,
      user
    } = this.props;
    const { showSidebar } = this.state;

    return (
      <React.Fragment>
        <ChecklistSidebarOpen
          clearFilters={clearFilters}
          filters={filters}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          onHide={() => this.setState({ showSidebar: false })}
          setFilters={setFilters}
          showSidebar={showSidebar}
        />
        <Menu
          className={
            window.innerWidth > Responsive.onlyMobile.maxWidth
              ? `${styles["filter-sidebar-collapsed"]} ${
                  styles["filter-sidebar-collapsed-full"]
                }`
              : styles["filter-sidebar-collapsed"]
          }
          inverted
          vertical
        >
          <Responsive
            as={Popup}
            content="Click to open filter menu"
            inverted
            minWidth={Responsive.onlyComputer.minWidth}
            on="hover"
            position="left center"
            trigger={
              <Menu.Item
                className={styles["filter-sidebar-item"]}
                onClick={() => this.setState({ showSidebar: true })}
              >
                <Icon inverted name="filter" size="large" />
              </Menu.Item>
            }
          />
          <Responsive
            as={Menu.Item}
            className={styles["filter-sidebar-item"]}
            maxWidth={Responsive.onlyTablet.maxWidth}
            onClick={() => this.setState({ showSidebar: true })}
          >
            <Icon inverted name="filter" size="large" />
          </Responsive>
          {user.uid && (
            <React.Fragment>
              <Responsive
                as={Popup}
                content={saveState.label}
                inverted
                minWidth={Responsive.onlyComputer.minWidth}
                on="hover"
                position="left center"
                trigger={
                  <Menu.Item
                    className={styles["filter-sidebar-item"]}
                    onClick={handleSave}
                  >
                    <Icon
                      inverted
                      color={saveState.color}
                      name={saveState.name}
                      size="large"
                    />
                  </Menu.Item>
                }
              />
              <Responsive
                as={Menu.Item}
                className={styles["filter-sidebar-item"]}
                maxWidth={Responsive.onlyTablet.maxWidth}
                onClick={handleSave}
              >
                <Icon inverted name={saveState.name} size="large" />
              </Responsive>
            </React.Fragment>
          )}
          {admins.includes(user.uid) && (
            <React.Fragment>
              <Popup
                content="Upload and parse a new Game Master file"
                inverted
                on="hover"
                position="left center"
                trigger={
                  <Menu.Item
                    className={styles["filter-sidebar-item"]}
                    onClick={() => this.fileInputRef.current.click()}
                  >
                    <Icon inverted name="upload" size="large" />
                  </Menu.Item>
                }
              />
              <input
                ref={this.fileInputRef}
                type="file"
                hidden
                onChange={e => this.fileChange(e.target.files[0])}
              />
            </React.Fragment>
          )}
        </Menu>
      </React.Fragment>
    );
  }
}

ChecklistSidebar.propTypes = {
  admins: PropTypes.array.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  saveState: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
