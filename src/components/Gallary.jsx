import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  Dialog,
  Slide,
  IconButton,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import Upload from "./Upload/Upload";
import { useState, forwardRef } from "react";
import ImageGrid from "./Grid/ImageGrid";

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
  close: {
    position: "absolute",
    right: "10px",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Gallary = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Container disableGutters={true} maxWidth={false}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Photos
            </Typography>
            <Button
              variant="contained"
              color="default"
              onClick={handleClickOpen}
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </Toolbar>
        </AppBar>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                className={classes.close}
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Upload closeDialog={handleClose}/>
        </Dialog>
        <ImageGrid refresh={open}/>
      </Container>
    </>
  );
};

export default Gallary;
