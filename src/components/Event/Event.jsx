import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

import Countdown from "../Countdown";

const useStyles = makeStyles(theme => ({
  background: {
    opacity: ".2"
  },
  card: {
    backgroundColor: "#333333",
    margin: "1% 2% 1% 2%",
    minHeight: "300px"
  },
  countdown: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      fontSize: "xx-large",
      width: "15%"
    },
    alignItems: "center",
    display: "none",
    fontSize: "large",
    height: "250px",
    position: "absolute",
    right: 0,
    top: 0,
    width: "40%"
  },
  edit: {
    bottom: "20px",
    position: "absolute",
    right: "20px"
  },
  icon: {
    [theme.breakpoints.up("md")]: {
      left: "70px"
    },
    height: "200px",
    left: "25%",
    position: "absolute",
    top: "20px",
    width: "200px"
  }
}));

export default function Event(props) {
  const { event, isAdmin, setEditEvent } = props;
  const classes = useStyles();

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

  return (
    <Grid item xs={12}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.background}
            component="img"
            height="250"
            image={event.background}
          />
          <CardContent>
            <Typography component="h2" gutterBottom variant="h4">
              {event.title}
            </Typography>
            <Typography color="textSecondary" component="p" variant="body2">
              {renderRange(event.startDate, event.endDate)}
            </Typography>
            {isAdmin && (
              <SettingsIcon
                className={classes.edit}
                onClick={() => setEditEvent(event)}
                title="Edit Event"
              />
            )}
          </CardContent>
          <CardMedia className={classes.icon} image={event.icon} />
          <div className={classes.countdown}>
            {new Date() > event.startDate ? (
              <Countdown label={"Ends"} date={event.endDate} />
            ) : (
              <Countdown label={"Begins"} date={event.startDate} />
            )}
          </div>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
