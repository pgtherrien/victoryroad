import React from "react";
import PropTypes from "prop-types";
import { Divider, Form, Modal } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";

import styles from "./EventModal.module.css";
import { db } from "../../firebase";

class EventModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      form: { ...props.event }
    };
  }

  // Handle the change to the form
  handleChange = (event, { name, value }) => {
    let form = Object.assign({}, this.state.form);

    switch (name) {
      case "startDate":
      case "endDate":
        let date = new Date(value.substr(0, value.indexOf(" ")));
        form[name] = date;
        break;
      default:
        form[name] = value;
        break;
    }

    this.setState({ form: form });
  };

  // Submit the event to the database
  handleSubmit = () => {
    const { onClose } = this.props;
    const { form } = this.state;
    const { id } = form;
    delete form.id;

    db.collection("events")
      .doc(id || form.title)
      .set({
        ...form
      })
      .then(() => {
        onClose();
      })
      .catch(function(error) {
        console.error("Error writing event: ", error);
      });
  };

  renderDatePicker = (name, placeholder, value) => {
    return (
      <DateTimeInput
        animation=""
        className={styles["modal-datepicker"]}
        closable={true}
        dateFormat="YYYY-MM-DDTHH:mm:ss"
        iconPosition="left"
        name={name}
        onChange={this.handleChange}
        placeholder={placeholder}
        popupPosition="bottom center"
        value={value}
      />
    );
  };

  renderInput = (label, name, placeholder, value) => {
    return (
      <Form.Input
        label={label}
        name={name}
        onChange={this.handleChange}
        placeholder={placeholder}
        value={value}
      />
    );
  };

  renderTextArea = (label, name, placeholder, value) => {
    return (
      <Form.TextArea
        label={label}
        name={name}
        onChange={this.handleChange}
        placeholder={placeholder}
        value={value}
      />
    );
  };

  render() {
    const {
      bonuses,
      challenges,
      endDate,
      eventImage,
      eventType,
      features,
      link,
      newShinies,
      startDate,
      summary,
      title
    } = this.state.form;
    const { onClose } = this.props;

    return (
      <Modal
        basic
        className={styles["modal-container"]}
        onClose={onClose}
        open={true}
        size="small"
      >
        <Modal.Header
          className={`${styles["modal-background"]} ${styles["modal-header"]}`}
        >
          Event Form
        </Modal.Header>
        <Divider className={styles["modal-divider"]} />
        <Modal.Content className={styles["modal-background"]}>
          <Form inverted onSubmit={this.handleSubmit}>
            {this.renderInput("Title", "title", "Title...", title || "")}
            {this.renderTextArea(
              "Summary",
              "summary",
              "Summary...",
              summary || ""
            )}
            {this.renderInput(
              "Link",
              "link",
              "https://pokemongolive.com/en/",
              link || ""
            )}
            <Form.Select
              label="Event Type"
              name="eventType"
              onChange={this.handleChange}
              options={[
                { key: "r", text: "Recurring", value: "recurring" },
                { key: "u", text: "Unique", value: "unique" }
              ]}
              value={eventType}
            />
            {this.renderInput(
              "Event Image",
              "eventImage",
              "images/pokemon_icons/pokemon_icon_001_00.png",
              eventImage || ""
            )}
            <Divider className={styles["modal-divider"]} horizontal inverted>
              Date Range
            </Divider>
            <label className={styles["modal-label"]}>Start Date</label>
            {this.renderDatePicker(
              "startDate",
              "Start Date...",
              startDate ? startDate.toString() : ""
            )}
            <label className={styles["modal-label"]}>End Date</label>
            {this.renderDatePicker(
              "endDate",
              "End Date...",
              endDate ? endDate.toString() : ""
            )}
            <Divider className={styles["modal-divider"]} horizontal inverted>
              Metadata
            </Divider>
            {this.renderInput(
              "New Shinies",
              "newShinies",
              "[001, 002, 003]",
              newShinies || ""
            )}
            {this.renderTextArea(
              "Bonuses",
              "bonuses",
              "Bonuses...",
              bonuses || ""
            )}
            {this.renderTextArea(
              "Features",
              "features",
              "Features...",
              features || ""
            )}
            {this.renderTextArea(
              "Challenges",
              "challenges",
              "Challenges...",
              challenges || ""
            )}
            <Form.Button
              className={styles["modal-actions"]}
              color="green"
              content="Submit"
              inverted
            />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

EventModal.propTypes = {
  eventID: PropTypes.string,
  event: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default EventModal;
