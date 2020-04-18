import React, { Fragment, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { CircularProgress, Grid, Typography } from "@material-ui/core";

import { db } from "../../utils/firebase";
import AdminControls from "./AdminControls";
import AuthContext from "../../contexts/AuthContext";
import Event from "../Event";
import { EventModal } from "../Modals";
import EventRow from "../EventRow";
import Header from "../Header";
import styles from "./Timeline.module.css";

const Timeline = () => {
  const [editEvent, setEditEvent] = useState({});
  const [events, setEvents] = useState({
    current: [],
    past: [],
    upcoming: [],
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState("");
  const authContext = useContext(AuthContext);
  const { admins, user } = authContext;
  let i = 0;
  let renderedEvents = [
    <Typography
      className={clsx(styles.dividerText, styles.dividerTextFirst)}
      color="textSecondary"
      key="dividerActive"
      variant="caption"
    >
      ACTIVE
    </Typography>,
  ];
  let selectedEvent = {};

  // Get and set the events into state
  useEffect(() => {
    let updatedEvents = {
      current: [],
      past: [],
      upcoming: [],
    };

    db.collection("events")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
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

  events.current.forEach(function (event) {
    if (event.id === selectedEventID) {
      selectedEvent = event;
    }

    renderedEvents.push(
      <EventRow
        event={event}
        handleSelectEditEvent={(e) => {
          setEditEvent(e);
          setIsEventModalOpen(true);
        }}
        handleSelectEvent={setSelectedEventID}
        isAdmin={user ? admins.includes(user.uid) : false}
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

  events.upcoming.forEach(function (event) {
    if (event.id === selectedEventID) {
      selectedEvent = event;
    }

    renderedEvents.push(
      <EventRow
        event={event}
        handleSelectEditEvent={(e) => {
          setEditEvent(e);
          setIsEventModalOpen(true);
        }}
        handleSelectEvent={setSelectedEventID}
        isAdmin={user ? admins.includes(user.uid) : false}
        key={i}
        user={user}
      />
    );
    i++;
  });

  let contents = <CircularProgress className={styles.loading} />;
  if (events.current.length > 0 || events.upcoming.length > 0) {
    contents = (
      <div className={styles.timeline}>
        <Grid className={styles.container} container spacing={3}>
          {renderedEvents}
        </Grid>
        {selectedEventID !== "" && (
          <Event
            event={selectedEvent}
            handleClose={() => setSelectedEventID("")}
          />
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <Header
        showSearch={false}
        sidebarChildren={
          user &&
          admins.includes(user.uid) && (
            <AdminControls handleOpenAdd={() => setIsEventModalOpen(true)} />
          )
        }
      />
      {contents}
      {isEventModalOpen && (
        <EventModal
          event={editEvent}
          handleClose={() => {
            setEditEvent({});
            setIsEventModalOpen(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default Timeline;
