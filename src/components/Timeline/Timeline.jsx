import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";

import { db } from "../../utils/firebase";
import EventModal from "../EventModal";
import EventRow from "../EventRow";
import styles from "./Timeline.module.css";

const useStyles = makeStyles(theme => ({
  timeline: {
    [theme.breakpoints.up("md")]: {
      paddingTop: "90px"
    },
    backgroundColor: "#212121",
    height: "100%",
    paddingTop: "70px"
  }
}));

export default function Timeline(props) {
  const { admins, handleSelectEditEvent, user } = props;
  const [events, setEvents] = useState({
    current: [],
    past: [],
    upcoming: []
  });
  const [selectedEventID, setSelectedEventID] = useState("");
  const classes = useStyles();
  let i = 0;
  let renderedEvents = [
    <Typography
      className={styles.dividerText}
      color="textSecondary"
      key="dividerActive"
      variant="caption"
    >
      ACTIVE
    </Typography>
  ];
  let selectedEvent = {};

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

  events.current.forEach(function(event) {
    if (event.id === selectedEventID) {
      selectedEvent = event;
    }

    renderedEvents.push(
      <EventRow
        event={event}
        handleSelectEditEvent={handleSelectEditEvent}
        handleSelectEvent={setSelectedEventID}
        isAdmin={admins.includes(user.uid)}
        key={i}
        user={user}
      />
    );
    i++;
  });

  renderedEvents.push(
    <Typography
      className={styles.dividerText}
      color="textSecondary"
      key="dividerUpcoming"
      variant="caption"
    >
      UPCOMING
    </Typography>
  );

  events.upcoming.forEach(function(event) {
    if (event.id === selectedEventID) {
      selectedEvent = event;
    }

    renderedEvents.push(
      <EventRow
        event={event}
        handleSelectEditEvent={handleSelectEditEvent}
        handleSelectEvent={setSelectedEventID}
        isAdmin={admins.includes(user.uid)}
        key={i}
        user={user}
      />
    );
    i++;
  });

  if (events.current.length > 0 || events.upcoming.length > 0) {
    return (
      <div className={classes.timeline}>
        <Grid className={styles.container} container spacing={3}>
          {renderedEvents}
        </Grid>
        <div className={styles.footer}>
          <Button
            href="https://github.com/pgtherrien/victoryroad"
            startIcon={<GitHubIcon />}
            style={{ height: "50%" }}
          >
            GitHub
          </Button>
        </div>
        {selectedEventID !== "" && (
          <EventModal
            event={selectedEvent}
            handleClose={() => setSelectedEventID("")}
          />
        )}
      </div>
    );
  } else {
    return <CircularProgress className={styles.loading} />;
  }
}
