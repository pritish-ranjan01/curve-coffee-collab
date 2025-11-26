import React, { useEffect, useState } from "react";
import "../styles/components/Leaderboard.scss";
// Use the same GoldStar SVG as Card.js for consistency
const GoldStar = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3l4.09 8.26L29 12.27l-6.5 6.34L24.18 29 16 24.27 7.82 29l1.68-10.39L3 12.27l8.91-1.01L16 3z" fill="#FFD700" stroke="#C9A13A" strokeWidth="1.2"/>
  </svg>
);

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_BASE_URL + "/leaderboard/")
      .then((res) => {
        if (!res.ok) throw new Error("No leaderboard data");
        return res.json();
      })
      .then((data) => {
        setLeaders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No leaderboard data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="leaderboard-banner">
      <div className="leaderboard-title">🏆 Leaderboard 🏆</div>
      <div className="leaderboard-content">
        {loading ? (
          <span className="leaderboard-loading">Loading...</span>
        ) : error ? (
          <span className="leaderboard-error">{error}</span>
        ) : (
          <div className="leaderboard-list">
            {leaders.filter(l => l.stars_earned > 0).map((leader) => (
              <div className="leaderboard-row centered" key={leader.name + leader.stars_earned}>
                <span className="leaderboard-name">{leader.name}</span>
                <span className="leaderboard-stars">
                  {Array.from({ length: Math.min(3, leader.stars_earned) }).map((_, i) => (
                    <GoldStar key={i} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
