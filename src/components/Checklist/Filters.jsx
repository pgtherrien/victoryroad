import React from "react";
import {
  Dialog,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";

const Check = ({ checked, handleUpdateFilter, field, label }) => {
  return (
    <ListItem>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={() => handleUpdateFilter(field, !checked)}
          />
        }
        label={label}
      />
    </ListItem>
  );
};

export default function Filters({
  filters,
  handleUpdateFilter,
  onClose,
  open,
  resetFilters
}) {
  const {
    gen1,
    gen2,
    gen3,
    gen4,
    gen5,
    gen7,
    onlyChecked,
    onlyUnchecked,
    search,
    showEventForms
  } = filters;
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle style={{ textAlign: "center" }}>
        Checklist Filters
      </DialogTitle>
      <List style={{ padding: 0, width: "250px" }}>
        <ListItem>
          <TextField
            color="secondary"
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            label="Search"
            onChange={e => handleUpdateFilter("search", e.target.value)}
            value={search}
          />
        </ListItem>
        <Check
          checked={onlyChecked}
          handleUpdateFilter={handleUpdateFilter}
          field="onlyChecked"
          label="Only Checked"
        />
        <Check
          checked={onlyUnchecked}
          handleUpdateFilter={handleUpdateFilter}
          field="onlyUnchecked"
          label="Only Unchecked"
        />
        <Check
          checked={showEventForms}
          handleUpdateFilter={handleUpdateFilter}
          field="showEventForms"
          label="Show Event Forms"
        />
        <ListItem>
          <Typography
            align="center"
            style={{ fontSize: "1rem", width: "100%" }}
            variant="p"
          >
            Generations
          </Typography>
        </ListItem>
        <Check
          checked={gen1}
          handleUpdateFilter={handleUpdateFilter}
          field="gen1"
          label="Kanto"
        />
        <Check
          checked={gen2}
          handleUpdateFilter={handleUpdateFilter}
          field="gen2"
          label="Johto"
        />
        <Check
          checked={gen3}
          handleUpdateFilter={handleUpdateFilter}
          field="gen3"
          label="Hoenn"
        />
        <Check
          checked={gen4}
          handleUpdateFilter={handleUpdateFilter}
          field="gen4"
          label="Sinnoh"
        />
        <Check
          checked={gen5}
          handleUpdateFilter={handleUpdateFilter}
          field="gen5"
          label="Unova"
        />
        <Check
          checked={gen7}
          handleUpdateFilter={handleUpdateFilter}
          field="gen7"
          label="Alola"
        />
        <ListItem button onClick={resetFilters} style={{ textAlign: "center" }}>
          <ListItemText primary="Reset Filters" />
        </ListItem>
      </List>
    </Dialog>
  );
}
