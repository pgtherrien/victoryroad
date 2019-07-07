import React from "react";
import PropTypes from "prop-types";
import { Icon, Menu, Popup, Responsive } from "semantic-ui-react";

import styles from "../Checklist.module.css";
import ChecklistSidebarOpen from "./ChecklistSidebarOpen";

export default class ChecklistSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false
    };
  }

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
    const { filters, handleSave, saveState, user } = this.props;
    const { showSidebar } = this.state;

    return (
      <React.Fragment>
        <ChecklistSidebarOpen
          filters={filters}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          onHide={() => this.setState({ showSidebar: false })}
          showSidebar={showSidebar}
        />
        <Menu className={styles["filter-sidebar-collapsed"]} inverted vertical>
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
                    <Icon inverted name={saveState.name} size="large" />
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
        </Menu>
      </React.Fragment>
    );
  }
}

ChecklistSidebar.propTypes = {
  filters: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  saveState: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
