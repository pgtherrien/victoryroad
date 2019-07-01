import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Divider, Icon, Modal, Table } from "semantic-ui-react";

import styles from "./Modals.module.css";

export default class SearchStringModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedIV: ""
    };
  }
  renderSearchStrings = () => {
    const { ivSearchStrings } = this.props;
    const { selectedIV } = this.state;
    let oThis = this;
    let rows = [];
    let i = 0;

    ivSearchStrings.forEach(function(config) {
      if (selectedIV === config.iv) {
        rows.push(
          <Table.Row key={i} textAlign="center">
            <Table.Cell>
              <Button className={styles["search-button"]} color="green">
                <Icon inverted name="check" /> Copied to Clipboard!
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      } else {
        rows.push(
          <Table.Row key={i} textAlign="center">
            <Table.Cell>
              <CopyToClipboard text={config.searchString}>
                <Button
                  className={styles["search-button"]}
                  color="purple"
                  onClick={() => oThis.setState({ selectedIV: config.iv })}
                >
                  <Icon inverted name="copy" /> {config.iv}
                </Button>
              </CopyToClipboard>
            </Table.Cell>
          </Table.Row>
        );
      }

      i++;
    });

    return rows;
  };

  render() {
    const { onClose } = this.props;

    return (
      <Modal basic onClose={onClose} open={true} size="small">
        <Modal.Header
          className={`${styles["modal-background"]} ${styles["modal-header"]}`}
        >
          IV Search Strings
        </Modal.Header>
        <Divider className={styles["modal-divider"]} />
        <Modal.Content className={styles["modal-background"]}>
          <Table
            basic="very"
            celled
            className={styles["search-center"]}
            inverted
            size="large"
            stackable
          >
            <Table.Body>{this.renderSearchStrings()}</Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    );
  }
}

SearchStringModal.propTypes = {
  ivSearchStrings: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};
