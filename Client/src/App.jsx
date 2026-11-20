import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    api
      .get("/health/db")
      .then((response) => {
        setStatus(response.data.message);
      })
      .catch((error) => {
        console.error("Connection error:", error);
        setStatus("Connection failed. Check the Backend.");
      });
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>TripCraft Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;

