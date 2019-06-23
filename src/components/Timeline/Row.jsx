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

import styles from "./Timeline.module.css";
import Countdown from "./Countdown";
import Content from "./Content";
import { CreateEvent } from "../Modals";

class Row extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      mouseInside: false,
      showEventModal: false
    };
  }

  // Determine whether to render a label, and what configuration to pass it
  buildLabel = (startDate, endDate) => {
    if (
      new Date() < startDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > startDate
    ) {
      // If the startDate has not passed, but is within 24 hours
      return this.renderLabel("teal", "Starting Soon");
    } else if (
      new Date() < endDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > endDate
    ) {
      // If the endDate has not passed, but is within 24 hours
      return this.renderLabel("orange", "Ending Soon");
    } else if (new Date() > startDate) {
      // Otherwise, if the startDate has passed the event is active
      return this.renderLabel("blue", "Active");
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
            <Divider
              className={styles["timeline-recurring-row"]}
              horizontal
              inverted
            >
              {title} - {startDate.toDateString()}{" "}
              {startDate.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true
              })}
            </Divider>
            <div className={styles["timeline-recurring-splitter"]} />
          </React.Fragment>
        );
        break;
      case "unique":
      default:
        retval = (
          <Grid.Row
            className={styles["row"]}
            onClick={() => this.setState({ expanded: !expanded })}
            onMouseEnter={() => this.setState({ mouseInside: true })}
            onMouseLeave={() => this.setState({ mouseInside: false })}
          >
            <Grid.Column width={2}>
              {this.buildLabel(startDate, endDate)}
            </Grid.Column>
            <Grid.Column width={2}>
              <Image className={styles["row-image"]} src={eventImage} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment
                textAlign="center"
                className={styles["row-title"]}
                inverted
              >
                <Header as="h1">
                  {title}
                  <Header.Subheader className={styles["row-range"]}>
                    {this.renderRange(startDate, endDate)}
                  </Header.Subheader>
                </Header>
              </Segment>
            </Grid.Column>
            {new Date() > startDate ? (
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
            {mouseInside && !expanded ? (
              <Responsive
                as={Divider}
                className={styles["row-view"]}
                horizontal
                inverted
                minWidth={Responsive.onlyTablet.minWidth}
              >
                View More
              </Responsive>
            ) : (
              <React.Fragment />
            )}
            {mouseInside && admins.includes(user.uid) ? (
              <Responsive
                as={Icon}
                className={styles["row-edit"]}
                inverted
                minWidth={Responsive.onlyTablet.minWidth}
                name="cogs"
                onClick={() => this.setState({ showEventModal: true })}
                title={"Click to edit " + title}
              />
            ) : (
              <React.Fragment />
            )}
            {expanded ? <Content {...this.props} /> : <React.Fragment />}
          </Grid.Row>
        );
        break;
    }
    return (
      <React.Fragment>
        {showEventModal ? (
          <CreateEvent
            event={{ ...this.props.event }}
            onClose={() => {
              this.setState({ showEventModal: false });
            }}
            user={user}
          />
        ) : (
          <React.Fragment />
        )}
        {retval}
      </React.Fragment>
    );
  }
}

Row.propTypes = {
  admins: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object
};

export default Row;
