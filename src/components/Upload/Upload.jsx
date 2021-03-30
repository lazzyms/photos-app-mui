import React, { useRef, useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import PublishSharpIcon from "@material-ui/icons/PublishSharp";
import ImageIcon from "@material-ui/icons/Image";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import clsx from "clsx";

import "./upload.css";
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Container,
  Box,
  LinearProgress,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  uploadArea: {
    border: (props) => props.border,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "80px 0",
    height: "200px",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Upload = (props) => {
  const [border, setBorder] = useState("2px dashed #3f51b5");

  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [allProgress, setAllProgress] = useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles({ border });
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setValidFiles([...filteredArr]);
  }, [selectedFiles]);

  const preventDefault = (e) => {
    e.preventDefault();
    // e.stopPropagation();
  };

  const dragOver = (e) => {
    preventDefault(e);
  };

  const dragEnter = (e) => {
    preventDefault(e);
    setBorder("4px dashed #3f51b5");
  };

  const dragLeave = (e) => {
    preventDefault(e);
    setBorder("2px dashed #3f51b5");
  };

  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = async function (e) {
        files[i].src = e.target.result;
      };

      if (validateFile(files[i])) {
        files[i].progress = 0;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        files[i]["invalid"] = true;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        setErrorMessage("File type not permitted");
        setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }

    return true;
  };

  const removeFile = (name) => {
    const index = validFiles.findIndex((e) => e.name === name);
    const index2 = selectedFiles.findIndex((e) => e.name === name);
    const index3 = unsupportedFiles.findIndex((e) => e.name === name);
    validFiles.splice(index, 1);
    selectedFiles.splice(index2, 1);
    setValidFiles([...validFiles]);
    setSelectedFiles([...selectedFiles]);
    if (index3 !== -1) {
      unsupportedFiles.splice(index3, 1);
      setUnsupportedFiles([...unsupportedFiles]);
    }
  };

  const uploadFiles = async () => {
    setAllProgress(true);
    setSuccess(false);
    Promise.all(
      validFiles.map(async (item, i) => {
        const formData = new FormData();
        formData.append("image", item);
        await axios.post("http://localhost:8080/", formData, {
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent);
            const uploadPercentage = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            validFiles[i].progress = uploadPercentage;
            setSelectedFiles([...validFiles]);
            setValidFiles([...validFiles]);
          },
        });
      })
    ).then(() => {
      setAllProgress(false);
      setSuccess(true);
      setValidFiles([]);
      props.closeDialog();
    });
  };

  return (
    <>
      <Container>
        <Box
          className={classes.uploadArea}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
          <div className="drop-message">
            <PublishSharpIcon className="upload-icon" />
            Drag & Drop files here or click to select file(s)
          </div>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={filesSelected}
          />
        </Box>
        {unsupportedFiles.length === 0 && validFiles.length ? (
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={allProgress}
              onClick={() => uploadFiles()}
            >
              Upload Files
            </Button>
            {allProgress && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        ) : (
          ""
        )}
        {unsupportedFiles.length ? (
          <p className="warning">Please remove all unsupported files.</p>
        ) : (
          ""
        )}
        {validFiles.length > 0 ? (
          <List className="file-display-container" key="list">
            {validFiles.map((data) => (
              <ListItem
                key={data.name}
                className="file-item"
                onClick={!data.invalid ? () => {} : () => removeFile(data.name)}
              >
                <ListItemAvatar>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value="50" />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar>
                        {data.src ? (
                          <img src={data.src} className="file-image" alt={data.name} />
                        ) : (
                          <ImageIcon />
                        )}
                      </Avatar>
                    </Box>
                  </Box>
                </ListItemAvatar>

                <ListItemText
                  primary={data.name}
                  secondary={
                    <LinearProgress
                      variant="determinate"
                      value={data.progress}
                    />
                  }
                />

                {data.invalid && (
                  <span className="file-error-message">({errorMessage})</span>
                )}
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeFile(data.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};

export default Upload;
