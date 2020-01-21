import React, { useState } from "react";
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

import Countdown from "../Countdown";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  background: {
    minHeight: "300px",
    opacity: ".2"
  },
  card: {
    backgroundColor: "#333333",
    margin: "1% 2% 1% 2%",
    minHeight: "300px"
  },
  cardContent: {
    [theme.breakpoints.up("md")]: {
      display: "flex"
    },
    display: "block",
    padding: "20px 25px"
  },
  countdown: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      fontSize: "xx-large",
      width: "15%"
    },
    alignItems: "center",
    display: "none",
    fontSize: "large",
    height: "250px",
    position: "absolute",
    right: 0,
    top: 0,
    width: "40%"
  },
  icon: {
    [theme.breakpoints.up("md")]: {
      display: "block",
      left: "70px"
    },
    display: "none",
    height: "255px",
    left: "25%",
    position: "absolute",
    top: "20px",
    width: "25%"
  },
  icons: {
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-end",
      paddingTop: "0px",
      width: "50%"
    },
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
    width: "100%"
  },
  title: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
      width: "100%"
    },
    width: "75%"
  }
}));

export default function EventRow(props) {
  const {
    event,
    handleSelectEditEvent,
    handleSelectEvent,
    insertEvent,
    isAdmin,
    user
  } = props;
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
      <Card
        className={classes.card}
        onClick={() => handleSelectEvent(event.id)}
      >
        <CardActionArea>
          <CardMedia
            className={classes.background}
            component="img"
            height="250"
            image={event.background}
          />
          <CardMedia className={classes.icon} image={event.icon} />
          <div className={classes.countdown}>
            {new Date() > event.startDate ? (
              <Countdown label={"Ends"} date={event.endDate} />
            ) : (
              <Countdown label={"Begins"} date={event.startDate} />
            )}
          </div>
        </CardActionArea>
        <div className={classes.cardContent}>
          <div className={classes.title}>
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
          <div className={classes.icons}>
            {user.uid && (
              <Button
                onClick={addToCalendar}
                startIcon={<EventIcon />}
                style={{ marginRight: "15px" }}
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
              style={{ marginRight: "15px" }}
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
