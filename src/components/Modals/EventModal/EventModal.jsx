import React from "react";
import PropTypes from "prop-types";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Divider, Form, Modal } from "semantic-ui-react";

import { db } from "../../../firebase";
import InputBlock from "./InputBlock";
import styles from "./EventModal.module.css";

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
      case "endDate":
      case "startDate":
        let date = new Date(value.substr(0, value.indexOf(" ")));
        form[name] = date;
        break;
      case "perfectIV20":
        if (form.perfectIV) {
          form.perfectIV[0] = value;
        } else {
          form.perfectIV = [value];
        }
        break;
      case "perfectIV25":
        if (form.perfectIV) {
          form.perfectIV[1] = value;
        } else {
          form.perfectIV = ["", value];
        }
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

  render() {
    let {
      bonuses,
      challenges,
      endDate,
      eventImage,
      eventType,
      features,
      ivSearchStrings,
      link,
      newShinies,
      perfectIV,
      startDate,
      summary,
      title
    } = this.state.form;
    const { onClose } = this.props;

    return (
      <Modal
        basic
        className={styles["event-modal-container"]}
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
          <Form inverted>
            <Form.Input
              label="Title"
              name="title"
              onChange={this.handleChange}
              placeholder="Title..."
              value={title || ""}
            />
            <Form.TextArea
              label="Summary"
              name="summary"
              onChange={this.handleChange}
              placeholder="Summary..."
              value={summary}
            />
            <Form.Input
              label="Link"
              name="link"
              onChange={this.handleChange}
              placeholder="https://pokemongolive.com/en/"
              value={link || ""}
            />
            <Form.Input
              label="Event Image"
              name="eventImage"
              onChange={this.handleChange}
              placeholder="images/pokemon_icons/pokemon_icon_001_00.png"
              value={eventImage || ""}
            />
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
            <Divider className={styles["modal-divider"]} horizontal inverted>
              Date Range
            </Divider>
            <label className={styles["event-modal-label"]}>Start Date</label>
            <DateTimeInput
              animation=""
              dateFormat="YYYY-MM-DDTHH:mm:ss"
              name="startDate"
              onChange={this.handleChange}
              placeholder="Start Date..."
              popupPosition="top center"
              value={startDate || ""}
            />
            <label className={styles["event-modal-label"]}>End Date</label>
            <DateTimeInput
              animation=""
              dateFormat="YYYY-MM-DDTHH:mm:ss"
              name="endDate"
              onChange={this.handleChange}
              placeholder="End Date..."
              popupPosition="top center"
              value={endDate || ""}
            />
            <Divider className={styles["modal-divider"]} horizontal inverted>
              Perfect CP's
            </Divider>
            <Form.Input
              label="Level 20 Perfect CP"
              name="perfectIV20"
              onChange={this.handleChange}
              placeholder="2328"
              value={perfectIV ? perfectIV[0] : ""}
            />
            <Form.Input
              label="Level 25 Perfect CP"
              name="perfectIV25"
              onChange={this.handleChange}
              placeholder="2910"
              value={perfectIV ? perfectIV[1] : ""}
            />
            <InputBlock
              data={bonuses || []}
              handleChange={this.handleChange}
              fieldLabel="Bonuses"
              fieldName="bonuses"
              fields={[
                {
                  label: "Bonus",
                  name: "text",
                  placeholder: "Bonus earned..."
                },
                {
                  label: "Image",
                  name: "image",
                  placeholder: "images/items/lucky_egg.png"
                }
              ]}
            />
            <InputBlock
              data={challenges || []}
              handleChange={this.handleChange}
              fieldLabel="Challenges"
              fieldName="challenges"
              fields={[
                {
                  label: "Challenge",
                  name: "challenge",
                  placeholder: "Challenge to complete..."
                },
                {
                  label: "Reward",
                  name: "reward",
                  placeholder: "Reward earned..."
                },
                {
                  label: "Image",
                  name: "image",
                  placeholder: "images/items/lucky_egg.png"
                }
              ]}
            />
            <InputBlock
              data={features || []}
              handleChange={this.handleChange}
              fieldLabel="Features"
              fieldName="features"
              fields={[
                {
                  label: "Feature",
                  name: "feature",
                  placeholder: "Feature that will be active..."
                },
                {
                  label: "Image",
                  name: "image",
                  placeholder: "images/misc/stardust.png"
                }
              ]}
            />
            <InputBlock
              data={newShinies || []}
              handleChange={this.handleChange}
              fieldLabel="New Shinies"
              fieldName="newShinies"
              fields={[
                {
                  label: "Image",
                  name: "image",
                  placeholder:
                    "images/pokemon_icons/pokemon_icon_001_00_shiny.png"
                }
              ]}
            />
            <InputBlock
              data={ivSearchStrings || []}
              handleChange={this.handleChange}
              fieldLabel="IV Search Strings"
              fieldName="ivSearchStrings"
              fields={[
                {
                  label: "IV",
                  name: "iv",
                  placeholder: "IV parameter goes here..."
                },
                {
                  label: "Search String",
                  name: "searchString",
                  placeholder: "Search string goes here..."
                }
              ]}
            />
            <Form.Button
              className={styles["event-modal-actions"]}
              color="green"
              content="Submit"
              inverted
              onClick={this.handleSubmit}
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
