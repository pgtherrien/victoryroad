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
import Countdown from "../Countdown";

const useStyles = makeStyles(theme => ({
  actionArea: {
    display: "flex",
    justifyContent: "space-between",
    minHeight: "200px"
  },
  card: {
    backgroundColor: "#333333",
    margin: "0 2% 0 2%",
    minHeight: "200px"
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
    height: "200px",
    width: "40%"
  },
  fullImage: {
    [theme.breakpoints.up("md")]: {
      display: "flex"
    },
    display: "none",
    height: "140px",
    marginLeft: "5%",
    width: "140px"
  },
  mobileImage: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    },
    display: "flex",
    height: "140px",
    margin: "0 auto",
    width: "140px"
  },
  title: {
    margin: "0 auto",
    textAlign: "center"
  }
}));

export default function Event(props) {
  const { event } = props;
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
        <CardActionArea className={classes.actionArea}>
          <CardMedia className={classes.fullImage} image={event.icon} />
          <CardContent className={classes.title}>
            <CardMedia className={classes.mobileImage} image={event.icon} />
            <Typography gutterBottom variant="h4" component="h1">
              {event.title}
            </Typography>
            <Typography gutterBottom component="p">
              {renderRange(event.startDate, event.endDate)}
            </Typography>
          </CardContent>
          <CardContent className={classes.countdown}>
            {new Date() > event.startDate ? (
              <Countdown label={"Ends"} date={event.endDate} />
            ) : (
              <Countdown label={"Begins"} date={event.startDate} />
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
