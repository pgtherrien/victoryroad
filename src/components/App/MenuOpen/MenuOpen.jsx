import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swipeable } from "react-swipeable";
import { Icon, Image, Menu, Sidebar } from "semantic-ui-react";

import styles from "../App.module.css";

export default class MenuOpen extends React.PureComponent {
  render() {
    const { authSignIn, authSignOut, onHide, showSidebar, user } = this.props;
    return (
      <Swipeable onSwipedLeft={onHide}>
        <Sidebar
          animation="overlay"
          as={Menu}
          className={styles["menu-open"]}
          inverted
          onHide={onHide}
          vertical
          visible={showSidebar}
          width="wide"
        >
          <Menu.Item
            className={`${styles["menu-item"]} ${styles["menu-item-title"]}`}
            onClick={() => onHide()}
          >
            <Icon
              className={styles["menu-close"]}
              inverted
              name="angle left"
              size="big"
            />
            <span className={styles["menu-title"]}>Victory Road</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            className={styles["menu-item"]}
            onClick={() => onHide()}
            name="events"
            to=""
          >
            <Icon inverted name="calendar alternate outline" size="big" />
            <span>Events</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            className={styles["menu-item"]}
            onClick={() => onHide()}
            name="checklists"
            to="checklist"
          >
            <Icon inverted name="check square outline" size="big" />
            <span>Checklists</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            className={styles["menu-item"]}
            onClick={() => onHide()}
            name="pokebox"
            to="pokebox"
          >
            <Icon inverted name="hdd outline" size="big" /> <span>Pokébox</span>
          </Menu.Item>
          {user && user.uid ? (
            <div className={styles["menu-open-auth"]}>
              <Image
                as={Image}
                className={styles["menu-open-auth-pic"]}
                src={user.photoURL}
              />
              <Menu.Item className={styles["menu-item"]} onClick={authSignOut}>
                <Icon inverted name="sign out" size="big" />{" "}
                <span>Sign Out</span>
              </Menu.Item>
            </div>
          ) : (
            <div className={styles["menu-open-auth"]}>
              <Menu.Item className={styles["menu-item"]} onClick={authSignIn}>
                <Icon inverted name="sign in" size="big" /> <span>Sign In</span>
              </Menu.Item>
            </div>
          )}
        </Sidebar>
      </Swipeable>
    );
  }
}

MenuOpen.propTypes = {
  authSignIn: PropTypes.func.isRequired,
  authSignOut: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};
