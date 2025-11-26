
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

export default function SoloSipper({ name, loading, error }) {
  // coffeeEmoji and confetti defined above
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
