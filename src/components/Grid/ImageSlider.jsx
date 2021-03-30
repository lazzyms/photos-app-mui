import React, { useState } from "react";
import { Fab, Grid, makeStyles } from "@material-ui/core";
import ChevronLeftSharpIcon from "@material-ui/icons/ChevronLeftSharp";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";

const useStyles = makeStyles(() => ({
  closeIcon: {
    position: "absolute",
    top: "15px",
    right: "15px",
  },
  cardImage: {
    maxWidth: "50%",
    height: "100vh",
    objectFit: "contain",
  },
  box: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  arrow: {
    margin: "10px",
  },
}));

const ImageSlider = ({ images, currentIndex }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(currentIndex);

  const slideRight = () => {
    setIndex((index + 1) % images.length);
  };

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(images.length - 1);
    } else {
      setIndex(nextIndex);
    }
  };

  return (
    images.length > 0 && (
      <Grid
        container
        spacing={0}
        direction="row"
        justify="space-between"
        alignContent="center"
        alignItems="center"
        className={classes.box}
      >
        <Fab
          color="primary"
          className={classes.arrow}
          onClick={slideLeft}
          {...(index === 0 ? { disabled: true } : {})}
        >
          <ChevronLeftSharpIcon />
        </Fab>
        <img
          className={classes.cardImage}
          alt={images[index].image}
          src={process.env.REACT_APP_API + "public/" + images[index].image}
        />
        <Fab
          color="primary"
          className={classes.arrow}
          onClick={slideRight}
          {...(index === images.length - 1 ? { disabled: true } : {})}
        >
          <ChevronRightSharpIcon />
        </Fab>
      </Grid>
    )
  );
};

export default ImageSlider;
