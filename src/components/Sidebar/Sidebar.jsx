import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  ClickAwayListener,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  CheckBox as CheckBoxIcon,
  Event as EventIcon,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    flexShrink: 0,
    width: 240,
  },
  sidebarList: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  sidebarPaper: {
    backgroundColor: "#333333",
    width: 240,
  },
  sidebarTitle: {
    alignItems: "center",
    display: "flex",
    height: 64,
    justifyContent: "center",
  },
}));

const Sidebar = ({ handleClose, sidebarChildren }) => {
  const classes = useStyles();

  return (
    <ClickAwayListener
      onClickAway={(e) => {
        e.stopPropagation();
        handleClose();
      }}
    >
      <Drawer
        anchor="left"
        classes={{
          paper: classes.sidebarPaper,
        }}
        className={classes.sidebar}
        open={true}
        variant="persistent"
      >
        <Typography className={classes.sidebarTitle} noWrap variant="h6">
          Victory Road
        </Typography>
        <List className={classes.sidebarList} component="nav">
          <ListItem button component={Link} onClick={handleClose} to="">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Events"}
              primaryTypographyProps={{
                color:
                  window.location.pathname === "/"
                    ? "secondary"
                    : "textPrimary",
              }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem
            button
            component={Link}
            onClick={handleClose}
            to="checklist"
          >
            <ListItemIcon>
              <CheckBoxIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Checklists"}
              primaryTypographyProps={{
                color: window.location.pathname.includes("checklist")
                  ? "secondary"
                  : "textPrimary",
              }}
            />
          </ListItem>
        </List>
        {sidebarChildren}
      </Drawer>
    </ClickAwayListener>
  );
};

Sidebar.propTypes = {
  handleClose: PropTypes.func.isRequired,
  sidebarChildren: PropTypes.element,
};

export default Sidebar;
