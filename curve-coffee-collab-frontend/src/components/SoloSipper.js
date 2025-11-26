
import React, { useEffect, useState } from "react";
import "../styles/components/SoloSipper.scss";

const coffeeEmoji = "\u2615\uFE0F"; // ☕️
const confetti = "\uD83C\uDF89"; // 🎉

function getApiBaseUrl() {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000";
  }
  return "https://curve-coffee-collab-backend-893898539752.us-central1.run.app";
}

export default function SoloSipper() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    fetch(API_BASE_URL + "/solo-sipper-of-the-week")
      .then((res) => {
        if (!res.ok) throw new Error("No solo sipper found");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setLoading(false);
      })
      .catch((err) => {
        setError("No solo sipper this week!");
        setLoading(false);
      });
  }, [API_BASE_URL]);

  return (
    <div className="solo-sipper-banner">
      <div className="solo-sipper-title celebrating">
        {confetti} Solo Sipper of the week! {confetti}
      </div>
      <div className="solo-sipper-content">
        {loading ? (
          <span className="solo-sipper-loading">Loading...</span>
        ) : error ? (
          <span className="solo-sipper-error">{error}</span>
        ) : (
          <span className="solo-sipper-name leaderboard-name">{coffeeEmoji} {name} {coffeeEmoji}</span>
        )}
      </div>
    </div>
  );
}
