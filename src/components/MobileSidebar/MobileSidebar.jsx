import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Divider,
  Header as SemanticHeader,
  Icon,
  Image,
  Menu,
  Sidebar
} from "semantic-ui-react";

import styles from "./MobileSidebar.module.css";

class MobileSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showEventModal: false,
      showSignout: false
    };
  }

  render() {
    const { showSignout } = this.state;
    const {
      actions,
      admins,
      onHide,
      tab,
      toggleEventModal,
      user,
      visible
    } = this.props;

    return (
      <Sidebar
        as={Menu}
        animation="overlay"
        className={styles["mobile-sidebar"]}
        icon="labeled"
        inverted
        onHide={onHide}
        vertical
        visible={visible}
        width="wide"
      >
        <Menu.Item className={styles["mobile-sidebar-app"]}>
          <img alt="cave" src="images/misc/cave.png" title="Victory Road" />
          <span>Victory Road</span>
        </Menu.Item>
        <Menu.Item as={Link} onClick={onHide} to="">
          <SemanticHeader inverted textAlign="left">
            <Icon name="calendar alternate outline" /> Events
          </SemanticHeader>
        </Menu.Item>
        <Menu.Item as={Link} onClick={onHide} to="checklist">
          <SemanticHeader inverted textAlign="left">
            <Icon name="check" /> Checklists
          </SemanticHeader>
        </Menu.Item>
        <Menu.Item as={Link} onClick={onHide} to="pokebox">
          <SemanticHeader inverted textAlign="left">
            <Icon name="computer" /> Pokébox
          </SemanticHeader>
        </Menu.Item>
        {user && admins.includes(user.uid) ? (
          <React.Fragment>
            <Divider horizontal inverted>
              Admin Controls
            </Divider>
            {tab === "/" ? (
              <Menu.Item
                onClick={() => {
                  toggleEventModal();
                }}
              >
                <SemanticHeader inverted textAlign="left">
                  <Icon name="calendar plus" /> Create Event
                </SemanticHeader>
              </Menu.Item>
            ) : (
              <React.Fragment />
            )}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {user ? (
          showSignout ? (
            <Menu.Item
              className={styles["mobile-sidebar-profile"]}
              onClick={actions.signOut}
            >
              <SemanticHeader inverted textAlign="left">
                <Icon name="sign out" /> Sign Out
              </SemanticHeader>
            </Menu.Item>
          ) : (
            <Menu.Item
              className={styles["mobile-sidebar-profile"]}
              onClick={() => this.setState({ showSignout: true })}
            >
              <SemanticHeader inverted textAlign="left">
                <Image as={Image} avatar src={user.photoURL} />{" "}
                {user.displayName}
              </SemanticHeader>
            </Menu.Item>
          )
        ) : (
          <Menu.Item
            className={styles["mobile-sidebar-profile"]}
            onClick={actions.signIn}
          >
            <SemanticHeader inverted textAlign="left">
              <Icon name="sign in" /> Sign In
            </SemanticHeader>
          </Menu.Item>
        )}
      </Sidebar>
    );
  }
}

MobileSidebar.propTypes = {
  actions: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  tab: PropTypes.string.isRequired,
  toggleEventModal: PropTypes.func.isRequired,
  user: PropTypes.object,
  visible: PropTypes.bool.isRequired
};

export default MobileSidebar;
