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
    <ListItem style={{ width: "100%", justifyContent: "center" }}>
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
    baby,
    checked,
    gen1,
    gen2,
    gen3,
    gen4,
    gen5,
    gen7,
    legendary,
    mythical,
    regional,
    search,
    showEventForms
  } = filters;
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle style={{ textAlign: "center" }}>
        Checklist Filters
      </DialogTitle>
      <List style={{ padding: 0 }}>
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
          checked={showEventForms}
          handleUpdateFilter={handleUpdateFilter}
          field="showEventForms"
          label="Show Event Forms"
        />

        <Check
          checked={checked}
          handleUpdateFilter={handleUpdateFilter}
          field="checked"
          label="Checked"
        />
        <ListItem>
          <Typography
            align="center"
            style={{ fontSize: "1rem", paddingTop: "10px", width: "100%" }}
            variant="p"
          >
            Generations
          </Typography>
        </ListItem>
        <ListItem>
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
        </ListItem>
        <ListItem>
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
        </ListItem>
        <ListItem>
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
        </ListItem>
        <ListItem>
          <Typography
            align="center"
            style={{ fontSize: "1rem", paddingTop: "10px", width: "100%" }}
            variant="p"
          >
            Tags
          </Typography>
        </ListItem>
        <ListItem>
          <Check
            checked={baby}
            handleUpdateFilter={handleUpdateFilter}
            field="baby"
            label="Baby"
          />
          <Check
            checked={regional}
            handleUpdateFilter={handleUpdateFilter}
            field="regional"
            label="Regional"
          />
        </ListItem>
        <ListItem>
          <Check
            checked={legendary}
            handleUpdateFilter={handleUpdateFilter}
            field="legendary"
            label="Legendary"
          />
          <Check
            checked={mythical}
            handleUpdateFilter={handleUpdateFilter}
            field="mythical"
            label="Mythical"
          />
        </ListItem>
        <ListItem button onClick={resetFilters} style={{ textAlign: "center" }}>
          <ListItemText primary="Reset Filters" />
        </ListItem>
      </List>
    </Dialog>
  );
}
