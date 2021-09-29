export const uploadChunk = async(chunk,fileName)=>{
    return await fetch("/upload", {
        method: "POST",
        headers: {
          "content-type": "application/octet-stream",
          "content-length": chunk.length,
          "file-name": fileName,
        },
        body: chunk,
      });
}