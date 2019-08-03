import React from "react";
import PropTypes from "prop-types";
import { Grid, Progress as SemanticProgress } from "semantic-ui-react";

import styles from "../Checklist.module.css";

export default class Progress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counts: {
        checked: props.checkedCount,
        total: props.totalCount
      }
    };
  }

  // Setup the ref to allow for the progress bar to be updated
  componentDidMount() {
    this.props.onRef(this);
  }

  // Update the checked and total counts
  setCounts = counts => {
    this.setState({ counts: counts });
  };

  render() {
    const { counts } = this.state;
    return (
      <Grid className={styles["progress-container"]} columns={2} stackable>
        <Grid.Column textAlign="center" verticalAlign="middle" width="16">
          <SemanticProgress
            className={styles["progress"]}
            indicating
            progress="ratio"
            total={counts.total}
            value={counts.checked}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

Progress.propTypes = {
  checkedCount: PropTypes.number.isRequired,
  onRef: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired
};
