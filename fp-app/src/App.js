import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import NavBar from "./components/NavBar";
// import Button from "./components/Button";

const socket = io.connect("http://localhost:5000");

function App() {
  const [state, setState] = useState("");
  const [stateRecoding, setStateRecording] = useState("");
  const [imageReceived, setImageReceived] = useState("");

  const StateRecording = () => {
    setState("recording");
    setStateRecording("");
    console.log(state)
    socket.emit("state", state);
  };

  const StatePlay = () => {
    setState("play");
    setStateRecording("");
    console.log(state)
    socket.emit("state", state);
  };

  const StartRecording = () => {
    setStateRecording("start");
    console.log(stateRecoding)
    socket.emit("state_recording", true);
  };

  const StopRecording = () => {
    setStateRecording("stop");
    console.log(stateRecoding)
    socket.emit("state_recording", false);
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

      <div className="state-web">
        <button onClick={StateRecording}
          className={state === "recording" ? "btn btn-primary" : "btn btn-outline-primary"}
          type="button">
          State Recording
        </button>
        <button onClick={StatePlay}
          className={state === "play" ? "btn btn-primary" : "btn btn-outline-primary"}
          type="button">
          State Play
        </button>
      </div>

      <div className="state-button">
        <button onClick={StartRecording}
          className={stateRecoding === "start" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Start
        </button>
        <button onClick={StopRecording}
          className={stateRecoding === "stop" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Stop
        </button>
      </div>
    </div >
  );
}

export default App;
