import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Icon, Segment } from "semantic-ui-react";

import styles from "./Timeline.module.css";

class Content extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      submitted: ""
    };
  }

  handleInsertEvent = () => {
    const { endDate, startDate, summary, title } = this.props.event;
    this.props
      .insertEvent(title, summary, startDate, endDate)
      .then(response => {
        if (response.status === 200) {
          this.setState({ submitted: "success" });
        }
      });
  };

  render() {
    const { link, startDate, summary } = this.props.event;
    const { submitted } = this.state;
    const { user } = this.props;

    return (
      <Segment className={styles["content"]} inverted>
        <div className={styles["content-link"]}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            Pokémon Go Live Article <Icon name="external alternate" />
          </a>
        </div>
        {summary ? (
          <React.Fragment>
            <Divider horizontal inverted>
              Summary
            </Divider>
            <span className={styles["content-summary"]}>{summary}</span>
            {new Date() < startDate && user ? (
              <div className={styles["content-calendar-wrapper"]}>
                {submitted === "success" ? (
                  <Button
                    color="green"
                    icon
                    id="add_event_to_calendar"
                    inverted
                    toggle={false}
                  >
                    <Icon name="calendar check outline" /> Added the Event!
                  </Button>
                ) : (
                  <Button
                    icon
                    id="add_event_to_calendar"
                    inverted
                    onClick={this.handleInsertEvent}
                  >
                    <Icon name="calendar plus outline" /> Add to Google Calendar
                  </Button>
                )}
              </div>
            ) : (
              <React.Fragment />
            )}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </Segment>
    );
  }
}

Content.propTypes = {
  admins: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  insertEvent: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Content;
