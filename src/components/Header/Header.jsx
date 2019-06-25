import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Container,
  Dropdown,
  Icon,
  Image,
  Menu,
  Responsive
} from "semantic-ui-react";

import styles from "./Header.module.css";
import EventModal from "../EventModal";
import MobileSidebar from "../MobileSidebar";

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showEventModal: false,
      showMobileSidebar: false,
      tab: window.location.pathname
    };
  }

  render() {
    const { actions, admins, user } = this.props;
    const { showEventModal, showMobileSidebar, tab } = this.state;

    return (
      <React.Fragment>
        <Menu className={styles["header-container"]} size="huge">
          <Responsive
            as={Menu.Item}
            className={styles["header-tab"]}
            maxWidth={Responsive.onlyMobile.maxWidth}
            onClick={() => this.setState({ showMobileSidebar: true })}
          >
            <Icon inverted name="bars" />
          </Responsive>
          <Responsive
            as={Container}
            className={styles["header-tabs"]}
            minWidth={Responsive.onlyTablet.minWidth}
          >
            <Menu.Item
              as={Link}
              className={
                tab === "/"
                  ? `${styles["header-tab"]} ${styles["header-tab-event"]} ${
                      styles["header-tab-active"]
                    }`
                  : `${styles["header-tab"]} ${styles["header-tab-event"]}`
              }
              name="events"
              onClick={() => this.setState({ tab: "/" })}
              to=""
            >
              <span className={styles["header-font"]}>Events</span>
            </Menu.Item>
            <Menu.Item
              as={Link}
              className={
                tab === "/checklist"
                  ? `${styles["header-tab"]} ${styles["header-tab-active"]}`
                  : styles["header-tab"]
              }
              name="checklists"
              onClick={() => this.setState({ tab: "/checklist" })}
              to="checklist"
            >
              <span className={styles["header-font"]}>Checklists</span>
            </Menu.Item>
            <Menu.Item
              as={Link}
              className={
                tab === "/pokebox"
                  ? `${styles["header-tab"]} ${styles["header-tab-active"]}`
                  : styles["header-tab"]
              }
              name="pokebox"
              onClick={() => this.setState({ tab: "/pokebox" })}
              to="pokebox"
            >
              <span className={styles["header-font"]}>Pokébox</span>
            </Menu.Item>
            {user ? (
              <Dropdown
                className={styles["header-tab-profile"]}
                direction="left"
                icon={null}
                item
                simple
                trigger={
                  <Responsive
                    as={Image}
                    avatar
                    className={styles["header-center"]}
                    minWidth={Responsive.onlyTablet.minWidth}
                    src={user.photoURL}
                  />
                }
              >
                <Dropdown.Menu
                  className={styles["header-tab-profile-dropdown"]}
                >
                  {admins.includes(user.uid) ? (
                    <Dropdown.Item
                      onClick={() => this.setState({ showEventModal: true })}
                    >
                      <Icon name="calendar plus" />
                      <span className="text">Create Event</span>
                    </Dropdown.Item>
                  ) : (
                    <React.Fragment />
                  )}
                  <Dropdown.Item onClick={actions.signOut}>
                    <Icon name="sign out" />
                    <span className="text">Sign Out</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Menu.Item
                className={`${styles["header-tab-profile"]} ${
                  styles["header-tab-sign-in"]
                }`}
                onClick={actions.signIn}
              >
                <span className={styles["header-font"]}>Sign In</span>
              </Menu.Item>
            )}
          </Responsive>
        </Menu>
        <Responsive
          actions={actions}
          as={MobileSidebar}
          admins={admins}
          maxWidth={Responsive.onlyMobile.maxWidth}
          onHide={() => this.setState({ showMobileSidebar: false })}
          tab={window.location.pathname}
          toggleEventModal={() =>
            this.setState({ showEventModal: !showEventModal })
          }
          user={user}
          visible={showMobileSidebar}
        />
        {showEventModal ? (
          <EventModal
            onClose={() => {
              this.setState({ showEventModal: false });
            }}
            user={user}
          />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
  user: PropTypes.object
};

export default Header;
