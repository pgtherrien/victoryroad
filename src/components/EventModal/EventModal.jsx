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
    backgroundColor: "#3b3b3b",
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
    width: "75%"
  },
  content: {
    [theme.breakpoints.down("sm")]: {
      maxHeight: "450px",
      padding: theme.spacing(3, 1, 1, 1)
    },
    maxHeight: "90%",
    overflowY: "auto",
    padding: theme.spacing(3, 3, 1, 3)
  },
  standardImage: {
    height: "40px",
    marginRight: "5px",
    width: "40px"
  },
  typeImage: {
    height: "20px",
    marginRight: "5px",
    width: "20px"
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
        style={{ marginTop: "40px" }}
        subheader={<Typography align="center">{label}</Typography>}
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

  let shinyCols = event.newShinies ? (matches ? 3 : 1) : 0;

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
          <Typography align="center" variant="body2">
            {event.summary}
          </Typography>
          {event.newPokemon && event.newPokemon.length > 0 && (
            <div className={styles.shinies}>
              <Typography
                align="center"
                gutterBottom
                style={{ marginBottom: "10px" }}
                variant="h5"
              >
                New Pokémon
              </Typography>
              <GridList
                cellHeight={250}
                cols={shinyCols}
                style={{ justifyContent: "center" }}
              >
                {event.newPokemon.map(pokemon => (
                  <GridListTile
                    cols={1}
                    key={pokemon}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Sprite showShiny={false} src={pokemon} />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          )}
          {event.newShinies && event.newShinies.length > 0 && (
            <div className={styles.shinies}>
              <Typography
                align="center"
                gutterBottom
                style={{ marginBottom: "10px" }}
                variant="h5"
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
            <div style={{ marginTop: "40px" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableHeader>
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        Level 20 Perfect CP
                      </TableCell>
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        Level 25 Perfect CP
                      </TableCell>
                    </StyledTableHeader>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        <Typography gutterBottom variant="h6">
                          {event.perfectIV[0]}
                        </Typography>
                      </TableCell>
                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                        <Typography gutterBottom variant="h6">
                          {event.perfectIV[1]}
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {event.bonuses && event.bonuses.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableHeader>
                      <TableCell colSpan={12} style={{ textAlign: "center" }}>
                        Bonuses
                      </TableCell>
                    </StyledTableHeader>
                  </TableHead>
                  <TableBody>
                    {event.bonuses.map(bonus => (
                      <StyledTableRow key={bonus.image}>
                        <TableCell>
                          <div className={styles.attackCell}>
                            <img
                              alt="bonus"
                              className={classes.standardImage}
                              src={bonus.image}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{bonus.text}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          {event.counters && event.counters.length > 0 && (
            <div style={{ marginTop: "40px" }}>
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
                              className={classes.typeImage}
                              src={counter.fastImage}
                            />
                            {counter.fast}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={styles.attackCell}>
                            <img
                              alt="charged type"
                              className={classes.typeImage}
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
          {event.features && event.features.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableHeader>
                      <TableCell colSpan={12} style={{ textAlign: "center" }}>
                        Features
                      </TableCell>
                    </StyledTableHeader>
                  </TableHead>
                  <TableBody>
                    {event.features.map(feature => (
                      <StyledTableRow key={feature.image}>
                        <TableCell>
                          <div className={styles.attackCell}>
                            <img
                              alt="feature"
                              className={classes.standardImage}
                              src={feature.image}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{feature.text}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
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
