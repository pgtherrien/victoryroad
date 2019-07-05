import React from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Responsive,
  Segment
} from "semantic-ui-react";

import styles from "./Row.module.css";
import Countdown from "../Countdown";
import Event from "../Event";
import { EventModal } from "../../Modals";

class Row extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      mouseInside: false,
      showEventModal: false
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.expansionKey !== this.props.expansionKey &&
      this.state.expanded
    ) {
      this.setState({ expanded: false });
    }
  }

  // Determine whether to render a label, and what configuration to pass it
  buildLabel = (startDate, endDate) => {
    if (
      new Date() < startDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > startDate
    ) {
      // If the startDate has not passed, but is within 24 hours
      return this.renderLabel("blue", "Starting Soon");
    } else if (
      new Date() < endDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > endDate
    ) {
      // If the endDate has not passed, but is within 24 hours
      return this.renderLabel("orange", "Ending Soon");
    } else if (new Date() > startDate) {
      // Otherwise, if the startDate has passed the event is active
      return this.renderLabel("teal", "Active");
    }
  };

  // Render the ribbon label based off of the props
  renderLabel = (color, text) => {
    return (
      <Label className={styles["row-label"]} color={color} ribbon size="huge">
        {text}
      </Label>
    );
  };

  // Determine the best format of the date range to display
  renderRange = (startDate, endDate) => {
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate() &&
      startDate.getHours() === endDate.getHours()
    ) {
      return (
        startDate.toDateString() +
        " at " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      return (
        startDate.toDateString() +
        " from " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true }) +
        " - " +
        endDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else {
      return startDate.toDateString() + " - " + endDate.toDateString();
    }
  };

  render() {
    const {
      endDate,
      eventImage,
      eventType,
      startDate,
      title
    } = this.props.event;
    const { admins, user } = this.props;
    const { expanded, mouseInside, showEventModal } = this.state;
    let retval;

    switch (eventType) {
      case "recurring":
        retval = (
          <React.Fragment>
            <Divider className={styles["row-recurring"]} horizontal inverted>
              {title} - {startDate.toDateString()}{" "}
              {startDate.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true
              })}
            </Divider>
            <div className={styles["row-recurring-splitter"]} />
          </React.Fragment>
        );
        break;
      case "unique":
      default:
        retval = (
          <React.Fragment>
            <Grid.Row
              className={
                window.innerWidth > Responsive.onlyComputer.minWidth
                  ? expanded
                    ? styles["row-expanded"]
                    : styles["row"]
                  : styles["row-mobile"]
              }
              onClick={() => this.setState({ expanded: !expanded })}
              onMouseEnter={() => this.setState({ mouseInside: true })}
              onMouseLeave={() => this.setState({ mouseInside: false })}
            >
              <Grid.Column width={4}>
                {this.buildLabel(startDate, endDate)}
                <Image className={styles["row-image"]} src={eventImage} />
              </Grid.Column>

              <Grid.Column width={8}>
                <Segment
                  textAlign="center"
                  className={
                    window.innerWidth > Responsive.onlyComputer.minWidth
                      ? styles["row-title"]
                      : styles["row-title-mobile"]
                  }
                  inverted
                >
                  <Header as="h1">
                    {title}
                    <Header.Subheader
                      className={
                        window.innerWidth > Responsive.onlyComputer.minWidth
                          ? styles["row-range"]
                          : styles["row-range-mobile"]
                      }
                    >
                      {this.renderRange(startDate, endDate)}
                    </Header.Subheader>
                  </Header>
                </Segment>
              </Grid.Column>
              {new Date() > startDate ? (
                // Countdown if event has already begun
                <React.Fragment>
                  <Responsive
                    as={Grid.Column}
                    className={styles["row-countdown"]}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={4}
                  >
                    <Header inverted>
                      Ends <Countdown date={endDate} />
                    </Header>
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    className={styles["row-countdown-mobile"]}
                    {...Responsive.onlyMobile}
                    width={4}
                  >
                    <Header inverted>
                      Ends <Countdown date={endDate} />
                    </Header>
                  </Responsive>
                </React.Fragment>
              ) : (
                // Countdown if event is in the future
                <React.Fragment>
                  <Responsive
                    as={Grid.Column}
                    className={styles["row-countdown"]}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={4}
                  >
                    <Header inverted>
                      Starts <Countdown date={startDate} />
                    </Header>
                  </Responsive>
                  <Responsive
                    as={Grid.Column}
                    className={styles["row-countdown-mobile"]}
                    {...Responsive.onlyMobile}
                    width={4}
                  >
                    <Header inverted>
                      Starts <Countdown date={startDate} />
                    </Header>
                  </Responsive>
                </React.Fragment>
              )}
              {!expanded && mouseInside && admins.includes(user.uid) && (
                // displays the edit event modal
                <Responsive
                  as={Icon}
                  className={styles["row-edit"]}
                  inverted
                  minWidth={Responsive.onlyTablet.minWidth}
                  name="cogs"
                  onClick={() => this.setState({ showEventModal: true })}
                  title={`Edit ${title}`}
                />
              )}
              {mouseInside &&
                !expanded &&
                window.innerWidth > Responsive.onlyComputer.minWidth && (
                  <Label
                    attached="bottom"
                    className={styles["row-open"]}
                    color="teal"
                  >
                    <Icon
                      className={styles["row-open-icon"]}
                      inverted
                      name="angle down"
                    />
                    Show More
                    <Icon
                      className={styles["row-open-icon"]}
                      inverted
                      name="angle down"
                    />
                  </Label>
                )}
            </Grid.Row>
            {expanded && <Event {...this.props} />}
          </React.Fragment>
        );
        break;
    }
    return (
      <React.Fragment>
        {showEventModal && (
          <EventModal
            event={{ ...this.props.event }}
            onClose={() => {
              this.setState({ expanded: false, showEventModal: false });
            }}
            user={user}
          />
        )}
        {retval}
      </React.Fragment>
    );
  }
}

Row.propTypes = {
  admins: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  expansionKey: PropTypes.number.isRequired,
  insertEvent: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Row;