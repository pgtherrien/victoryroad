import React from "react";
import PropTypes from "prop-types";
import { Icon, Input, Image, Menu, Radio, Sidebar } from "semantic-ui-react";

import styles from "../Checklist.module.css";

export default class ChecklistSidebarOpen extends React.PureComponent {
  render() {
    const {
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
            defaultValue={search}
            icon="search"
            onChange={event => handleSearch(event)}
            placeholder="Enter name or number..."
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <span>Only Checked</span>
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={onlyChecked}
            onChange={() => handleChange("onlyChecked")}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <span>Only Unchecked</span>
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={onlyUnchecked}
            onChange={() => handleChange("onlyUnchecked")}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <span>Show Event Forms</span>
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={showEventForms}
            onChange={() => handleChange("showEventForms")}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <Image avatar src="images/gens/kanto_white.ico" /> Kanto
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={generations.indexOf(1) > -1}
            onChange={() => handleChange(1)}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <Image avatar src="images/gens/johto_white.ico" /> Johto
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={generations.indexOf(2) > -1}
            onChange={() => handleChange(2)}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <Image avatar src="images/gens/hoenn_white.ico" /> Hoenn
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={generations.indexOf(3) > -1}
            onChange={() => handleChange(3)}
            toggle
          />
        </Menu.Item>
        <Menu.Item className={styles["filter-sidebar-item"]}>
          <Image avatar src="images/gens/sinnoh_white.ico" /> Sinnoh
          <Radio
            className={styles["filter-sidebar-radio"]}
            defaultChecked={generations.indexOf(4) > -1}
            onChange={() => handleChange(4)}
            toggle
          />
        </Menu.Item>
      </Sidebar>
    );
  }
}

ChecklistSidebarOpen.propTypes = {
  filters: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired
};
