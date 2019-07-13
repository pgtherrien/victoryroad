import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Divider, Grid, Icon, Modal } from "semantic-ui-react";

import styles from "../Modals.module.css";

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
          <Grid.Row key={i} textAlign="center">
            <Grid.Column>
              <Button color="green">
                <Icon inverted name="check" /> Copied to Clipboard!
              </Button>
            </Grid.Column>
          </Grid.Row>
        );
      } else {
        rows.push(
          <Grid.Row key={i} textAlign="center">
            <Grid.Column>
              <CopyToClipboard text={config.searchString}>
                <Button
                  color="purple"
                  onClick={() => oThis.setState({ selectedIV: config.iv })}
                >
                  <Icon inverted name="copy" /> {config.iv}
                </Button>
              </CopyToClipboard>
            </Grid.Column>
          </Grid.Row>
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
          <Grid inverted stackable>
            {this.renderSearchStrings()}
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

SearchStringModal.propTypes = {
  ivSearchStrings: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};
