


import React, { useState, useEffect } from "react";
import "../styles/components/Card.scss";
import coffeeIcon from "../assets/coffee-icon.png";

// Inline SVG for golden star
const GoldStar = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3l4.09 8.26L29 12.27l-6.5 6.34L24.18 29 16 24.27 7.82 29l1.68-10.39L3 12.27l8.91-1.01L16 3z" fill="#FFD700" stroke="#C9A13A" strokeWidth="1.2"/>
  </svg>
);


function Card({ name1, name2, pairId, member1Attended, member2Attended, onAttendanceUpdate }) {
  // Defensive: default null/undefined attendance to false
  const safeAttended1 = member1Attended === true;
  const safeAttended2 = member2Attended === true;

  const [expanded, setExpanded] = useState(false);
  const [attended1, setAttended1] = useState(safeAttended1);
  const [attended2, setAttended2] = useState(safeAttended2);

  // Only expand on click, not automatically

  // One-way action: can only mark as attended, not unmark
  const handleAttend = (member) => {
    if ((member === 1 && attended1) || (member === 2 && attended2)) return;
    const newAttended1 = member === 1 ? true : attended1;
    const newAttended2 = member === 2 ? true : attended2;
    fetch(`/pairs/${pairId}/attendance`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member1_attended: newAttended1,
        member2_attended: newAttended2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAttended1(data.member1_attended);
        setAttended2(data.member2_attended);
        onAttendanceUpdate(pairId, data.member1_attended, data.member2_attended);
      });
  };

  const concluded = attended1 && attended2;

  return (
    <>
      {expanded && (
        <div
          className="card-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            transition: "background 0.3s"
          }}
          onClick={() => setExpanded(false)}
        />
      )}
      <div
        className={`card${concluded ? " concluded" : ""}${expanded ? " expanded" : ""}`}
        onClick={() => setExpanded(true)}
        style={{
          cursor: "pointer",
          position: expanded ? "fixed" : "relative",
          top: expanded ? "50%" : undefined,
          left: expanded ? "50%" : undefined,
          transform: expanded
            ? "translate(-50%, -50%) scale(1.18)"
            : "scale(1)",
          minWidth: expanded ? 400 : 250,
          minHeight: expanded ? 220 : undefined,
          width: expanded ? 480 : "30%",
          maxWidth: expanded ? 520 : undefined,
          background: concluded
            ? (expanded ? "#fffbe6" : "#fffbe6")
            : (expanded ? "#23272f" : "#1a1a1a"),
          zIndex: expanded ? 1100 : 1,
          boxShadow: concluded
            ? (expanded
                ? "0 0 24px 4px #ffe066, 0 16px 64px 0 rgba(0,0,0,0.32)"
                : "0 0 12px 2px #ffe066, 0 2px 8px 0 rgba(0,0,0,0.08)")
            : (expanded
                ? "0 16px 64px 0 rgba(0,0,0,0.45)"
                : "0 2px 8px 0 rgba(0,0,0,0.08)"),
          border: concluded
            ? (expanded ? "2.5px solid #FFD700" : "2px solid #FFD700")
            : (expanded ? "2.5px solid #c97a3a" : "1px solid #333"),
          borderRadius: 16,
          transition:
            "all 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s, border 0.22s"
        }}
      >
        {concluded && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 16,
            zIndex: 1201,
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(255,215,0,0.18)',
            padding: 2,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #FFD700'
          }}>
            <GoldStar />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            gap: expanded ? '2.5rem' : undefined
          }}
        >
          {/* Member 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              className="name-left"
              style={{
                minWidth: 0,
                maxWidth: expanded ? 180 : 120,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              {name1}
            </div>
            {expanded && (
              <button
                className={attended1 ? "attended-tab" : "attend-tab"}
                style={{
                  background: attended1 ? "#4caf50" : attended1 === false ? "#e53935" : "#eee",
                  color: attended1 ? "#fff" : attended1 === false ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "16px",
                  padding: "0.35rem 1.1rem",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  cursor: attended1 ? "default" : "pointer",
                  boxShadow: attended1 ? "0 2px 8px rgba(76,175,80,0.18)" : attended1 === false ? "0 2px 8px rgba(229,57,53,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "background 0.2s, color 0.2s",
                  marginTop: '0.5rem'
                }}
                onClick={e => { e.stopPropagation(); handleAttend(1); setExpanded(true); }}
                disabled={attended1}
              >
                {attended1 ? "✓ Attended" : "Attended?"}
              </button>
            )}
          </div>
          {/* Coffee icon in the center */}
          <div className="coffee-icon" style={{ alignSelf: 'flex-start', marginTop: expanded ? '1.2rem' : 0 }}>
            <img src={coffeeIcon} alt="Coffee" />
          </div>
          {/* Member 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              className="name-right"
              style={{
                minWidth: 0,
                maxWidth: expanded ? 180 : 120,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              {name2}
            </div>
            {expanded && (
              <button
                className={attended2 ? "attended-tab" : "attend-tab"}
                style={{
                  background: attended2 ? "#4caf50" : attended2 === false ? "#e53935" : "#eee",
                  color: attended2 ? "#fff" : attended2 === false ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "16px",
                  padding: "0.35rem 1.1rem",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  cursor: attended2 ? "default" : "pointer",
                  boxShadow: attended2 ? "0 2px 8px rgba(76,175,80,0.18)" : attended2 === false ? "0 2px 8px rgba(229,57,53,0.18)" : "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "background 0.2s, color 0.2s",
                  marginTop: '0.5rem'
                }}
                onClick={e => { e.stopPropagation(); handleAttend(2); setExpanded(true); }}
                disabled={attended2}
              >
                {attended2 ? "✓ Attended" : "Attended?"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;