import React from "react";
import FireStoreParser from "firestore-parser";

import EventCard from "../Cards/EventCard";
import { firestoreURL } from "../../constants/constants";
import styles from "./Timeline.module.css";

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

  // Gather the events, preformat the data, and sort by startDate
  componentWillMount() {
    let events = {
      current: [],
      past: [],
      upcoming: []
    };

    fetch(`${firestoreURL}events`)
      .then(response => response.json())
      .then(json => FireStoreParser(json))
      .then(json => {
        Object.keys(json.documents).forEach(function(index) {
          let event = json.documents[index].fields;
          event.metadata = JSON.parse(event.metadata);
          event.startDate = new Date(event.startDate);
          event.endDate = new Date(event.endDate);
          if (new Date() > event.endDate) {
            events.past.push(event);
          } else if (new Date() < event.startDate) {
            events.upcoming.push(event);
          } else {
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
    let renderedEvents = [];
    let i = 0;
    current.forEach(function(event) {
      renderedEvents.push(<EventCard key={i} {...event} />);
      i++;
    });
    upcoming.forEach(function(event) {
      renderedEvents.push(<EventCard key={i} {...event} />);
      i++;
    });
    return <ul className={styles["timeline"]}>{renderedEvents}</ul>;
  }
}

export default Timeline;
