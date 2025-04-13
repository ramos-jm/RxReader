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
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(true);

  // Confidence threshold for valid predictions
  const CONFIDENCE_THRESHOLD = 0.7; // 70% confidence threshold

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

  // Start the webcam feed based on the current facingMode with resolution constraints
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

        // Define video constraints with an ideal resolution
        const constraints = {
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        // Get the new stream based on the facingMode and resolution constraints
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
        // Make sure this path is correct relative to your deployed application
        const loadedModel = await tf.loadLayersModel("model/model.json");
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
            .expandDims(0); // Add batch dimension

          const predictionTensor = model.predict(imageTensor) as tf.Tensor;
          const predictionData = await predictionTensor.data();

          // Find the index with the highest confidence
          const maxConfidence = Math.max(...predictionData);
          const predictedIndex = predictionData.indexOf(maxConfidence);

          // Update confidence level state
          setConfidenceLevel(maxConfidence);

          // Check if confidence is above threshold
          if (maxConfidence >= CONFIDENCE_THRESHOLD) {
            setIsRecognizing(true);
            setPrediction(medicineMapping[predictedIndex]);
          } else {
            setIsRecognizing(false);
            setPrediction("Unknown");
          }

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

  // Conditional styling: Mirror video only for front camera
  // const getVideoStyles = () => {
  //   return facingMode === "user" ? { transform: "scaleX(-1)" } : {};
  // };

  const medicineInfo: {
    [key: string]: { description: string; indication: string };
  } = {
    Azathioprine: {
      description:
        "An immunosuppressive medication used in organ transplants and autoimmune diseases.",
      indication:
        "Prevention of organ rejection, treatment of rheumatoid arthritis.",
    },
    Ceftriaxone: {
      description: "A broad-spectrum cephalosporin antibiotic.",
      indication:
        "Bacterial infections such as pneumonia, meningitis, and gonorrhea.",
    },
    Chlorpromazine: {
      description:
        "An antipsychotic used to treat schizophrenia and bipolar disorder.",
      indication: "Psychotic disorders, nausea, and vomiting.",
    },
    Ciprofloxacin: {
      description:
        "A fluoroquinolone antibiotic effective against many bacteria.",
      indication: "Urinary tract infections, respiratory infections.",
    },
    Clarithromycin: {
      description:
        "A macrolide antibiotic used to treat various bacterial infections.",
      indication: "Respiratory tract infections, skin infections.",
    },
    Dobutamine: {
      description: "A medication that stimulates heart muscle contractions.",
      indication: "Acute heart failure, cardiac stress testing.",
    },
    Fluoxetine: {
      description: "An antidepressant of the SSRI class.",
      indication: "Depression, OCD, panic disorder.",
    },
    Hydrochlorothiazide: {
      description: "A diuretic used to treat high blood pressure and swelling.",
      indication: "Hypertension, edema.",
    },
    Hydrocortisone: {
      description: "A corticosteroid used to reduce inflammation.",
      indication: "Allergic conditions, skin problems, adrenal insufficiency.",
    },
    Hydroxyzine: {
      description: "An antihistamine with antianxiety effects.",
      indication: "Anxiety, nausea, allergies, sleep aid.",
    },
    Ibuprofen: {
      description: "A nonsteroidal anti-inflammatory drug (NSAID).",
      indication: "Pain relief, inflammation, fever.",
    },
    Levothyroxine: {
      description: "A synthetic thyroid hormone.",
      indication: "Hypothyroidism.",
    },
    Lorazepam: {
      description: "A benzodiazepine used to treat anxiety.",
      indication: "Anxiety disorders, insomnia, seizures.",
    },
    Metronidazole: {
      description: "An antibiotic and antiprotozoal medication.",
      indication: "Bacterial and parasitic infections.",
    },
    Prednisolone: {
      description: "A corticosteroid used to suppress the immune system.",
      indication: "Inflammatory and autoimmune conditions.",
    },
    Quinine: {
      description: "A medication used to treat malaria.",
      indication: "Malaria, leg cramps.",
    },
    Risperidone: {
      description: "An antipsychotic used to treat schizophrenia.",
      indication:
        "Schizophrenia, bipolar disorder, autism-related irritability.",
    },
    Rituximab: {
      description:
        "A monoclonal antibody used in autoimmune diseases and cancers.",
      indication: "Lymphomas, leukemias, rheumatoid arthritis.",
    },
    Salbutamol: {
      description: "A bronchodilator used to relieve asthma symptoms.",
      indication: "Asthma, COPD.",
    },
    Tramadol: {
      description: "A pain medication similar to opioids.",
      indication: "Moderate to severe pain.",
    },
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
              // style={getVideoStyles()}
            ></video>
          </div>

          {isRecognizing ? (
            <div className="info-panels">
              <div className="info-panel">
                <span className="medicine-name">
                  Generic Medicine: {prediction}
                </span>
                <span className="confidence-level">
                  Confidence: {(confidenceLevel * 100).toFixed(2)}%
                </span>
                <span className="medicine-description">
                  General Description:{" "}
                  {medicineInfo[prediction]?.description ||
                    "No description available."}
                </span>
              </div>
              <div className="info-panel">
                <span className="indication-title">Primary Indication:</span>
                <span className="indication-text">
                  {medicineInfo[prediction]?.indication ||
                    "No indication available."}
                </span>
              </div>
            </div>
          ) : (
            <div className="not-recognizing">
              <div className="error-message">
                <h3>No Generic Medicine Detected</h3>
                <p>
                  The system doesn't recognize the current object as any of the
                  trained generic medicine classes. Please point the camera at a
                  generic medicine.
                </p>
                <p className="confidence-info">
                  Confidence level: {(confidenceLevel * 100).toFixed(2)}%
                  (Threshold: {CONFIDENCE_THRESHOLD * 100}%)
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
