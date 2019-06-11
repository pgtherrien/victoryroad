import React from "react";
import PropTypes from "prop-types";
import { Modal } from "shards-react";
import Countdown from "react-countdown-now";

import styles from "./Modals.module.css";
import MetaDropdown from "./MetaDropdown";

class EventModal extends React.PureComponent {
  linkUser = () => {
    window.open(this.props.event.link, "_blank");
  };

  renderMetadata = () => {
    const { metadata } = this.props.event;
    let blocks = [];
    let i = 0;
    Object.keys(metadata).forEach(function(title) {
      blocks.push(
        <MetaDropdown key={i} title={title} data={metadata[title]} />
      );
      i++;
    });
    return blocks;
  };

  render() {
    const { event, onClose } = this.props;
    return (
      <Modal
        open={true}
        toggle={() => onClose(null)}
        className={styles["event-modal"]}
        backdropClassName={styles["event-modal-backdrop"]}
        modalContentClassName={styles["event-modal-content"]}
      >
        <div className={styles["event-modal-container"]}>
          <img alt={event.title} src={event.imageURL} onClick={this.linkUser} />
          <span className={"material-icons"} id={styles["LinkIcon"]}>
            open_in_new
          </span>
          <div className={styles["event-modal-title"]} onClick={this.linkUser}>
            <h4>{event.title}</h4>
            {new Date() > event.startDate ? (
              <span>
                Event Ends: <Countdown date={event.endDate} />
              </span>
            ) : (
              <span>
                Event Begins: <Countdown date={event.startDate} />
              </span>
            )}
          </div>
          <p>{event.summary}</p>
          <div className={styles["event-modal-metadata"]}>
            {this.renderMetadata()}
          </div>
        </div>
      </Modal>
    );
  }
}

EventModal.propTypes = {
  event: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default EventModal;
