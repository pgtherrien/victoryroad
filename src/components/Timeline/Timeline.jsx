import React from "react";
import FireStoreParser from "firestore-parser";

import { firestoreURL } from "../../constants/constants";
import styles from "./Timeline.module.css";
import { FilterButton } from "../Buttons";
import EventCard from "./EventCard";

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFilterOpen: false,
      events: [],
      filters: {
        pastEvents: false,
        type: []
      }
    };
  }

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

  renderEvents = () => {
    let events = [];
    let i = 0;
    this.state.events.forEach(function(event) {
      events.push(<EventCard key={i} {...event} />);
      i++;
    });
    return events;
  };

  render() {
    const { isFilterOpen } = this.state;

    return (
      <div className={styles["timeline-container"]}>
        <ul className={styles["timeline"]}>{this.renderEvents()}</ul>
        <FilterButton
          isOpen={isFilterOpen}
          text="Click to Open Filter Menu"
          toggle={() => this.setState({ isFilterOpen: !isFilterOpen })}
        />
      </div>
    );
  }
}

export default Timeline;
