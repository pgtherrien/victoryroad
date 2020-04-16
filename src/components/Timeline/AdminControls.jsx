import React from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

import styles from "./Timeline.module.css";

const AdminControls = ({ handleOpenAdd }) => {
  return (
    <div className={styles.adminControls}>
      <Typography
        className={styles.adminControlsTitle}
        color="textSecondary"
        variant="body1"
      >
        Admin Controls
      </Typography>
      <List>
        <ListItem button onClick={handleOpenAdd}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Event" />
        </ListItem>
      </List>
    </div>
  );
};

AdminControls.propTypes = {
  handleOpenAdd: PropTypes.func.isRequired,
};

export default AdminControls;
