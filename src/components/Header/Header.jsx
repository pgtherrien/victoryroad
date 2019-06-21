import React, { useEffect, useState } from "react";
import {
  Container,
  Dropdown,
  Icon,
  Image,
  Menu,
  Responsive
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useUserContext } from "../../contexts/user_context";
import styles from "./Header.module.css";
import { auth } from "../../firebase";

function Header() {
  const [tabState, setTabState] = useState({
    pathname: window.location.pathname
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
    <Menu className={styles["header-wrapper"]} inverted size="huge" stackable>
      <Menu.Item>
        <img
          alt="app"
          className={styles["header-center"]}
          src="/images/misc/pokeball.png"
        />
      </Menu.Item>
      <Responsive
        as={Container}
        className={styles["header-items-wrapper"]}
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <Menu.Item
          active={tabState.pathname === "/"}
          as={Link}
          className={styles["header-item"]}
          name="events"
          onClick={() => setTabState({ pathname: "/" })}
          to=""
        >
          <span className={styles["header-center"]}>Events</span>
        </Menu.Item>
        <Menu.Item
          active={tabState.pathname.includes("checklist")}
          as={Link}
          className={styles["header-item"]}
          name="checklists"
          onClick={() => setTabState({ pathname: "/checklist" })}
          to="checklist"
        >
          <span className={styles["header-center"]}>Checklists</span>
        </Menu.Item>
        <Menu.Item
          active={tabState.pathname.includes("pokebox")}
          as={Link}
          className={styles["header-item"]}
          name="pokebox"
          onClick={() => setTabState({ pathname: "/pokebox" })}
          to="pokebox"
        >
          <span className={styles["header-center"]}>Pokébox</span>
        </Menu.Item>
      </Responsive>
      <Responsive
        as={Container}
        className={styles["header-items-wrapper-mobile"]}
        {...Responsive.onlyMobile}
      >
        <Menu.Item
          active={tabState.pathname === "/"}
          as={Link}
          className={styles["header-item"]}
          name="events"
          onClick={() => setTabState({ pathname: "/" })}
          to=""
        >
          <span className={styles["header-center"]}>Events</span>
        </Menu.Item>
        <Menu.Item
          active={tabState.pathname.includes("checklist")}
          as={Link}
          className={styles["header-item"]}
          name="checklists"
          onClick={() => setTabState({ pathname: "/checklist" })}
          to="checklist"
        >
          <span className={styles["header-center"]}>Checklists</span>
        </Menu.Item>
        <Menu.Item
          active={tabState.pathname.includes("pokebox")}
          as={Link}
          className={styles["header-item"]}
          name="pokebox"
          onClick={() => setTabState({ pathname: "/pokebox" })}
          to="pokebox"
        >
          <span className={styles["header-center"]}>Pokébox</span>
        </Menu.Item>
      </Responsive>
      {user ? (
        <Dropdown
          direction="left"
          icon={null}
          item
          simple
          trigger={
            <Image
              avatar
              className={styles["header-center"]}
              src={user.photoURL}
            />
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={actions.signOut}>
              <Icon name="sign out" />
              <span className="text">Sign Out</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Menu.Item onClick={actions.signIn}>
          <span className={styles["header-center"]}>Sign In</span>
        </Menu.Item>
      )}
    </Menu>
  );
}

export default Header;
