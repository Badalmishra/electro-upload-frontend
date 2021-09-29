import { Button, Fab } from "@mui/material";
import React from "react";

const PlayPause = ({ onPause, onResume, isPaused }) => {
  return isPaused ? (
    <Fab variant='extended' color='primary' onClick={onResume} >
      Resume
    </Fab>
  ) : (
    <Fab variant='extended' color='primary' onClick={onPause} >
      Pause
    </Fab>
  );
};

export default PlayPause;
