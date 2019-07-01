import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Form, Icon } from "semantic-ui-react";

import styles from "./Modals.module.css";

export default class InputBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: props.data ? props.data.length : 1
    };
  }

  handleChange = (event, { name, value }) => {
    const { data, handleChange, fieldName } = this.props;
    let newData = Object.assign([], data);
    let field = name.split("_")[0];
    let index = name.split("_")[1];
    index = parseInt(index);

    if (newData[index] && typeof newData[index] === "object") {
      newData[index][field] = value;
    } else {
      let obj = {};
      obj[field] = value;
      newData.push(obj);
    }

    handleChange(null, { name: fieldName, value: newData });
  };

  buildFields = i => {
    const { data, fields } = this.props;
    const oThis = this;
    let metaBlockFields = [];
    let value;

    fields.forEach(function(field) {
      value = "";
      if (data && data[i]) {
        value = data[i][field.name];
      }

      metaBlockFields.push(
        <React.Fragment key={`${field.name}_${i}`}>
          <Form.Input
            label={field.label}
            name={`${field.name}_${i}`}
            onChange={oThis.handleChange}
            value={value}
            placeholder={field.placeholder}
          />
        </React.Fragment>
      );
    });

    return metaBlockFields;
  };

  render() {
    const { fieldLabel } = this.props;
    const { count } = this.state;
    let metaCollection = [];
    let metaBlock;
    let i;

    for (i = 0; i <= count - 1; i++) {
      metaBlock = (
        <div className={styles["input-block"]} key={i}>
          <Divider className={styles["modal-divider"]} horizontal inverted>
            {i}
          </Divider>
          {this.buildFields(i)}
        </div>
      );
      metaCollection.push(metaBlock);
    }

    return (
      <div>
        <Divider className={styles["modal-divider"]} horizontal inverted>
          {fieldLabel}
        </Divider>
        {metaCollection}
        <div className={styles["input-buttons"]}>
          <Button
            className={styles["input-buttons-add"]}
            color="blue"
            icon
            inverted
            onClick={() => this.setState({ count: count + 1 })}
          >
            <Icon name="plus" /> {`Add ${fieldLabel}`}
          </Button>
          <Button
            color="red"
            icon
            inverted
            onClick={() => this.setState({ count: count - 1 })}
          >
            <Icon name="close" /> {`Remove ${fieldLabel}`}
          </Button>
        </div>
      </div>
    );
  }
}

InputBlock.propTypes = {
  data: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired
};
