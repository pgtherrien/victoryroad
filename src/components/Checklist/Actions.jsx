import React, { useState } from "react";
import { FilterList, Save as SaveIcon } from "@material-ui/icons";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";

import styles from "./Checklist.module.css";

export default function Actions({ handleSave, handleShowFilters }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <SpeedDial
      ariaLabel="Checklist Actions"
      className={styles.speeddial}
      direction="up"
      icon={<SpeedDialIcon />}
      onClose={() => setShowActions(false)}
      onOpen={() => setShowActions(true)}
      open={showActions}
    >
      <SpeedDialAction
        key="filters"
        icon={<FilterList />}
        tooltipTitle="Filters"
        onClick={handleShowFilters}
      />
      <SpeedDialAction
        key="save"
        icon={<SaveIcon />}
        tooltipTitle="Save"
        onClick={handleSave}
      />
    </SpeedDial>
  );
}
