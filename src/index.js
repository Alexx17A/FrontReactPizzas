import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import reportWebVitals from "./reportWebVitals";

// Cargar tu clave pública de Stripe
const stripePromise = loadStripe("tu_clave_publica_de_stripe");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);

// Si deseas medir el rendimiento de tu app, pasa una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o envíalos a un endpoint de analíticas. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals();
