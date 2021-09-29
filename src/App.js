import { useEffect, useMemo, useRef, useState } from "react";
import { uploadChunk } from "./apis";
import { Fab, Input, LinearProgress } from "@mui/material";
import UploadButton from "./Components/UpoadButton";
import PlayPause from "./Components/PlayPause";
import { Box } from "@mui/system";

function App() {
  const [uploadPercent, setUploadPercent] = useState(0);
  const [fileBuff, setFileBuff] = useState(null);
  const [isPaused, setPaused] = useState(false);
  const [previousChunkId, setPreviousChunkIndex] = useState(0);

  const loadFile = (event) => {
    const fileReader = new FileReader();
    console.log("fileInput.current");
    const theFile = event.target.files[0];
    fileReader.onload = async (ev) => {
      const arrBuff = ev.target.result;
      console.log("Read successfully");
      const fileName = Math.random() * 1000 + theFile.name;
      setFileBuff({ fileName, arrayBuffer: arrBuff });
      console.log(arrBuff.byteLength);
    };
    fileReader.readAsArrayBuffer(theFile);
  };

  const onPause = () => {
    setPaused(true);
  };

  const onResume = () => {
    setPaused(false);
    handleUpload();
  };

  const handleUpload = async () => {
    const { fileName, arrayBuffer } = fileBuff;
    console.log("previousChunkId", previousChunkId);
    const CHUNK_SIZE = 1000;
    const chunkCount = arrayBuffer.byteLength / CHUNK_SIZE;
    let chunkId = previousChunkId;
    const chunk = arrayBuffer.slice(
      chunkId * CHUNK_SIZE,
      chunkId * CHUNK_SIZE + CHUNK_SIZE
    );
    await uploadChunk(chunk, fileName);
    console.log("upload happend");
    const precent = Math.round((chunkId * 100) / chunkCount, 0);
    setPreviousChunkIndex((prev) => prev + 1);
    setUploadPercent(precent);
  };

  useEffect(() => {
    if (uploadPercent === 100) {
      setPreviousChunkIndex(0);
    } else {
      if (!isPaused && fileBuff) {
        handleUpload();
      }
    }
  }, [previousChunkId]);
  const isFileLoaded = useMemo(() => Boolean(fileBuff), [fileBuff]);
  return (
    <Box p={5} display="flex" alignItems="center" flexDirection="column">
      <h1>Electro file uploader</h1>
      <Box
        p={5}
        display="flex"
        alignItems="center"
        width="80%"
        justifyContent="space-between"
      >
        <Input color='secondary' placeholder="choose a file" onChange={loadFile} type="file" />
        <UploadButton disabled={!isFileLoaded} onClick={handleUpload} />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        width="80%"
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          width="100%"
        >
          <Fab variant='extended' color='secondary' >{uploadPercent} %  </Fab>
          <Box width='40%'>
            <LinearProgress
              variant="determinate"
              color="primary"
              value={uploadPercent}
            />
          </Box>
        </Box>
        {(previousChunkId!==0) && (
          <PlayPause
            isPaused={isPaused}
            onResume={onResume}
            onPause={onPause}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
