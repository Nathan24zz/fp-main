import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';

const socket = io.connect("http://localhost:5000");

function App() {
  var state_recording = false;
  const [imageReceived, setImageReceived] = useState("");

  const StartRecording = () => {
    state_recording = true;
    socket.emit("state_recording", state_recording);
  };

  const StopRecording = () => {
    state_recording = false;
    socket.emit("state_recording", state_recording);
  };

  useEffect(() => {
    socket.on("image", function (data) {
      var frame = Buffer.from(data, 'base64').toString()
      setImageReceived(frame);
    });
  });

  return (
    <div className="App">
      <h1> Image:</h1>
      {imageReceived ? <img alt="webcam-img" src={`data:image/png;base64,${imageReceived}`}/>: ''}
      <button onClick={StartRecording}> Start Recording</button>
      <button onClick={StopRecording}> Stop Recording</button>
    </div>
  );
}

export default App;
