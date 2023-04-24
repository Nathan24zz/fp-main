import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';

const socket = io.connect("http://localhost:5000");

function App() {
  const [imageReceived, setImageReceived] = useState("");

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
    </div>
  );
}

export default App;
