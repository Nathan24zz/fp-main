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
  };

  const StatePlay = () => {
    setState("play");
    setStateRecording("");
  };

  useEffect(() => {
    socket.on("image", function (data) {
      var frame = Buffer.from(data, 'base64').toString()
      setImageReceived(frame);
    });
  });

  useEffect(() => {
    console.log(state);
    socket.emit("state", state);
  }, [state]);

  useEffect(() => {
    console.log(stateRecoding);
    if (stateRecoding === "start") { socket.emit("state_recording", true) }
    else { socket.emit("state_recording", false) }
  }, [stateRecoding]);

  return (
    <div className="App">
      <NavBar />
      {imageReceived ? <img className="img-thumbnail" alt="webcam-img" src={`data:image/png;base64,${imageReceived}`} /> : ''}

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
          className={stateRecoding === "start" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Start
        </button>
        <button onClick={() => { setStateRecording("stop") }}
          className={stateRecoding === "stop" && state ? "btn btn-secondary" : "btn btn-outline-secondary"}
          type="button">
          Stop
        </button>
      </div>
    </div >
  );
}

export default App;
