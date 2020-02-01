import React, { useState } from "react";
import clsx from "clsx";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Snackbar,
  Typography
} from "@material-ui/core";
import {
  Event as EventIcon,
  Link as LinkIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { insertEvent } from "../../utils/gapi";
import Countdown from "../Countdown";
import styles from "./EventRow.module.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  background: {
    [theme.breakpoints.down("sm")]: {
      opacity: ".8"
    }
  },
  cardContent: {
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  countdown: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      fontSize: "xx-large",
      width: "15%"
    }
  },
  icon: {
    [theme.breakpoints.up("md")]: {
      display: "block"
    }
  },
  icons: {
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
      paddingTop: "0px",
      width: "50%"
    }
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      width: "100%"
    }
  }
}));

export default function EventRow({
  event,
  handleSelectEditEvent,
  handleSelectEvent,
  isAdmin,
  user
}) {
  const [alert, setAlert] = useState("");
  const classes = useStyles();

  // Adds the event to the user's Google Calendar
  const addToCalendar = e => {
    e.stopPropagation();
    const { endDate, startDate, summary, title } = event;
    insertEvent(title, summary, startDate, endDate).then(response => {
      if (response.status === 200) {
        setAlert("Added Event to Google Calendar!");
      }
    });
  };

  // Determine the best format of the date range to display
  const renderRange = (startDate, endDate) => {
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate() &&
      startDate.getHours() === endDate.getHours()
    ) {
      return (
        startDate.toDateString() +
        " at " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      return (
        startDate.toDateString() +
        " from " +
        startDate.toLocaleString("en-US", { hour: "numeric", hour12: true }) +
        " - " +
        endDate.toLocaleString("en-US", { hour: "numeric", hour12: true })
      );
    } else {
      return startDate.toDateString() + " - " + endDate.toDateString();
    }
  };

  return (
    <Grid item xs={12}>
      <Card className={styles.card} onClick={() => handleSelectEvent(event.id)}>
        <CardActionArea>
          <CardMedia
            className={clsx(classes.background, styles.background)}
            component="img"
            height="250"
            image={event.background}
          />
          <CardMedia
            className={clsx(classes.icon, styles.icon)}
            image={event.icon}
          />
          <div className={clsx(classes.countdown, styles.countdown)}>
            {new Date() > event.startDate ? (
              <Countdown label={"Ends"} date={event.endDate} />
            ) : (
              <Countdown label={"Begins"} date={event.startDate} />
            )}
          </div>
        </CardActionArea>
        <div className={clsx(classes.cardContent, styles.cardContent)}>
          <div className={clsx(classes.title, styles.title)}>
            <Typography component="h2" variant="h4">
              {event.title}
            </Typography>
            <Typography
              color="textSecondary"
              component="p"
              style={{ width: "100%" }}
              variant="body2"
            >
              {renderRange(event.startDate, event.endDate)}
            </Typography>
          </div>
          <div className={clsx(classes.icons, styles.icons)}>
            {user.uid && (
              <Button
                onClick={addToCalendar}
                startIcon={<EventIcon />}
                style={{ marginRight: "15px", padding: "6px 25px" }}
                title="Add Event to Google Calendar"
              >
                Track Event
              </Button>
            )}
            <Button
              onClick={e => {
                e.stopPropagation();
                window.open(event.link, "_blank");
              }}
              startIcon={<LinkIcon />}
              style={{ marginRight: "15px", padding: "6px 25px" }}
              title="Visit Pokémon GO Live Post"
            >
              Source
            </Button>
            {isAdmin && (
              <Button
                onClick={e => {
                  e.stopPropagation();
                  handleSelectEditEvent(event);
                }}
                startIcon={<SettingsIcon />}
                style={{ padding: "6px 25px" }}
                title="Edit Event"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </Card>
      <Snackbar
        open={alert.length > 0}
        autoHideDuration={6000}
        onClose={() => setAlert("")}
      >
        <Alert onClose={() => setAlert("")} severity="success">
          {alert}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
