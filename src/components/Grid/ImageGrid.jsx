import React, { useReducer, useRef, useState } from "react";

import { useFetch, useInfiniteScroll, useLazyLoading } from "./CustomHook";

import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import {
  makeStyles,
  Card,
  CardMedia,
  Divider,
  CircularProgress,
  Modal,
  IconButton,
} from "@material-ui/core";
import ImageSlider from "./ImageSlider";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: "10px 0",
  },
  progresser: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 500,
  },
  closeIcon: {
    position: "absolute",
    top: "15px",
    right: "15px",
  },
}));

function ImageGrid(props) {
  let refresh = props.refresh;
  const classes = useStyles();
  const [openImage, setOpenImage] = useState();
  const [slide, setSlide] = useState(false);
  const imgReducer = (state, action) => {
    switch (action.type) {
      case "STACK_IMAGES":
        let allImages = state.images.concat(action.images);
        allImages = [
          ...new Map(allImages.map((item) => [item["_id"], item])).values(),
        ];
        let returnItems = { ...state, images: allImages };
        return returnItems;
      case "FETCHING_IMAGES":
        return { ...state, fetching: action.fetching };
      default:
        return state;
    }
  };

  const pageReducer = (state, action) => {
    switch (action.type) {
      case "ADVANCE_PAGE":
        return { ...state, page: state.page + 1 };
      default:
        return state;
    }
  };

  const [pager, pagerDispatch] = useReducer(pageReducer, { page: 0 });
  const [imgData, imgDispatch] = useReducer(imgReducer, {
    images: [],
    fetching: true,
  });

  let bottomBoundaryRef = useRef(null);
  useFetch(pager, imgDispatch, refresh);
  useLazyLoading(".card-img-top", imgData.images);
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);

  let openSlide = (index) => {
    setOpenImage(index);
    setSlide(true);
  };

  let closeSlide = () => {
    setOpenImage();
    setSlide(false);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {imgData.images.map((image, index) => {
          return (
            <Grid
              item
              xs={12}
              md={3}
              key={index}
              onClick={() => openSlide(index)}
            >
              <Card>
                <CardMedia
                  className="card-img-top"
                  style={{ minHeight: "200px", objectFit: "cover" }}
                  image={process.env.REACT_APP_API + "public/" + image.image}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Modal
        open={slide}
        onClose={() => closeSlide()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <IconButton
            className={classes.closeIcon}
            onClick={closeSlide}
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <CloseIcon />
          </IconButton>
          <ImageSlider images={imgData.images} currentIndex={openImage} />
        </>
      </Modal>
      {imgData.fetching && <CircularProgress className={classes.progresser} />}
      <Divider ref={bottomBoundaryRef} />
    </div>
  );
}

export default ImageGrid;
