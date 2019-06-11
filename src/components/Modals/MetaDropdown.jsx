import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "shards-react";

class MetaDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  renderItems = () => {
    let items = [];
    let i = 0;
    this.props.data.forEach(function(item) {
      items.push(<li key={i}>{item}</li>);
      i++;
    });
    return items;
  };

  render() {
    const { title } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <h5>{title}</h5>
        {isOpen ? (
          <span className="material-icons">expand_more</span>
        ) : (
          <span className="material-icons">chevron_right</span>
        )}
        <Collapse open={isOpen}>
          <ul>{this.renderItems()}</ul>
        </Collapse>
      </React.Fragment>
    );
  }
}

MetaDropdown.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default MetaDropdown;
