import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

import { db } from "../../utils/firebase";

const useStyles = makeStyles((theme) => ({
  content: {
    height: "95%",
    overflowY: "auto",
    padding: "10px",
  },
  form: {
    "& .MuiTextField-root": {
      marginBottom: "15px",
    },
    "& .MuiInputBase-root": {
      marginBottom: "15px",
    },
  },
  leftField: {
    marginTop: "20px",
    width: "320px",
  },
  modal: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    height: "78%",
    left: "50%",
    outline: 0,
    padding: theme.spacing(4, 4, 3),
    position: "absolute",
    right: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "750px",
  },
  plus: {
    cursor: "pointer",
  },
  rightField: {
    marginLeft: "16px",
    marginTop: "20px",
    width: "320px",
  },
  submit: {
    margin: "0 auto",
  },
  submitWrapper: {
    textAlign: "center",
    width: "100%",
  },
  title: {
    paddingBottom: "10px",
  },
}));

const EventModal = ({ event, handleClose }) => {
  const {
    background,
    bonuses,
    counters,
    endDate,
    features,
    icon,
    link,
    newPokemon,
    newShinies,
    perfectIV,
    startDate,
    summary,
    title,
    voteOptions,
  } = event;

  let defaultForm = {
    background: background || "",
    bonuses: bonuses || [],
    counters: counters || [],
    endDate: endDate || "",
    features: features || [],
    icon: icon || "",
    link: link || "",
    newPokemon:
      newPokemon && newPokemon.length > 0
        ? newPokemon.map((pokemon) => {
            return {
              image: pokemon,
            };
          })
        : [],
    newShinies:
      newShinies && newShinies.length > 0
        ? newShinies.map((pokemon) => {
            return {
              image: pokemon,
            };
          })
        : [],
    perfectIV: perfectIV || ["", ""],
    startDate: startDate || "",
    summary: summary || "",
    title: title || "",
    voteOptions: voteOptions || [],
  };

  const [form, setForm] = useState(defaultForm);
  const classes = useStyles();

  const handleSubmit = () => {
    let submitForm = Object.assign({}, form);
    delete submitForm.id;
    submitForm.newPokemon = submitForm.newPokemon.map(
      (pokemon) => pokemon.image
    );
    submitForm.newShinies = submitForm.newShinies.map((shiny) => shiny.image);
    db.collection("events")
      .doc(submitForm.title)
      .set({
        ...submitForm,
      })
      .then(() => {
        handleClose();
      })
      .catch(function (error) {
        console.error("Error writing event: ", error);
      });
  };

  const incrementArray = (field) => {
    let counter = {
      charged: "",
      chargedImage: "",
      fast: "",
      fastImage: "",
      name: "",
    };
    let pokemon = { image: "" };
    let standard = { image: "", text: "" };
    let updatedForm = Object.assign({}, form);
    switch (field) {
      case "bonuses":
      case "features":
      case "voteOptions":
      default:
        updatedForm[field].push(standard);
        break;
      case "counters":
        updatedForm[field].push(counter);
        break;
      case "newPokemon":
        updatedForm[field].push(pokemon);
        break;
      case "newShinies":
        updatedForm[field].push(pokemon);
        break;
    }
    setForm(updatedForm);
  };

  const renderCounters = () => {
    let counters = [];
    for (var i = 0; i < form.counters.length; i++) {
      let index = i;
      counters.push(
        <React.Fragment key={i}>
          <TextField
            color="secondary"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            label="Name"
            onChange={(event) =>
              updateNestedArray(index, "name", "counters", event.target.value)
            }
            value={form.counters[i].name}
            variant="filled"
          />
          <TextField
            className={classes.leftField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Fast Attack"
            onChange={(event) =>
              updateNestedArray(index, "fast", "counters", event.target.value)
            }
            value={form.counters[i].fast}
            variant="filled"
          />
          <TextField
            className={classes.rightField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Type Image"
            onChange={(event) =>
              updateNestedArray(
                index,
                "fastImage",
                "counters",
                event.target.value
              )
            }
            value={form.counters[i].fastImage}
            variant="filled"
          />
          <TextField
            className={classes.leftField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Charged Attack"
            onChange={(event) =>
              updateNestedArray(
                index,
                "charged",
                "counters",
                event.target.value
              )
            }
            value={form.counters[i].charged}
            variant="filled"
          />
          <TextField
            className={classes.rightField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Type Image"
            onChange={(event) =>
              updateNestedArray(
                index,
                "chargedImage",
                "counters",
                event.target.value
              )
            }
            value={form.counters[i].chargedImage}
            variant="filled"
          />
        </React.Fragment>
      );
    }
    return counters;
  };

  const renderPairs = (field) => {
    let pairs = [];
    for (var i = 0; i < form[field].length; i++) {
      let index = i;
      pairs.push(
        <React.Fragment key={i}>
          <TextField
            className={classes.leftField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Image"
            onChange={(event) =>
              updateNestedArray(index, "image", field, event.target.value)
            }
            value={form[field][i].image}
            variant="filled"
          />
          <TextField
            className={classes.rightField}
            color="secondary"
            InputLabelProps={{
              shrink: true,
            }}
            label="Text"
            onChange={(event) =>
              updateNestedArray(index, "text", field, event.target.value)
            }
            value={form[field][i].text}
            variant="filled"
          />
        </React.Fragment>
      );
    }
    return pairs;
  };

  const renderNew = (field) => {
    let list = [];
    for (var i = 0; i < form[field].length; i++) {
      let index = i;
      list.push(
        <TextField
          color="secondary"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          key={i}
          label="Image"
          onChange={(event) => updateNew(field, index, event.target.value)}
          value={form[field][index].image}
          variant="filled"
        />
      );
    }
    return list;
  };

  const renderDateField = (field, label) => {
    let value = "";
    if (form[field] !== "") {
      let split = form[field].toISOString().split(":");
      value = split[0] + ":" + split[1];
    }

    return (
      <TextField
        color="secondary"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label={label}
        onChange={(event) => updateField(field, new Date(event.target.value))}
        type="datetime-local"
        value={value}
        variant="filled"
      />
    );
  };

  const renderTextField = (field, label) => {
    return (
      <TextField
        color="secondary"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label={label}
        multiline={field === "summary"}
        onChange={(event) => updateField(field, event.target.value)}
        value={form[field]}
        variant="filled"
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

  const updateNew = (field, i, value) => {
    let updatedForm = Object.assign({}, form);
    updatedForm[field][i] = { image: value };
    setForm(updatedForm);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open
      onClose={handleClose}
    >
      <div className={classes.modal}>
        <Typography align="center" className={classes.title} variant="h5">
          Event Form
        </Typography>
        <div className={classes.content}>
          <form autoComplete="off" className={classes.form} noValidate>
            {renderTextField("title", "Title")}
            {renderTextField("summary", "Summary")}
            {renderTextField("background", "Background")}
            {renderTextField("icon", "Icon")}
            {renderTextField("link", "Link")}
            {renderDateField("startDate", "Start Date")}
            {renderDateField("endDate", "End Date")}
            <Typography align="center" variant="h6">
              Bonuses
            </Typography>
            {renderPairs("bonuses")}
            <AddCircleIcon
              className={classes.plus}
              onClick={() => incrementArray("bonuses")}
            />
            <Typography align="center" variant="h6">
              Counters
            </Typography>
            {renderCounters()}
            <AddCircleIcon
              className={classes.plus}
              onClick={() => incrementArray("counters")}
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
              New Pokémon
            </Typography>
            {renderNew("newPokemon")}
            <AddCircleIcon
              className={classes.plus}
              onClick={() => incrementArray("newPokemon")}
            />
            <Typography align="center" variant="h6">
              New Shinies
            </Typography>
            {renderNew("newShinies")}
            <AddCircleIcon
              className={classes.plus}
              onClick={() => incrementArray("newShinies")}
            />
            <Typography align="center" variant="h6">
              Perfect IV's
            </Typography>
            <TextField
              className={classes.leftField}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              label="Level 20"
              onChange={(event) =>
                updateArray("perfectIV", 0, event.target.value)
              }
              value={form.perfectIV[0]}
              variant="filled"
            />
            <TextField
              className={classes.rightField}
              color="secondary"
              InputLabelProps={{
                shrink: true,
              }}
              label="Level 25"
              onChange={(event) =>
                updateArray("perfectIV", 1, event.target.value)
              }
              value={form.perfectIV[1]}
              variant="filled"
            />
            <Typography align="center" variant="h6">
              Vote Options
            </Typography>
            {renderPairs("voteOptions")}
            <AddCircleIcon
              className={classes.plus}
              onClick={() => incrementArray("voteOptions")}
            />
            <div className={classes.submitWrapper}>
              <Button
                onClick={handleClose}
                style={{ marginRight: "15px" }}
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                className={classes.submit}
                color="secondary"
                onClick={handleSubmit}
                variant="contained"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

EventModal.propTypes = {
  event: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EventModal;
