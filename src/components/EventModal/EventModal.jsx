import React from "react";
import {
  Avatar,
  Card,
  CardMedia,
  GridList,
  GridListTile,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Modal,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Sprite from "../Sprite";

const useStyles = makeStyles(theme => ({
  background: {
    opacity: ".2"
  },
  card: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "20px",
    boxShadow: theme.shadows[5],
    left: "50%",
    maxHeight: "75%",
    minHeight: "400px",
    outline: 0,
    overflowY: "auto",
    position: "absolute",
    right: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%"
  },
  content: {
    padding: theme.spacing(3, 4, 5)
  },
  sectionTitle: {
    marginTop: "20px",
    textAlign: "center",
    width: "100%"
  },
  title: {
    margin: "0 auto",
    width: "90%"
  },
  titleContainer: {
    [theme.breakpoints.up("md")]: {
      top: "150px"
    },
    position: "absolute",
    top: "100px",
    width: "100%"
  }
}));

export default function EventModal(props) {
  const { event, handleClose } = props;
  const classes = useStyles();

  const renderList = (field, label) => {
    return event[field] && event[field].length > 0 ? (
      <List
        component="nav"
        aria-labelledby={`${field}-header`}
        style={{ marginTop: "20px" }}
        subheader={
          <ListSubheader
            component="div"
            id={`${field}-header`}
            className={classes.sectionTitle}
          >
            {label}
          </ListSubheader>
        }
      >
        {event[field].map(item => (
          <ListItem alignItems="center" key={item.text}>
            <ListItemAvatar>
              <Avatar src={item.image} />
            </ListItemAvatar>
            <ListItemText secondary={item.text} />
          </ListItem>
        ))}
      </List>
    ) : null;
  };

  // Determine the best format of the date range to display
  const renderRange = (startDate, endDate) => {
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate() &&
      startDate.getHours() === endDate.getHours()
    ) {
      return (
        startDate.toDateString() +
        " at " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      return (
        startDate.toDateString() +
        " from " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true }) +
        " - " +
        endDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else {
      return startDate.toDateString() + " - " + endDate.toDateString();
    }
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  let shinyCols = event.newShinies ? event.newShinies.length : 0;
  if (shinyCols > 3) {
    shinyCols = 3;
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={true}
      onClose={handleClose}
    >
      <Card className={classes.card}>
        <CardMedia
          className={classes.background}
          component="img"
          height="300"
          image={event.background}
        />
        <div className={classes.titleContainer}>
          <Typography
            align="center"
            className={classes.title}
            component="h2"
            gutterBottom
            variant="h4"
          >
            {event.title}
          </Typography>
          <Typography align="center" component="p" variant="body2">
            {renderRange(event.startDate, event.endDate)}
          </Typography>
        </div>
        <div className={classes.content}>
          <Typography
            align="center"
            color="textSecondary"
            component="p"
            variant="body2"
          >
            {event.summary}
          </Typography>
          {event.newShinies && event.newShinies.length > 0 && (
            <GridList cellHeight={matches ? 250 : 100} cols={shinyCols}>
              {event.newShinies.map(shiny => (
                <GridListTile
                  cols={1}
                  key={shiny}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Sprite
                    size={matches ? "full" : "small"}
                    showShiny={true}
                    src={shiny}
                  />
                </GridListTile>
              ))}
            </GridList>
          )}
          {event.perfectIV && event.perfectIV[0].length > 0 && (
            <React.Fragment>
              <ListSubheader component="div" className={classes.sectionTitle}>
                Perfect IV's
              </ListSubheader>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GridList cellHeight={100} cols={2} style={{ width: "300px" }}>
                  <GridListTile
                    col={1}
                    style={{
                      borderRight: "1px solid #C3C3BE",
                      height: "45px"
                    }}
                  >
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="h4"
                    >
                      {event.perfectIV[0]}
                    </Typography>
                  </GridListTile>
                  <GridListTile
                    col={1}
                    style={{
                      borderLeft: "1px solid #C3C3BE",
                      height: "45px"
                    }}
                  >
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="h4"
                    >
                      {event.perfectIV[1]}
                    </Typography>
                  </GridListTile>
                </GridList>
              </div>
            </React.Fragment>
          )}
          {renderList("bonuses", "Bonuses")}
          {renderList("features", "Features")}
        </div>
      </Card>
    </Modal>
  );
}
