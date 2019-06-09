import React from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown-now";

import styles from "./Timeline.module.css";

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

  renderTags = tags => {
    let badges = [];
    let i = 0;

    tags.forEach(function(tag) {
      badges.push(
        <div className={styles["event-tag"]} key={i}>
          <b>{tag}</b>
        </div>
      );
      i++;
    });

    return badges;
  };

  render() {
    const { endDate, eventType, startDate, tags, title } = this.props;
    const { mouseInside } = this.state;

    return (
      <li>
        <time className={styles["event-time"]}>
          <span>
            {`${startDate.getUTCMonth() +
              1}/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`}
          </span>
          <span>
            {startDate.toLocaleString("en-US", {
              hour: "numeric",
              hour12: true
            })}
          </span>
        </time>
        <div className={styles["event-icon"]}>
          <img src={"images/pokeball.png"} />
        </div>
        <div
          className={styles["event-content"]}
          onMouseEnter={() => this.setState({ mouseInside: true })}
          onMouseLeave={() => this.setState({ mouseInside: false })}
        >
          <img src={ICON_MAP[eventType]} />
          <h2>{title}</h2>
          {new Date() > startDate ? (
            <span>
              Event Ends: <Countdown date={endDate} />
            </span>
          ) : (
            <span>Event Ends: {endDate.toDateStriong()}</span>
          )}
          <div className={styles["event-tags"]}>{this.renderTags(tags)}</div>
          {mouseInside ? (
            <div className={styles["event-link"]}>
              <b className={styles["event-arrows"]}>>></b>
            </div>
          ) : (
            <div />
          )}
        </div>
      </li>
    );
  }
}

EventCard.propTypes = {
  endDate: PropTypes.object.isRequired,
  eventType: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  startDate: PropTypes.object.isRequired,
  summary: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default EventCard;
