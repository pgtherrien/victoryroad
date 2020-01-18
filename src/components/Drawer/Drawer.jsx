import React from "react";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
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
        <Divider />
        <List component="nav">
          <ListItem button component={Link} to="">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary={"Events"} />
          </ListItem>
          <ListItem button component={Link} to="checklist">
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Checklists"} />
          </ListItem>{" "}
        </List>
      </MaterialDrawer>
    </ClickAwayListener>
  );
}
