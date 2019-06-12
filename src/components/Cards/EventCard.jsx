import React from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown-now";

import styles from "./Cards.module.css";

const ICON_MAP = {
  shiny: "images/shiny.png",
  migrations: "images/migrations.png",
  raidBoss: "images/raidBoss.png",
  standard: "images/standard.png"
};

class EventCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      mouseInside: false
    };
  }

  buildContent = () => {
    const { metadata } = this.props;
    const oThis = this;
    let content = [];
    Object.keys(metadata).forEach(function(title) {
      content.push(oThis.buildMetadata(title, metadata[title]));
    });
    return content;
  };

  buildMetadata = (title, data) => {
    let retval;

    switch (title) {
      case "New Shinies":
        let shinies = [];
        data.forEach(function(shiny) {
          shinies.push(<li>{shiny}</li>);
        });
        retval = <ul>{shinies}</ul>;
        break;
      case "Bonuses":
      case "Features":
      default:
        break;
    }
    return retval;
  };

  render() {
    const { endDate, eventType, startDate, title } = this.props;
    const { expanded, mouseInside } = this.state;

    return (
      <li className={styles["event-card"]}>
        <div className={styles["event-icon"]}>
          <img alt={eventType} src={ICON_MAP[eventType]} />
        </div>
        <div
          className={styles["event-content"]}
          onClick={() => {
            if (!expanded) {
              this.setState({ expanded: true });
            }
          }}
          onMouseEnter={() => this.setState({ mouseInside: true })}
          onMouseLeave={() => this.setState({ mouseInside: false })}
        >
          <div className={styles["event-title-container"]}>
            <h4 className={styles["event-title"]}>{title}</h4>
            {new Date() > startDate ? (
              <div className={styles["event-date"]}>
                Event Ends <Countdown date={endDate} />
              </div>
            ) : (
              <div className={styles["event-date"]}>
                Event Starts <Countdown date={startDate} />
              </div>
            )}
          </div>
          {mouseInside ? (
            <div className={styles["event-view"]}>View More</div>
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
  startDate: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default EventCard;
