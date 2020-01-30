import React from "react";
import {
  Dialog,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField
} from "@material-ui/core";

export default function Filters({
  filters,
  handleUpdateFilter,
  onClose,
  open,
  resetFilters
}) {
  const { onlyChecked, onlyUnchecked, search, showEventForms } = filters;
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
        <ListItem style={{ justifyContent: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={onlyChecked}
                onChange={() => handleUpdateFilter("onlyChecked", !onlyChecked)}
              />
            }
            label="Only Checked"
          />
        </ListItem>
        <ListItem style={{ justifyContent: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={onlyUnchecked}
                onChange={() =>
                  handleUpdateFilter("onlyUnchecked", !onlyUnchecked)
                }
              />
            }
            label="Only Unchecked"
          />
        </ListItem>
        <ListItem style={{ justifyContent: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={showEventForms}
                onChange={() =>
                  handleUpdateFilter("showEventForms", !showEventForms)
                }
              />
            }
            label="Show Event Forms"
          />
        </ListItem>
        <ListItem button onClick={resetFilters} style={{ textAlign: "center" }}>
          <ListItemText primary="Reset Filters" />
        </ListItem>
      </List>
    </Dialog>
  );
}
