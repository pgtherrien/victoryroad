import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useUserContext } from "../../contexts/user_context";
import styles from "./Header.module.css";
import { auth } from "../../firebase";

function Header() {
  const [profileMenuState, setProfileMenuState] = useState({
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
    <div className={styles["header-container"]}>
      {user ? (
        <div className={styles["header-profile"]}>
          <img
            alt="profile"
            className={styles["header-profile-img"]}
            onClick={() => {
              setProfileMenuState({
                isOpen: !profileMenuState.isOpen
              });
            }}
            src={user.photoURL}
          />
          {profileMenuState.isOpen ? (
            <div className={styles["header-profile-menu"]}>Menu is open</div>
          ) : (
            <div />
          )}
        </div>
      ) : (
        <button onClick={actions.signIn}>Log In</button>
      )}
    </div>
  );
}

export default Header;
