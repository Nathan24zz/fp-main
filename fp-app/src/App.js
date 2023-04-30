import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import NavBar from "./components/NavBar";

const socket = io.connect("http://localhost:5000");

function App() {
  const [stateRecoding, setStateRecording] = useState(false);
  const [imageReceived, setImageReceived] = useState("");

  const StartRecording = () => {
    setStateRecording(true);
    socket.emit("state_recording", stateRecoding);
  };

  const StopRecording = () => {
    setStateRecording(false);
    socket.emit("state_recording", stateRecoding);
  };

  useEffect(() => {
    socket.on("image", function (data) {
      var frame = Buffer.from(data, 'base64').toString()
      setImageReceived(frame);
    });
  });

  return (
    <div className="App">
      <NavBar />
      {imageReceived ? <img className="img-thumbnail" alt="webcam-img" src={`data:image/png;base64,${imageReceived}`} /> : ''}
      <button className="btn btn-primary" type="button" onClick={StartRecording}> Start Recording</button>
      <button className="btn btn-secondary" type="button" onClick={StopRecording}> Stop Recording</button>
    </div >
  );
}

export default App;
