import React from "react";
import {
  Dialog,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Switch
} from "@material-ui/core";

export default function Filters({
  clearFilters,
  filters,
  handleUpdateBoolFilter,
  onClose,
  open
}) {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>Checklist Filters</DialogTitle>
      <List>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.onlyChecked}
                onChange={() => handleUpdateBoolFilter("onlyChecked")}
              />
            }
            label="Only Checked"
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.onlyUnchecked}
                onChange={() => handleUpdateBoolFilter("onlyUnchecked")}
              />
            }
            label="Only Unchecked"
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.showEventForms}
                onChange={() => handleUpdateBoolFilter("showEventForms")}
              />
            }
            label="Show Event Forms"
          />
        </ListItem>
        <ListItem button onClick={clearFilters} style={{ textAlign: "center" }}>
          <ListItemText primary="Clear Filters" />
        </ListItem>
      </List>
    </Dialog>
  );
}
