import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  Row
} from "shards-react";

import { useUserContext } from "../../contexts/user_context";
import styles from "./Header.module.css";
import { auth } from "../../firebase";

function Header() {
  const [profileState, setProfileState] = useState({
    isOpen: false
  });
  const { actions, state } = useUserContext();
  const { user } = state;

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        actions.persistUser(user);
      }
    });
  }, [actions]);

  return (
    <Nav className={styles["header-nav"]}>
      <Container className={styles["header-container"]}>
        <Row className={styles["header-row"]}>
          <Col>
            <NavItem className={styles["header-navicon"]}>Icon</NavItem>
          </Col>
          <Col />
          <Col />
          <Col />
          <Col>
            <NavLink className={styles["header-navitem"]} href="/">
              <span className={styles["header-navitem-text"]}>Events</span>
            </NavLink>
          </Col>
          <Col>
            <NavLink className={styles["header-navitem"]} href="/checklist">
              <span className={styles["header-navitem-text"]}>Checklists</span>
            </NavLink>
          </Col>
          <Col>
            <NavLink className={styles["header-navitem"]} href="/pokebox">
              <span className={styles["header-navitem-text"]}>Pokebox</span>
            </NavLink>
          </Col>
          <Col />
          <Col />
          <Col />
          <Col>
            <NavItem
              className={styles["header-navitem"]}
              onClick={() => {
                setProfileState({
                  isOpen: !profileState.isOpen
                });
              }}
            >
              {user ? (
                <img
                  alt="profile"
                  className={styles["header-profile-img"]}
                  src={user.photoURL}
                />
              ) : (
                <button onClick={actions.signIn}>Log In</button>
              )}
            </NavItem>
            <Dropdown open={profileState.isOpen}>
              <DropdownMenu right className={styles["header-profile-dropdown"]}>
                <DropdownItem>Sign Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </Nav>
  );
}

export default Header;
