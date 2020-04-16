import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./Modals.module.css";

const useStyles = makeStyles((theme) => ({
  availableModal: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    left: "50%",
    outline: 0,
    padding: theme.spacing(2, 4, 3),
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "780px",
  },
}));

const AvailableModal = ({
  available,
  handleChange,
  handleClose,
  handleSave,
  isOpen,
}) => {
  const classes = useStyles();

  return (
    <Modal open={isOpen}>
      <div className={classes.availableModal}>
        <Typography align="center" variant="h5">
          Edit Available Pokémon
        </Typography>
        <TextField
          className={styles.availableField}
          InputLabelProps={{ shrink: true }}
          label="Lucky"
          multiline
          onChange={(e) => handleChange("lucky", e.target.value)}
          rowsMax={25}
          value={available.lucky}
          variant="filled"
        />
        <TextField
          className={styles.availableField}
          InputLabelProps={{ shrink: true }}
          label="Normal"
          multiline
          onChange={(e) => handleChange("normal", e.target.value)}
          rowsMax={25}
          value={available.normal}
          variant="filled"
        />
        <TextField
          className={styles.availableField}
          InputLabelProps={{ shrink: true }}
          label="Shiny"
          multiline
          onChange={(e) => handleChange("shiny", e.target.value)}
          rowsMax={25}
          value={available.shiny}
          variant="filled"
        />
        <div className={styles.availableButtons}>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button color="secondary" onClick={handleSave} variant="contained">
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

AvailableModal.propTypes = {
  available: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default AvailableModal;
