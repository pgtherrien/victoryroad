import React from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Grid,
  Header,
  Image,
  Label,
  Responsive,
  Segment
} from "semantic-ui-react";

import styles from "./Timeline.module.css";
import Countdown from "./Countdown";
import Content from "./Content";

class Row extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      mouseInside: false
    };
  }

  buildLabel = (startDate, endDate) => {
    if (
      new Date() < startDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > startDate
    ) {
      return this.renderLabel("teal", "Starting Soon");
    } else if (
      new Date() < endDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > endDate
    ) {
      return this.renderLabel("orange", "Ending Soon");
    } else if (new Date() > startDate) {
      return this.renderLabel("blue", "Active");
    }
  };

  renderLabel = (color, text) => {
    return (
      <Label
        className={styles["timeline-row-label"]}
        color={color}
        ribbon
        size="huge"
      >
        {text}
      </Label>
    );
  };

  renderRange = (startDate, endDate) => {
    if (
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
    const { endDate, eventImage, eventType, startDate, title } = this.props;
    const { expanded, mouseInside } = this.state;
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
            className={styles["timeline-row"]}
            onClick={() => this.setState({ expanded: !expanded })}
            onMouseEnter={() => this.setState({ mouseInside: true })}
            onMouseLeave={() => this.setState({ mouseInside: false })}
          >
            <Grid.Column width={2}>
              {this.buildLabel(startDate, endDate)}
            </Grid.Column>
            <Grid.Column width={2}>
              <Image
                className={styles["timeline-row-image"]}
                src={eventImage}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment
                textAlign="center"
                className={styles["timeline-row-title"]}
                inverted
              >
                <Header as="h1">
                  {title}
                  <Header.Subheader className={styles["timeline-row-range"]}>
                    {this.renderRange(startDate, endDate)}
                  </Header.Subheader>
                </Header>
              </Segment>
            </Grid.Column>
            {new Date() > startDate ? (
              <React.Fragment>
                <Responsive
                  as={Grid.Column}
                  className={styles["timeline-row-countdown"]}
                  minWidth={Responsive.onlyTablet.minWidth}
                  width={4}
                >
                  <Header inverted>
                    Ends <Countdown date={endDate} />
                  </Header>
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  className={styles["timeline-row-countdown-mobile"]}
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
                  className={styles["timeline-row-countdown"]}
                  minWidth={Responsive.onlyTablet.minWidth}
                  width={4}
                >
                  <Header inverted>
                    Starts <Countdown date={startDate} />
                  </Header>
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  className={styles["timeline-row-countdown-mobile"]}
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
              <React.Fragment>
                <Responsive
                  as={Divider}
                  className={styles["timeline-row-view"]}
                  horizontal
                  inverted
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  View More
                </Responsive>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
            {expanded ? <Content {...this.props} /> : <React.Fragment />}
          </Grid.Row>
        );
        break;
    }
    return retval;
  }
}

Row.propTypes = {
  endDate: PropTypes.object.isRequired,
  eventImage: PropTypes.string,
  link: PropTypes.string,
  startDate: PropTypes.object.isRequired,
  summary: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default Row;
