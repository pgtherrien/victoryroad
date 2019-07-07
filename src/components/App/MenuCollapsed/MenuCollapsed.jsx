import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon, Menu, Popup, Responsive } from "semantic-ui-react";

import styles from "../App.module.css";

export default class MenuCollapsed extends React.PureComponent {
  render() {
    const { authSignIn, authSignOut, handleShowSidebar, user } = this.props;

    return (
      <Menu
        className={
          window.innerWidth > Responsive.onlyComputer.minWidth
            ? styles["menu-collapsed"]
            : styles["menu-collapsed-mobile"]
        }
        inverted
        vertical
      >
        <Responsive
          as={Menu.Item}
          className={styles["menu-item"]}
          maxWidth={Responsive.onlyMobile.maxWidth}
        >
          <Icon inverted name="bars" onClick={handleShowSidebar} size="big" />
        </Responsive>
        <Responsive
          as={Popup}
          content="Sidebar"
          inverted
          minWidth={Responsive.onlyComputer.minWidth}
          position="right center"
          trigger={
            <Menu.Item className={styles["menu-item"]}>
              <Icon
                inverted
                name="bars"
                onClick={handleShowSidebar}
                size="big"
              />
            </Menu.Item>
          }
        />
        <Responsive
          as={Popup}
          content="Events"
          inverted
          minWidth={Responsive.onlyComputer.minWidth}
          position="right center"
          trigger={
            <Menu.Item as={Link} className={styles["menu-item"]} to="">
              <Icon inverted name="calendar alternate outline" size="big" />
            </Menu.Item>
          }
        />
        <Responsive
          as={Popup}
          content="Checklists"
          inverted
          minWidth={Responsive.onlyComputer.minWidth}
          position="right center"
          trigger={
            <Menu.Item as={Link} className={styles["menu-item"]} to="checklist">
              <Icon inverted name="check square outline" size="big" />
            </Menu.Item>
          }
        />
        <Responsive
          as={Popup}
          content="Pokébox"
          inverted
          minWidth={Responsive.onlyComputer.minWidth}
          position="right center"
          trigger={
            <Menu.Item as={Link} className={styles["menu-item"]} to="pokebox">
              <Icon inverted name="hdd outline" size="big" />
            </Menu.Item>
          }
        />
        {user ? (
          <Responsive
            as={Popup}
            content="Sign Out"
            inverted
            minWidth={Responsive.onlyComputer.minWidth}
            position="right center"
            trigger={
              <Menu.Item
                className={`${styles["menu-item"]} ${
                  styles["menu-item-auth"]
                } `}
                onClick={authSignOut}
              >
                <Icon inverted name="sign out" size="big" />
              </Menu.Item>
            }
          />
        ) : (
          <Responsive
            as={Popup}
            content="Sign In"
            inverted
            minWidth={Responsive.onlyComputer.minWidth}
            position="right center"
            trigger={
              <Menu.Item
                className={`${styles["menu-item"]} ${
                  styles["menu-item-auth"]
                } `}
                onClick={authSignIn}
              >
                <Icon inverted name="sign in" size="big" />
              </Menu.Item>
            }
          />
        )}
      </Menu>
    );
  }
}

MenuCollapsed.propTypes = {
  authSignIn: PropTypes.func.isRequired,
  authSignOut: PropTypes.func.isRequired,
  handleShowSidebar: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
