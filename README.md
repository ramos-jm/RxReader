# 💊 RXReader – Real-time Prescription Recognition

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![CNN](https://img.shields.io/badge/CNN-Deep%20Learning-blue?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

RXReader is a **real-time web application** that leverages **deep learning** to recognize and classify **handwritten generic medicine names** from prescriptions.

The system is powered by a **Convolutional Neural Network (CNN)** trained on **6,720 augmented prescription samples**, achieving an accuracy of **94.76%**.

The trained model was **converted from TensorFlow (Python) to TensorFlow.js**, allowing it to run entirely in the browser for **instant inference, offline functionality, and enhanced privacy** without server dependencies.


Built with **React and TypeScript**, RXReader is designed for healthcare professionals and researchers looking for a scalable and accessible solution to address prescription misinterpretation errors. Its architecture emphasizes **performance, privacy, and future integration potential** with OCR and EHR systems.


---

## 🚀 Features
- 🧠 **AI-Powered Detection** – CNN model trained on 6,720 augmented handwritten prescription images.
- 🔄 **TensorFlow.js Integration** – Converted from TensorFlow (Python) to TensorFlow.js for in-browser inference.
- ⚡ **Real-time Predictions** – Processes video frames instantly without server calls.
- 💻 **Responsive UI** – React-based, designed for desktop and mobile users.
- 🔒 **Privacy First** – No data upload; all processing is performed locally.
- 📈 **High Accuracy** – Achieved 94.76% accuracy with robust precision and recall.

---

## 🏗 Tech Stack
| Layer        | Technology               |
|--------------|-------------------------|
| Frontend     | React + TypeScript      |
| AI Framework | TensorFlow.js (converted from TensorFlow) |
| Model        | CNN (Keras → TensorFlow.js) |
| Build Tool   | Vite                    |
| Deployment   | Railway Hosting         |

---

## 📂 Project Structure
```plaintext
RXReader/
├── public/
│   ├── assets/             # Static assets (images, icons, etc.)
│   └── model/              # Converted TensorFlow.js model files
├── src/
│   ├── App.css             # Main application styling
│   ├── App.tsx             # Root React component
│   ├── Navbar.css          # Styling for navigation bar
│   ├── Navbar.tsx          # Navigation bar component
│   ├── index.css           # Global styles
│   ├── main.tsx            # React entry point
│   └── vite-env.d.ts       # TypeScript environment definitions
├── .gitignore
├── README.md
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML template
├── package-lock.json
├── package.json
├── tsconfig.app.json       # TypeScript configuration (App)
├── tsconfig.json           # TypeScript configuration (Global)
├── tsconfig.node.json      # TypeScript configuration (Node)
└── vite.config.ts          # Vite configuration
