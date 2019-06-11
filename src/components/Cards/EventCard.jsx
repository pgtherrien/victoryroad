import React from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown-now";

import styles from "./Cards.module.css";

const ICON_MAP = {
  communityDay: "images/communityDay.png",
  migrations: "images/migrations.png",
  raidBoss: "images/raidBoss.png",
  standard: "images/standard.png"
};

class EventCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mouseInside: false
    };
  }

  buildTags = tags => {
    let i = 0;
    let renderedTags = [];
    tags.forEach(function(tag) {
      renderedTags.push(
        <div className={styles["event-tag"]} key={i}>
          {tag}
        </div>
      );
      i++;
    });
    return renderedTags;
  };

  render() {
    const { endDate, eventType, startDate, tags, title } = this.props;
    const { mouseInside } = this.state;

    return (
      <li className={styles["event-card"]}>
        <div className={styles["event-icon"]}>
          <img alt={eventType} src={ICON_MAP[eventType]} />
        </div>
        <div
          className={styles["event-content"]}
          onMouseEnter={() => this.setState({ mouseInside: true })}
          onMouseLeave={() => this.setState({ mouseInside: false })}
        >
          <h3>{title}</h3>
          {new Date() > startDate ? (
            <span>
              Event Ends: <Countdown date={endDate} />
            </span>
          ) : (
            <span>Event Ends: {endDate.toDateStriong()}</span>
          )}
          <div className={styles["event-tags"]}> {this.buildTags(tags)}</div>
          {mouseInside ? <div className={styles["event-link"]} /> : <div />}
        </div>
      </li>
    );
  }
}

EventCard.propTypes = {
  endDate: PropTypes.object.isRequired,
  eventType: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default EventCard;
