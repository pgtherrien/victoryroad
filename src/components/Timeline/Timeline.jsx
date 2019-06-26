import React from "react";
import PropTypes from "prop-types";
import { Dimmer, Grid, Loader } from "semantic-ui-react";

import { db } from "../../firebase";
import styles from "./Timeline.module.css";
import Row from "./Row";

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: {
        current: [],
        past: [],
        upcoming: []
      }
    };
  }

  // Gather the events and format the data
  componentWillMount() {
    let events = {
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
            events.past.push(event);
          } else if (new Date() < event.startDate) {
            // If the event has not occured yet
            events.upcoming.push(event);
          } else {
            // Otherwise, the event is active
            events.current.push(event);
          }
        });
        events.current.sort(function compare(a, b) {
          return a.endDate - b.endDate;
        });
        events.upcoming.sort(function compaore(a, b) {
          return a.startDate - b.startDate;
        });
        this.setState({ events });
      });
  }

  render() {
    const { current, upcoming } = this.state.events;
    const { admins, insertEvent, user } = this.props;
    let renderedEvents = [];
    let i = 0;

    if (current.length > 0 || upcoming.length > 0) {
      current.forEach(function(event) {
        renderedEvents.push(
          <Row
            admins={admins}
            key={i}
            event={{ ...event }}
            insertEvent={insertEvent}
            user={user}
          />
        );
        i++;
      });
      upcoming.forEach(function(event) {
        renderedEvents.push(
          <Row
            admins={admins}
            key={i}
            event={{ ...event }}
            insertEvent={insertEvent}
            user={user}
          />
        );
        i++;
      });

      return (
        <div className={styles["timeline-grid"]}>
          <Grid columns={4} padded stackable verticalAlign="middle">
            {renderedEvents}
          </Grid>
        </div>
      );
    } else {
      return (
        <Dimmer active>
          <Loader>Loading Events</Loader>
        </Dimmer>
      );
    }
  }
}

Timeline.propTypes = {
  admins: PropTypes.array.isRequired,
  insertEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default Timeline;
