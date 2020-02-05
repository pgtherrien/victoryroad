import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardMedia,
  GridList,
  GridListTile,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";

import Sprite from "../Sprite";
import styles from "./EventModal.module.css";

const useStyles = makeStyles(theme => ({
  card: {
    [theme.breakpoints.down("sm")]: {
      width: "90%"
    },
    backgroundColor: theme.palette.background.paper,
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    left: "50%",
    maxHeight: "90%",
    outline: 0,
    position: "absolute",
    right: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%"
  },
  content: {
    [theme.breakpoints.down("sm")]: {
      maxHeight: "450px",
      padding: theme.spacing(3, 1, 1, 1)
    },
    maxHeight: "90%",
    overflowY: "auto",
    padding: theme.spacing(3, 3, 1, 3)
  }
}));

const StyledTableHeader = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

export default function EventModal({ event, handleClose }) {
  const classes = useStyles();

  const renderList = (field, label) => {
    return event[field] && event[field].length > 0 ? (
      <List
        component="nav"
        aria-labelledby={`${field}-header`}
        style={{ marginTop: "20px" }}
        subheader={
          <Typography
            align="center"
            className={styles.sectionTitle}
            color="textSecondary"
          >
            {label}
          </Typography>
        }
      >
        {event[field].map(item => (
          <ListItem alignItems="center" key={item.text}>
            <ListItemAvatar>
              <Avatar src={item.image} />
            </ListItemAvatar>
            <ListItemText secondary={item.text} />
          </ListItem>
        ))}
      </List>
    ) : null;
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

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  let shinyCols = event.newShinies ? (matches ? 2 : 1) : 0;

  return (
    <Modal onClose={handleClose} open={true}>
      <Card className={classes.card}>
        <CardMedia
          className={styles.background}
          component="img"
          image={event.background}
        />
        <div className={styles.title}>
          <Typography variant="h4">{event.title}</Typography>
          <Typography variant="body2">
            {renderRange(event.startDate, event.endDate)}
          </Typography>
        </div>
        <div className={classes.content}>
          <Typography align="center" color="textSecondary" variant="body2">
            {event.summary}
          </Typography>
          {event.newShinies && event.newShinies.length > 0 && (
            <div className={styles.shinies}>
              <Typography
                align="center"
                className={styles.sectionTitle}
                color="textSecondary"
              >
                New Shinies
              </Typography>
              <GridList
                cellHeight={250}
                cols={shinyCols}
                style={{ justifyContent: "center" }}
              >
                {event.newShinies.map(shiny => (
                  <GridListTile
                    cols={1}
                    key={shiny}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Sprite showShiny={true} src={shiny} />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          )}
          {event.perfectIV && event.perfectIV[0].length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "15px"
              }}
            >
              <Typography
                align="center"
                className={styles.sectionTitle}
                color="textSecondary"
              >
                Perfect CP's
              </Typography>
              <GridList
                cellHeight={100}
                cols={2}
                style={{ margin: "0 auto", marginTop: "10px", width: "300px" }}
              >
                <GridListTile
                  col={1}
                  style={{
                    borderRight: "1px solid #C3C3BE",
                    height: "45px"
                  }}
                >
                  <Typography align="center" color="textSecondary" variant="h4">
                    {event.perfectIV[0]}
                  </Typography>
                </GridListTile>
                <GridListTile
                  col={1}
                  style={{
                    borderLeft: "1px solid #C3C3BE",
                    height: "45px"
                  }}
                >
                  <Typography align="center" color="textSecondary" variant="h4">
                    {event.perfectIV[1]}
                  </Typography>
                </GridListTile>
              </GridList>
            </div>
          )}
          {event.counters && event.counters.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <Typography
                align="center"
                className={styles.sectionTitle}
                color="textSecondary"
                style={{ marginBottom: "10px" }}
              >
                Counters
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableHeader>
                      <TableCell>Pokémon</TableCell>
                      <TableCell>Fast Attack</TableCell>
                      <TableCell>Charged Attack</TableCell>
                    </StyledTableHeader>
                  </TableHead>
                  <TableBody>
                    {event.counters.map(counter => (
                      <StyledTableRow key={counter.name}>
                        <TableCell>{counter.name}</TableCell>
                        <TableCell>
                          <div className={styles.attackCell}>
                            <img
                              alt="fast type"
                              className={styles.typeImage}
                              src={counter.fastImage}
                            />
                            {counter.fast}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={styles.attackCell}>
                            <img
                              alt="charged type"
                              className={styles.typeImage}
                              src={counter.chargedImage}
                            />
                            {counter.charged}
                          </div>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {renderList("bonuses", "Bonuses")}
          {renderList("features", "Features")}
          {renderList("voteOptions", "Vote Options")}
          <div className={styles.close}>
            <Button
              color="secondary"
              onClick={handleClose}
              style={{ textDecoration: "underline" }}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
