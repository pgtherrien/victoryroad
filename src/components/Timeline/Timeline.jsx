import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dimmer,
  Grid,
  Icon,
  Loader,
  Menu,
  Popup,
  Responsive
} from "semantic-ui-react";

import { db } from "../../firebase";
import styles from "./Timeline.module.css";
import Row from "./Row";

class Timeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: {
        current: [],
        past: [],
        upcoming: []
      },
      key: 0
    };
  }

  // Gather the events and format the data
  componentWillMount() {
    let events = {
      current: [],
      past: [],
      upcoming: []
    };

    db.collection("events")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let event = doc.data();
          event.id = doc.id;
          event.startDate = new Date(event.startDate.toDate());
          event.endDate = new Date(event.endDate.toDate());
          if (new Date() > event.endDate) {
            // If this event has already ended
            events.past.push(event);
          } else if (new Date() < event.startDate) {
            // If the event has not occured yet
            events.upcoming.push(event);
          } else {
            // Otherwise, the event is active
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

  buildRows = () => {
    const { admins, insertEvent, user } = this.props;
    const { current, upcoming } = this.state.events;
    const { key } = this.state;
    let rows = [];
    let i = 0;

    current.forEach(function(event) {
      rows.push(
        <Row
          admins={admins}
          key={i}
          event={{ ...event }}
          expansionKey={key}
          insertEvent={insertEvent}
          user={user}
        />
      );
      i++;
    });
    upcoming.forEach(function(event) {
      rows.push(
        <Row
          admins={admins}
          key={i}
          event={{ ...event }}
          expansionKey={key}
          insertEvent={insertEvent}
          user={user}
        />
      );
      i++;
    });

    return rows;
  };

  render() {
    const { admins, handleSubmitEvent, user } = this.props;
    const { current, upcoming } = this.state.events;
    const { key } = this.state;

    if (current.length > 0 || upcoming.length > 0) {
      let rows = this.buildRows();

      return (
        <React.Fragment>
          <div className={styles["timeline-grid"]}>
            <Grid columns={4} padded stackable verticalAlign="middle">
              {rows}
            </Grid>
            <Responsive
              as={Button}
              className={styles["timeline-close-all"]}
              color="teal"
              icon
              maxWidth={Responsive.onlyMobile.maxWidth}
              onClick={() => this.setState({ key: key + 1 })}
              title="Collapse all open events"
            >
              <Icon name="compress" size="large" />
            </Responsive>
          </div>
          <Responsive
            as={Menu}
            className={styles["timeline-sidebar"]}
            inverted
            minWidth={Responsive.onlyComputer.minWidth}
            vertical
          >
            <Popup
              content="Collapse all open events"
              inverted
              position="left center"
              trigger={
                <Menu.Item
                  className={styles["timeline-sidebar-item"]}
                  onClick={() => this.setState({ key: key + 1 })}
                >
                  <Icon inverted name="compress" size="big" />
                </Menu.Item>
              }
            />
            {admins.includes(user.uid) && (
              <Popup
                content="Create a new event"
                inverted
                position="left center"
                trigger={
                  <Menu.Item
                    className={styles["timeline-sidebar-item"]}
                    onClick={handleSubmitEvent}
                  >
                    <Icon inverted name="plus" size="big" />
                  </Menu.Item>
                }
              />
            )}
          </Responsive>
        </React.Fragment>
      );
    } else {
      return (
        <Dimmer active>
          <Loader>Loading Events...</Loader>
        </Dimmer>
      );
    }
  }
}

Timeline.propTypes = {
  admins: PropTypes.array.isRequired,
  handleSubmitEvent: PropTypes.func.isRequired,
  insertEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default Timeline;
