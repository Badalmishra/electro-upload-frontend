import "./App.css";
import { useEffect, useRef, useState } from "react";
import { uploadChunk } from "./apis";

function App() {
  const fileInput = useRef(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [fileBuff, setFileBuff] = useState(null);
  const [isPaused, setPaused] = useState(false);
  const [previousChunkId, setPreviousChunkIndex] = useState(0);

  const loadFile = () => {
    const fileReader = new FileReader();
    const theFile = fileInput.current.files[0];
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
    if (!isPaused && fileBuff) {
      if (uploadPercent === 100) {
        setPreviousChunkIndex(0);
      } else {
        handleUpload();
      }
    }
  }, [previousChunkId]);
  return (
    <div className="App">
      <h1>Electro file uploader</h1>
      <input onChange={loadFile} ref={fileInput} type="file" id="f" />
      <button
        disabled={!Boolean(fileBuff)}
        onClick={handleUpload}
        id="btnUpload"
      >
        Read & Upload
      </button>
      <div id="divOutput">{uploadPercent} %</div>
      <hr />
      {isPaused ? (
        <button onClick={onResume}>Resume</button>
      ) : (
        <button onClick={onPause}>Pause</button>
      )}
    </div>
  );
}

export default App;
