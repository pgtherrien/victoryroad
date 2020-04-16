import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { Check as CheckIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./Pokemon.module.css";

const Pokemon = ({
  checked,
  entriesPerRow,
  entry,
  handleCheck,
  listType,
  number,
  rowHeight,
}) => {
  const useStyles = makeStyles((theme) => ({
    content: {
      padding: "16px 5px",
      textAlign: "center",
    },
    icon: {
      fontSize: 30,
      position: "absolute",
      right: "5px",
      top: "5px",
    },
    wrapper: {
      [theme.breakpoints.up("sm")]: {
        width: "15%",
      },
      height: `${rowHeight - 20}px !important`,
      padding: "5px !important",
      width: "33%",
    },
  }));

  const getImage = (number) => {
    let src;
    switch (listType) {
      case "shiny":
        src = "images/pokemon_icons/pokemon_icon_" + number + "_shiny.png";
        break;
      case "lucky":
      case "normal":
      default:
        src = "images/pokemon_icons/pokemon_icon_" + number + ".png";
        break;
    }
    return src;
  };

  const classes = useStyles();
  let xs = entriesPerRow === 12 ? 1 : 4;

  return (
    <Grid className={classes.wrapper} item xs={xs}>
      <Card onClick={handleCheck}>
        <CardActionArea>
          {checked && (
            <CheckIcon className={classes.icon} style={{ color: green[500] }} />
          )}
          <CardMedia
            className={clsx(styles.image, {
              [styles.checked]: checked,
            })}
            component="img"
            image={getImage(number)}
            style={{ backgroundColor: "##121212" }}
          />
          <CardContent className={classes.content}>{entry.name}</CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

Pokemon.propTypes = {
  checked: PropTypes.bool.isRequired,
  entriesPerRow: PropTypes.number.isRequired,
  entry: PropTypes.object.isRequired,
  handleCheck: PropTypes.func.isRequired,
  listType: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  rowHeight: PropTypes.number.isRequired,
};

export default Pokemon;
