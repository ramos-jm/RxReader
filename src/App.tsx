import React, { useEffect, useRef, useState } from "react";
import NavBar from "./Navbar";
import * as tf from "@tensorflow/tfjs";
import switchCameraImg from "../public/assets/switch.png";
import "./App.css";

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Mapping for medicine classes
  const medicineMapping: { [key: number]: string } = {
    0: "Azathioprine",
    1: "Ceftriaxone",
    2: "Chlorpromazine",
    3: "Ciprofloxacin",
    4: "Clarithromycin",
    5: "Dobutamine",
    6: "Fluoxetine",
    7: "Hydrochlorothiazide",
    8: "Hydrocortisone",
    9: "Hydroxyzine",
    10: "Ibuprofen",
    11: "Levothyroxine",
    12: "Lorazepam",
    13: "Metronidazole",
    14: "Prednisolone",
    15: "Quinine",
    16: "Risperidone",
    17: "Rituximab",
    18: "Salbutamol",
    19: "Tramadol",
  };

  // Start the webcam feed based on the current facingMode
  useEffect(() => {
    const startCamera = async () => {
      try {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Stop any existing stream if present
        if (videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }

        // Get the new stream based on the facingMode
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        videoElement.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startCamera();
  }, [facingMode]);

  // Load the TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json");
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    };
    loadModel();
  }, []);

  // Real-time prediction from video frames
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (model && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");

      interval = setInterval(async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageTensor = tf.browser
            .fromPixels(canvas)
            .toFloat()
            .div(tf.scalar(255.0))
            .expandDims(0);

          const predictionTensor = model.predict(imageTensor) as tf.Tensor;
          const predictionData = await predictionTensor.data();
          const predictedIndex = predictionData.indexOf(
            Math.max(...predictionData)
          );
          setPrediction(medicineMapping[predictedIndex] || "Unknown");

          tf.dispose([imageTensor, predictionTensor]);
        }
      }, 1000); // Prediction interval

      return () => {
        clearInterval(interval);
      };
    }
  }, [model, medicineMapping]);

  // Function to toggle the camera facing mode
  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <section className="video-section">
          <h2>
            LIVE VIDEO FEED:{" "}
            <button onClick={switchCamera} className="switch-camera-btn">
              <img
                src={switchCameraImg}
                alt="Switch Camera"
                className="switch-camera-img"
              />
            </button>
          </h2>

          <div className="video-feed">
            <video
              id="camera"
              ref={videoRef}
              autoPlay
              playsInline
              width="550"
              height="720"
              style={{ transform: "scaleX(-1)" }}
            ></video>
          </div>
          <div className="info-panels">
            <div className="info-panel">
              Generic Medicine: <strong>{prediction}</strong>
            </div>
            <div className="info-panel">
              Primary Indication: {/* Add additional info as needed */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
