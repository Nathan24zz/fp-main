import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import NavBar from "./components/NavBar";
// import Button from "./components/Button";

const socket = io.connect("http://localhost:5555");

function App() {
  const [state, setState] = useState("");
  const [stateRecording, setStateRecording] = useState("");
  const [humanImage, setHumanImage] = useState("");
  const [robotImage, setRobotImage] = useState("");

  const StateRecording = () => {
    setState("recording");
    setStateRecording("");
  };

  const StatePlay = () => {
    setState("play");
    setStateRecording("");
  };

  useEffect(() => {
    socket.on("human_image", function (data) {
      var frame = Buffer.from(data, 'base64').toString()
      setHumanImage(frame);
    });
  });

  useEffect(() => {
    socket.on("robot_image", function (data) {
      var frame = Buffer.from(data, 'base64').toString()
      setRobotImage(frame);
    });
  });

  useEffect(() => {
    console.log(state);
    socket.emit("state", state);
  }, [state]);

  useEffect(() => {
    console.log(stateRecording);
    socket.emit("state_recording", stateRecording)
  }, [stateRecording]);

  return (
    <div className="App">
      <NavBar />
      {humanImage ? <img className="img-thumbnail" alt="webcam-img" src={`data:image/png;base64,${humanImage}`} /> : ''}
      {robotImage ? <img className="img-thumbnail" alt="webcam-img" src={`data:image/png;base64,${robotImage}`} /> : ''}

      <div className="state">
        <button onClick={(StateRecording)}
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

      <div className="state">
        <button onClick={() => { setStateRecording("start") }}
          className={stateRecording === "start" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Start
        </button>
        <button onClick={() => { setStateRecording("stop") }}
          className={stateRecording === "stop" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Stop
        </button>
      </div>
    </div >
  );
}

export default App;
