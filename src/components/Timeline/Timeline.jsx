import React from "react";
import FireStoreParser from "firestore-parser";

import EventCard from "../Cards/EventCard";
import { firestoreURL } from "../../constants/constants";
import styles from "./Timeline.module.css";

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  // Gather the events, preformat the data, and sort by startDate
  componentWillMount() {
    let events = [];
    fetch(`${firestoreURL}events`)
      .then(response => response.json())
      .then(json => FireStoreParser(json))
      .then(json => {
        Object.keys(json.documents).forEach(function(index) {
          let event = json.documents[index].fields;
          event.metadata = JSON.parse(event.metadata);
          event.startDate = new Date(event.startDate);
          event.endDate = new Date(event.endDate);
          events.push(event);
        });
        events.sort(function compare(a, b) {
          return a.startDate - b.startDate;
        });
        this.setState({ events });
      });
  }

  // renderEvents builds an EventCard for each event defined in the state
  renderEvents = events => {
    let i = 0;
    let renderedEvents = [];
    events.forEach(function(event) {
      renderedEvents.push(<EventCard key={i} {...event} />);
      i++;
    });
    return renderedEvents;
  };

  render() {
    const { events } = this.state;
    return <ul className={styles["timeline"]}>{this.renderEvents(events)}</ul>;
  }
}

export default Timeline;
