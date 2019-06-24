import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Divider,
  Icon,
  Image,
  Segment,
  Table,
  Responsive
} from "semantic-ui-react";

import styles from "./TimelineRow.module.css";
import ShinyGrid from "./ShinyGrid";

class Content extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      submitted: "",
      toggled: []
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

  renderBonusesTable = data => {
    let rows = [];
    let i = 0;

    data.forEach(function(bonus) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell textAlign="center">
            <Image avatar src={bonus.image} />
          </Table.Cell>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["content-table-text"]
                : ""
            }
            textAlign="center"
          >
            {bonus.text}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <Table basic="very" celled collapsing inverted size="large" stackable>
        <Table.Body>{rows}</Table.Body>
      </Table>
    );
  };

  renderFeaturesTable = data => {
    let rows = [];
    let i = 0;

    Object.keys(data).forEach(function(index) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell textAlign="center">
            <Image avatar src={index} />
          </Table.Cell>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["content-table-text"]
                : ""
            }
            textAlign="center"
          >
            {data[index]}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <Table basic="very" celled collapsing inverted size="large" stackable>
        <Table.Body>{rows}</Table.Body>
      </Table>
    );
  };

  renderChallengeTable = challenges => {
    let rows = [];
    let i = 0;

    challenges.forEach(function(challenge) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["content-table-text"]
                : ""
            }
          >
            {challenge.challenge}
          </Table.Cell>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["content-table-text-reward"]
                : ""
            }
          >
            {challenge.reward}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <Table basic="very" celled collapsing inverted size="large" stackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Challenge</Table.HeaderCell>
            <Table.HeaderCell>Reward</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table>
    );
  };

  render() {
    const {
      bonuses,
      challenges,
      features,
      link,
      newShinies,
      startDate,
      summary
    } = this.props.event;
    const { submitted } = this.state;
    const { user } = this.props;

    return (
      <Segment className={styles["content"]} inverted>
        {summary ? (
          <React.Fragment>
            <Divider className={styles["content-divider"]} horizontal inverted>
              Summary
            </Divider>
            <span className={styles["content-summary"]}>{summary}</span>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {newShinies ? (
          <React.Fragment>
            <Divider className={styles["content-divider"]} horizontal inverted>
              New Shinies Released
            </Divider>
            <ShinyGrid newShinies={newShinies} />
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {bonuses ? (
          <React.Fragment>
            <Divider className={styles["content-divider"]} horizontal inverted>
              Bonuses
            </Divider>
            {this.renderBonusesTable(JSON.parse(bonuses))}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {features ? (
          <React.Fragment>
            <Divider className={styles["content-divider"]} horizontal inverted>
              Features
            </Divider>
            {this.renderFeaturesTable(JSON.parse(features))}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {challenges ? (
          <React.Fragment>
            <Divider className={styles["content-divider"]} horizontal inverted>
              Challenges
            </Divider>
            {this.renderChallengeTable(JSON.parse(challenges))}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <div className={styles["content-actions-wrapper"]}>
          {new Date() < startDate && user.uid ? (
            submitted === "success" ? (
              <Button color="green" icon id="content-action-button" inverted>
                <Icon name="calendar check outline" /> Added the Event!
              </Button>
            ) : (
              <Button
                id="content-action-button"
                inverted
                onClick={this.handleInsertEvent}
              >
                Add to Google Calendar
              </Button>
            )
          ) : (
            <React.Fragment />
          )}
          <Button
            className={styles["content-link"]}
            color="blue"
            id="content-action-button"
            inverted
            onClick={() => window.open(link)}
          >
            Pokémon Go Live Post
          </Button>
        </div>
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
