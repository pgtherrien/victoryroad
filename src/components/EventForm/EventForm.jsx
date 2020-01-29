import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { db } from "../../utils/firebase";

const useStyles = makeStyles(theme => ({
  leftField: {
    marginRight: "32px",
    marginTop: "20px",
    width: "300px"
  },
  form: {
    "& .MuiTextField-root": {
      marginBottom: "15px"
    },
    "& .MuiInputBase-root": {
      marginBottom: "15px"
    }
  },
  modal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    height: "75%",
    left: "50%",
    outline: 0,
    overflowY: "auto",
    padding: theme.spacing(4, 4, 3),
    position: "absolute",
    right: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "750px"
  },
  plus: {
    cursor: "pointer"
  },
  rightField: {
    marginLeft: "32px",
    marginTop: "20px",
    width: "300px"
  },
  submit: {
    margin: "0 auto"
  }
}));

export default function EventForm(props) {
  const { handleClose } = props;

  let defaultForm = {
    background: props.event.background || "",
    bonuses: props.event.bonuses || [],
    endDate: props.event.endDate || "",
    features: props.event.features || [],
    icon: props.event.icon || "",
    link: props.event.link || "",
    newShinies: props.event.newShinies || [],
    perfectIV: props.event.perfectIV || ["", ""],
    startDate: props.event.startDate || "",
    summary: props.event.summary || "",
    title: props.event.title || "",
    type: props.event.type || "unique"
  };

  const [form, setForm] = useState(defaultForm);
  const classes = useStyles();

  const handleSubmit = () => {
    delete form.id;
    db.collection("events")
      .doc(form.title)
      .set({
        ...form
      })
      .then(() => {
        handleClose();
      })
      .catch(function(error) {
        console.error("Error writing event: ", error);
      });
  };

  const incrementArray = field => {
    let standard = { image: "", text: "" };
    let shiny = { image: "" };
    let updatedForm = Object.assign({}, form);
    switch (field) {
      case "bonuses":
      case "features":
      default:
        updatedForm[field].push(standard);
        break;
      case "newShinies":
        updatedForm[field].push(shiny);
        break;
    }
    setForm(updatedForm);
  };

  const renderPairs = field => {
    let pairs = [];
    for (var i = 0; i < form[field].length; i++) {
      let index = i;
      pairs.push(
        <React.Fragment key={i}>
          <TextField
            className={classes.leftField}
            InputLabelProps={{
              shrink: true
            }}
            label="Image"
            onChange={event =>
              updateNestedArray(index, "image", field, event.target.value)
            }
            value={form[field][i].image}
            variant="outlined"
          />
          <TextField
            className={classes.rightField}
            InputLabelProps={{
              shrink: true
            }}
            label="Text"
            onChange={event =>
              updateNestedArray(index, "text", field, event.target.value)
            }
            value={form[field][i].text}
            variant="outlined"
          />
        </React.Fragment>
      );
    }
    return pairs;
  };

  const renderNewShinies = () => {
    let shinies = [];
    for (var i = 0; i < form.newShinies.length; i++) {
      let index = i;
      shinies.push(
        <TextField
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
          key={i}
          label="Image"
          onChange={event =>
            updateArray("newShinies", index, event.target.value)
          }
          value={form.newShinies[index].image}
          variant="outlined"
        />
      );
    }
    return shinies;
  };

  const renderDateField = (field, label) => {
    let value = "";
    if (form[field] !== "") {
      let split = form[field].toISOString().split(":");
      value = split[0] + ":" + split[1];
    }

    return (
      <TextField
        fullWidth
        InputLabelProps={{
          shrink: true
        }}
        label={label}
        onChange={event => updateField(field, new Date(event.target.value))}
        type="datetime-local"
        value={value}
      />
    );
  };

  const renderTextField = (field, label) => {
    return (
      <TextField
        fullWidth
        InputLabelProps={{
          shrink: true
        }}
        label={label}
        multiline={field === "summary"}
        onChange={event => updateField(field, event.target.value)}
        value={form[field]}
      />
    );
  };

  const updateArray = (field, i, value) => {
    let updatedForm = Object.assign({}, form);
    updatedForm[field][i] = value;
    setForm(updatedForm);
  };

  const updateField = (field, value) => {
    let updatedForm = Object.assign({}, form);
    updatedForm[field] = value;
    setForm(updatedForm);
  };

  const updateNestedArray = (i, nestedField, parentField, value) => {
    let updatedForm = Object.assign({}, form);
    updatedForm[parentField][i][nestedField] = value;
    setForm(updatedForm);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={true}
      onClose={handleClose}
    >
      <div className={classes.modal}>
        <form autoComplete="off" className={classes.form} noValidate>
          {renderTextField("title", "Title")}
          {renderTextField("summary", "Summary")}
          {renderTextField("background", "Background")}
          {renderTextField("icon", "Icon")}
          {renderTextField("link", "Link")}
          {renderDateField("startDate", "Start Date")}
          {renderDateField("endDate", "End Date")}
          <FormControl fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              onChange={event => updateField("type", event.target.value)}
              value={form.type}
            >
              <MenuItem value="recurring">Recurring</MenuItem>
              <MenuItem value="unique">Unique</MenuItem>
            </Select>
          </FormControl>
          <Typography align="center" variant="h6">
            Bonuses
          </Typography>
          {renderPairs("bonuses")}
          <AddCircleIcon
            className={classes.plus}
            onClick={() => incrementArray("bonuses")}
          />
          <Typography align="center" variant="h6">
            Features
          </Typography>
          {renderPairs("features")}
          <AddCircleIcon
            className={classes.plus}
            onClick={() => incrementArray("features")}
          />
          <Typography align="center" variant="h6">
            New Shinies
          </Typography>
          {renderNewShinies()}
          <AddCircleIcon
            className={classes.plus}
            onClick={() => incrementArray("newShinies")}
          />
          <Typography align="center" variant="h6">
            Perfect IV's
          </Typography>
          <TextField
            className={classes.leftField}
            InputLabelProps={{
              shrink: true
            }}
            label="Level 20"
            onChange={event => updateArray("perfectIV", 0, event.target.value)}
            value={form.perfectIV[0]}
            variant="outlined"
          />
          <TextField
            className={classes.rightField}
            InputLabelProps={{
              shrink: true
            }}
            label="Level 25"
            onChange={event => updateArray("perfectIV", 1, event.target.value)}
            value={form.perfectIV[1]}
            variant="outlined"
          />
          <Button
            className={classes.submit}
            color="primary"
            onClick={handleSubmit}
            variant="contained"
          >
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
}
