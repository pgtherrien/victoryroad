import React from "react";
import PropTypes from "prop-types";
import { Divider, Icon, Input, Menu, Radio, Sidebar } from "semantic-ui-react";
import { Swipeable } from "react-swipeable";

import styles from "../Checklist.module.css";
import utils from "../../utils";

export default class ChecklistSidebarOpen extends React.PureComponent {
  handleSetTag = tag => {
    const { filters, setFilters } = this.props;
    let newTags = Object.assign([], filters.tags);

    if (newTags.indexOf(tag) > -1) {
      newTags.splice(newTags.indexOf(tag), 1);
    } else {
      newTags.push(tag);
    }

    filters.tags = newTags;
    setFilters(filters);
  };

  renderTagFilters = () => {
    const { filters } = this.props;
    const tags = [
      "alolan",
      "baby",
      "legendary",
      "mythical",
      "regional",
      "starter"
    ];
    let oThis = this;
    let retval = [];
    let i = 0;

    tags.forEach(function(tag) {
      let displayTag = tag.split("_").join(" ");
      retval.push(
        <Menu.Item
          className={styles["filter-sidebar-item"]}
          key={i}
          onClick={() => oThis.handleSetTag(tag)}
        >
          {utils.toTitleCase(displayTag)}
          <Radio
            className={styles["filter-sidebar-radio"]}
            checked={filters.tags.includes(tag)}
            toggle
          />
        </Menu.Item>
      );
      i++;
    });

    return <React.Fragment>{retval}</React.Fragment>;
  };

  render() {
    const {
      clearFilters,
      filters,
      handleChange,
      handleSearch,
      onHide,
      showSidebar
    } = this.props;
    const {
      generations,
      onlyChecked,
      onlyUnchecked,
      search,
      showEventForms
    } = filters;

    return (
      <Swipeable onSwipedRight={onHide}>
        <Sidebar
          animation="overlay"
          as={Menu}
          className={styles["filter-sidebar"]}
          direction="right"
          inverted
          onHide={onHide}
          vertical
          visible={showSidebar}
          width="wide"
        >
          <Menu.Item
            className={`${styles["filter-sidebar-item"]} ${
              styles["filter-sidebar-title"]
            }`}
            onClick={() => onHide()}
          >
            Filters
            <Icon
              className={styles["filter-sidebar-close"]}
              inverted
              name="angle right"
              size="big"
            />
          </Menu.Item>
          <Menu.Item
            className={`${styles["filter-sidebar-item"]} ${
              styles["filter-sidebar-search"]
            }`}
          >
            <Input
              value={search}
              icon="search"
              onChange={event => handleSearch(event)}
              placeholder="Enter name or number..."
            />
          </Menu.Item>
          <Menu.Item
            className={styles["filter-sidebar-item"]}
            onClick={() => handleChange("onlyChecked")}
          >
            <span>Only Checked</span>
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={onlyChecked}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={styles["filter-sidebar-item"]}
            onClick={() => handleChange("onlyUnchecked")}
          >
            <span>Only Unchecked</span>
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={onlyUnchecked}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={`${styles["filter-sidebar-item"]} ${
              styles["filter-sidebar-item-bottom"]
            }`}
            onClick={() => handleChange("showEventForms")}
          >
            <span>Show Event Forms</span>
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={showEventForms}
              toggle
            />
          </Menu.Item>
          <Divider horizontal inverted>
            Generations
          </Divider>
          <Menu.Item
            className={styles["filter-sidebar-item"]}
            onClick={() => handleChange(1)}
          >
            Kanto Region
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={generations.indexOf(1) > -1}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={styles["filter-sidebar-item"]}
            onClick={() => handleChange(2)}
          >
            Johto Region
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={generations.indexOf(2) > -1}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={styles["filter-sidebar-item"]}
            onClick={() => handleChange(3)}
          >
            Hoenn Region
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={generations.indexOf(3) > -1}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={`${styles["filter-sidebar-item"]} ${
              styles["filter-sidebar-item-bottom"]
            }`}
            onClick={() => handleChange(4)}
          >
            Sinnoh Region
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={generations.indexOf(4) > -1}
              toggle
            />
          </Menu.Item>
          <Menu.Item
            className={`${styles["filter-sidebar-item"]} ${
              styles["filter-sidebar-item-bottom"]
            }`}
            onClick={() => handleChange(5)}
          >
            Unova Region
            <Radio
              className={styles["filter-sidebar-radio"]}
              checked={generations.indexOf(5) > -1}
              toggle
            />
          </Menu.Item>
          <Divider horizontal inverted>
            Tags
          </Divider>
          {this.renderTagFilters()}
          <Menu.Item
            className={styles["filter-sidebar-clear-all"]}
            onClick={clearFilters}
          >
            <span>Clear All Filters</span>
          </Menu.Item>
        </Sidebar>
      </Swipeable>
    );
  }
}

ChecklistSidebarOpen.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired
};
