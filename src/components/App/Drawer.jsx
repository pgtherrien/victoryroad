import React from "react";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  ClickAwayListener,
  Drawer as MaterialDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  Event as EventIcon
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  close: {
    borderRadius: 0,
    padding: "15px",
    width: "100%"
  },
  drawer: {
    flexShrink: 0,
    width: 240
  },
  drawerPaper: {
    backgroundColor: "#333333",
    width: 240
  }
}));

export default function Drawer(props) {
  const { handleDrawerClose } = props;
  const classes = useStyles();

  return (
    <ClickAwayListener
      onClickAway={e => {
        e.stopPropagation();
        handleDrawerClose();
      }}
    >
      <MaterialDrawer
        anchor="left"
        classes={{
          paper: classes.drawerPaper
        }}
        className={classes.drawer}
        open={true}
        variant="persistent"
      >
        <div>
          <Button className={classes.close} onClick={handleDrawerClose}>
            Close
          </Button>
        </div>
        <Divider />
        <List component="nav">
          <ListItem button component={Link} onClick={handleDrawerClose} to="">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary={"Events"} />
          </ListItem>
          <ListItem
            button
            component={Link}
            onClick={handleDrawerClose}
            to="checklist"
          >
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Checklists"} />
          </ListItem>
        </List>
      </MaterialDrawer>
    </ClickAwayListener>
  );
}
