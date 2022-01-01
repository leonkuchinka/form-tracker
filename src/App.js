import "./App.css";
import { useState, useEffect } from "react";

const canvas = document.createElement("canvas")

function drawPixel(ctx, x, y, color) {
  ctx.fillStyle =
    "rgba(" +
    color.red +
    "," +
    color.green +
    "," +
    color.blue +
    "," +
    255 / 255 +
    ")";
  ctx.fillRect(x, y, 1, 1);
}

function getVideoFrameBuffer(video) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

function helper() {
  const ctx = document.getElementById("result").getContext("2d");
  const data = getVideoFrameBuffer(document.querySelector("video"));

  //rgba(108,221,255,255)

  const reference = {
    red: 108,
    green: 221,
    blue: 255,
  };

  const values = [];

  for (let i = 0; i < data.byteLength; i += 4) {
    const color = {
      red: data[i],
      green: data[i + 1],
      blue: data[i + 2],
    };

    if (
      isInRange(color.red, reference.red) &&
      isInRange(color.green, reference.green) &&
      isInRange(color.blue, reference.blue)
    ) {
      const y = Math.floor(i / canvas.width / 4);
      const x = (i / 4) % canvas.width;
      values.push({ x: x, y: y });
    }
  }

  const tmp = values.reduce((a, b) => a + b.x, 0) / values.length;
  const tmpTmp = values.reduce((a, b) => a + b.y, 0) / values.length;
  console.log("avg x:", tmp);
  console.log("avg y:", tmpTmp);

  drawPixel(ctx, tmp, tmpTmp, {
    red: 255,
    green: 0,
    blue: 0,
  });
}

function isInRange(value, reference) {
  return value >= reference * 0.7 && value <= reference * 1.3;
}

const FilePicker = ({ onChange }) => {
  return (
    <input
      type="file"
      onChange={(ev) => {
        const file = ev.target.files[0];
        const url = URL.createObjectURL(file);

        onChange({
          name: file.name,
          url,
        });
      }}
    />
  );
};

// TODO: Precalculate path
// TODO: Connect the dots and draw a single line instead of multiple dots (https://www.w3schools.com/tags/canvas_lineto.asp)

const App = () => {
  const [video, setVideo] = useState();

  useEffect(() => {
    if (video) {
      const video = document.querySelector("video")
      function frameCallback() {
        const playing = video.currentTime >= 0 && !video.paused && !video.ended

        console.log(playing)

        helper()

        if (playing) {
          window.requestAnimationFrame(frameCallback)
        }
      }
      video.onplay = () => {
        window.requestAnimationFrame(frameCallback)
      }
    }
  }, [video]);

  if (video) {
    return (
      <div
        style={{
          width: "99vw",
          height: "99vh",
          margin: 0,
          padding: 0,
          left: 0,
          top: 0,
        }}
      >
        <div
          style={{
            display: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <video
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0px",
              left: "0px",
            }}
            src={video.url}
            playsInline
            autoPlay
          />
          <canvas
            id="result"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0px",
              left: "0px",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1> Form Tracker </h1>
      <div>
        <FilePicker onChange={setVideo} />
        <br />
      </div>
    </div>
  );
};

export default App;
