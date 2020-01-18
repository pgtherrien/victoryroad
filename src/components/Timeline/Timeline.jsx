import React, { useEffect, useState } from "react";

import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { db } from "../../firebase";
import Event from "../Event";

const useStyles = makeStyles(theme => ({
  container: {
    height: "100%",
    margin: "0 auto !important",
    width: "100% !important"
  },
  loading: {
    color: "#FFFFFF",
    left: "50%",
    position: "fixed",
    right: "50%",
    top: "50%"
  },
  timeline: {
    [theme.breakpoints.up("md")]: {
      paddingTop: "90px"
    },
    backgroundColor: "#212121",
    flexGrow: 1,
    height: "100%",
    paddingTop: "70px"
  }
}));

export default function Timeline(props) {
  const [events, setEvents] = useState({
    current: [],
    past: [],
    upcoming: []
  });

  // Get and set the events into state
  useEffect(() => {
    let updatedEvents = {
      current: [],
      past: [],
      upcoming: []
    };

    db.collection("events")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let event = doc.data();
          event.id = doc.id;
          event.startDate = new Date(event.startDate.toDate());
          event.endDate = new Date(event.endDate.toDate());
          if (new Date() > event.endDate) {
            // If this event has already ended
            updatedEvents.past.push(event);
          } else if (new Date() < event.startDate) {
            // If the event has not occured yet
            updatedEvents.upcoming.push(event);
          } else {
            // Otherwise, the event is active
            updatedEvents.current.push(event);
          }
        });
        updatedEvents.current.sort(function compare(a, b) {
          return a.endDate - b.endDate;
        });
        updatedEvents.upcoming.sort(function compaore(a, b) {
          return a.startDate - b.startDate;
        });
        setEvents(updatedEvents);
      });
  }, []);

  const { admins, insertEvent, user } = props;
  const classes = useStyles();
  let i = 0;
  let renderedEvents = [];

  events.current.forEach(function(event) {
    renderedEvents.push(
      <Event
        event={event}
        isAdmin={admins.includes(user.uid)}
        key={i}
        updateEvent={insertEvent}
      />
    );
    i++;
  });

  events.upcoming.forEach(function(event) {
    renderedEvents.push(
      <Event
        event={event}
        isAdmin={admins.includes(user.uid)}
        key={i}
        updateEvent={insertEvent}
      />
    );
    i++;
  });

  if (events.current.length > 0 || events.upcoming.length > 0) {
    return (
      <div className={classes.timeline}>
        <Grid className={classes.container} container spacing={3}>
          {renderedEvents}
        </Grid>
      </div>
    );
  } else {
    return <CircularProgress className={classes.loading} />;
  }
}
