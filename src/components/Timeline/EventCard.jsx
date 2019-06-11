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
    const { endDate, eventType, startDate, tags, title } = this.props.event;
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
          <img alt={eventType} src={ICON_MAP[eventType]} />
        </div>
        <div
          className={styles["event-content"]}
          onMouseEnter={() => this.setState({ mouseInside: true })}
          onMouseLeave={() => this.setState({ mouseInside: false })}
          onClick={() => this.props.onClick(this.props.event)}
        >
          <h4>{title}</h4>
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
              <span className="material-icons" id={styles["event-arrow"]}>
                arrow_forward_ios
              </span>
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
  event: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default EventCard;
