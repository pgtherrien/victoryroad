import React from "react";
import PropTypes from "prop-types";

import {
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Switch,
  Typography,
} from "@material-ui/core";
import styles from "./Filters.module.css";

const SwitchFilter = ({ checked, field, label, onChange }) => (
  <ListItem>
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={() => onChange(field, !checked)} />
      }
      label={label}
    />
  </ListItem>
);

const Filters = ({ filters, handleUpdateFilter, resetFilters }) => {
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
    showEventForms,
  } = filters;

  return (
    <div className={styles.filters}>
      <Typography
        className={styles.filtersTitle}
        color="textSecondary"
        variant="body1"
      >
        Checklist Filters
      </Typography>
      <List>
        <ListSubheader className={styles.filtersSubheader}>
          General
        </ListSubheader>
        <SwitchFilter
          checked={showEventForms}
          field="showEventForms"
          label="Show Event Forms"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={checked}
          field="checked"
          label="Show Checked"
          onChange={handleUpdateFilter}
        />
        <ListSubheader className={styles.filtersSubheader}>
          Generations
        </ListSubheader>
        <SwitchFilter
          checked={gen1}
          field="gen1"
          label="Kanto"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={gen2}
          field="gen2"
          label="Johto"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={gen3}
          field="gen3"
          label="Hoenn"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={gen4}
          field="gen4"
          label="Sinnoh"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={gen5}
          field="gen5"
          label="Unova"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={gen7}
          field="gen7"
          label="Alola"
          onChange={handleUpdateFilter}
        />
        <ListSubheader className={styles.filtersSubheader}>Tags</ListSubheader>
        <SwitchFilter
          checked={baby}
          field="baby"
          label="Baby"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={regional}
          field="regional"
          label="Regional"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={legendary}
          field="legendary"
          label="Legendary"
          onChange={handleUpdateFilter}
        />
        <SwitchFilter
          checked={mythical}
          field="mythical"
          label="Mythical"
          onChange={handleUpdateFilter}
        />
        <Divider />
        <ListItem button onClick={resetFilters} className={styles.filtersReset}>
          <ListItemText primary="Reset Filters" />
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.object.isRequired,
  handleUpdateFilter: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default Filters;
