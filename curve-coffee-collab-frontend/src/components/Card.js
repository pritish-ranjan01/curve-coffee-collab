

import React, { useState, useEffect } from "react";
import "../styles/components/Card.scss";
import coffeeIcon from "../assets/coffee-icon.png";

function getRandomItems(arr, n) {
  const result = [];
  const taken = new Set();
  while (result.length < n && arr.length > 0) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!taken.has(idx)) {
      result.push(arr[idx]);
      taken.add(idx);
    }
  }
  return result;
}

// Inline SVG for golden star
const GoldStar = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3l4.09 8.26L29 12.27l-6.5 6.34L24.18 29 16 24.27 7.82 29l1.68-10.39L3 12.27l8.91-1.01L16 3z" fill="#FFD700" stroke="#C9A13A" strokeWidth="1.2"/>
  </svg>
);


function Card({ name1, name2, pairId, member1Attended, member2Attended, onAttendanceUpdate, onCloseAllCards, closeAllCardsFlag }) {
  // State hooks
  const [expanded, setExpanded] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopic, setCustomTopic] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [dialogTriggeredByCoffee, setDialogTriggeredByCoffee] = useState(false);
  const [attended1, setAttended1] = useState(member1Attended);
  const [attended2, setAttended2] = useState(member2Attended);

  // Reset attendance state when pairId or attendance props change
  useEffect(() => {
    setAttended1(member1Attended);
    setAttended2(member2Attended);
  }, [pairId, member1Attended, member2Attended]);
  const apiBase = process.env.REACT_APP_API_BASE_URL || "";
  // Concluded if both attended
  const concluded = attended1 && attended2;
  const [sessionBooked, setSessionBooked] = useState(false);

  // Close topic dialog when clicking outside the dialog (but not the card)
  useEffect(() => {
    if (!(expanded && showTopicDialog && dialogTriggeredByCoffee)) return;
    const handleClick = (e) => {
      const dialogElem = document.querySelector('.topic-dialog');
      if (dialogElem && !dialogElem.contains(e.target)) {
        setShowTopicDialog(false);
        setDialogTriggeredByCoffee(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [expanded, showTopicDialog, dialogTriggeredByCoffee]);

  // Close card on Escape or outside click (if not in topic dialog)
  useEffect(() => {
    if (!expanded || (showTopicDialog && dialogTriggeredByCoffee)) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setExpanded(false);
      }
    };
    const handleClick = (e) => {
      // If click is outside the card and not on dialog
      const cardElem = document.querySelector('.card.expanded');
      const dialogElem = document.querySelector('.topic-dialog');
      if (
        cardElem &&
        !cardElem.contains(e.target) &&
        (!dialogElem || !dialogElem.contains(e.target))
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [expanded, showTopicDialog, dialogTriggeredByCoffee]);

  // One-way action: can only mark as attended, not unmark
  const handleAttend = (member) => {
    const newAttended1 = member === 1 ? true : attended1;
    const newAttended2 = member === 2 ? true : attended2;
    fetch(`${apiBase}/pairs/${pairId}/attendance`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member1_attended: newAttended1,
        member2_attended: newAttended2,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setAttended1(newAttended1);
        setAttended2(newAttended2);
        if (onAttendanceUpdate) onAttendanceUpdate();
      });
  };

  // Effect to close card if parent requests
  useEffect(() => {
    if (closeAllCardsFlag) {
      setExpanded(false);
      setShowTopicDialog(false);
      setDialogTriggeredByCoffee(false);
    }
  }, [closeAllCardsFlag]);

  // Main card UI
  return (
    <div
      className={`card${concluded ? " concluded" : ""}${expanded ? " expanded" : ""}`}
      onClick={e => {
        if (
          e.target.closest('.coffee-icon') ||
          e.target.closest('.topic-dialog')
        ) {
          return;
        }
        setExpanded(true);
      }}
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
      {sessionBooked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          color: '#4caf50',
          fontWeight: 700,
          fontSize: 28,
          padding: '2rem 3rem',
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          zIndex: 2000,
          textAlign: 'center',
        }}>
          Session Booked!
        </div>
      )}
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
        <div
          className={`coffee-icon clickable-coffee${concluded ? ' disabled' : ''}`}
          style={{
            alignSelf: 'flex-start',
            marginTop: expanded ? '1.2rem' : 0,
            opacity: concluded ? 0.5 : 1,
            pointerEvents: concluded ? 'none' : 'auto',
            cursor: concluded ? 'not-allowed' : 'pointer'
          }}
          onClick={concluded ? undefined : async e => {
            e.stopPropagation();
            setDialogTriggeredByCoffee(true);
            if (!expanded) {
              setExpanded(true);
              setTimeout(async () => {
                if (topics.length === 0 && !loadingTopics) {
                  setLoadingTopics(true);
                  try {
                    const res = await fetch(`${apiBase}/topics/`);
                    if (res.ok) {
                      const data = await res.json();
                      const allTopics = data.map(t => t.topic);
                      setTopics(getRandomItems(allTopics, 10));
                    }
                  } catch (err) {
                    // Optionally handle error
                  } finally {
                    setLoadingTopics(false);
                  }
                }
                setShowTopicDialog(true);
              }, 10);
            } else {
              if (topics.length === 0 && !loadingTopics) {
                setLoadingTopics(true);
                try {
                  const res = await fetch(`${apiBase}/topics/`);
                  if (res.ok) {
                    const data = await res.json();
                    const allTopics = data.map(t => t.topic);
                    setTopics(getRandomItems(allTopics, 10));
                  }
                } catch (err) {
                  // Optionally handle error
                } finally {
                  setLoadingTopics(false);
                }
              }
              setShowTopicDialog(true);
            }
          }}
          tabIndex={concluded ? -1 : 0}
          role="button"
          aria-label="Click for coffee fun"
          aria-disabled={concluded}
        >
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
      {/* Render the topic dialog only when both expanded and showTopicDialog are true */}
      {expanded && showTopicDialog && dialogTriggeredByCoffee && !sessionBooked && (
        <div
          className="topic-dialog"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1200,
            background: concluded ? "#fffbe6" : "#23272f",
            border: concluded ? "2.5px solid #FFD700" : "2.5px solid #c97a3a",
            borderRadius: 16,
            boxShadow: concluded
              ? "0 0 24px 4px #ffe066, 0 16px 64px 0 rgba(0,0,0,0.32)"
              : "0 16px 64px 0 rgba(0,0,0,0.45)",
            minWidth: 520,
            maxWidth: 700,
            minHeight: 220,
            padding: "2.2rem 2.5rem 2.2rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ color: concluded ? "#c97a3a" : "#fff", fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
            Select a topic for your coffee chat!
          </div>
          {loadingTopics ? (
            <div style={{ color: concluded ? "#c97a3a" : "#fff", fontSize: 16 }}>Loading topics...</div>
          ) : topics.length > 0 ? (
            <>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'center',
                marginBottom: 18,
                maxWidth: 600
              }}>
                {topics.map((topic, idx) => {
                  const selected = selectedTopics.includes(topic);
                  return (
                    <label
                      key={idx}
                      style={{
                        display: 'inline-block',
                        background: selected ? (concluded ? '#c97a3a' : '#FFD700') : (concluded ? '#FFD700' : '#c97a3a'),
                        color: selected ? (concluded ? '#fff' : '#23272f') : (concluded ? '#23272f' : '#fff'),
                        borderRadius: 18,
                        padding: '0.5rem 1.2rem',
                        fontWeight: 500,
                        fontSize: 16,
                        cursor: 'pointer',
                        boxShadow: selected ? '0 0 0 3px #ffe06699, 0 2px 16px #c97a3a99' : '0 2px 8px rgba(0,0,0,0.08)',
                        border: selected ? '2px solid #FFD700' : 'none',
                        transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                      }}
                      tabIndex={0}
                      htmlFor={`topic-select-${idx}`}
                    >
                      <input
                        type="radio"
                        name="topic-select"
                        id={`topic-select-${idx}`}
                        style={{ display: 'none' }}
                        onChange={() => setSelectedTopics([topic])}
                        checked={selected}
                      />
                      {topic}
                    </label>
                  );
                })}
              </div>
              {/* Free text input for custom topic */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <input
                  type="text"
                  placeholder="Or type your own..."
                  value={customTopic}
                  onChange={e => {
                    setCustomTopic(e.target.value);
                    setSelectedTopics(e.target.value ? [e.target.value] : []);
                  }}
                  style={{
                    padding: '0.5rem 1.2rem',
                    borderRadius: 18,
                    border: selectedTopics[0] === customTopic && customTopic ? '2px solid #FFD700' : '1.5px solid #c97a3a',
                    fontSize: 16,
                    width: 320,
                    background: concluded ? '#fffbe6' : '#23272f',
                    color: concluded ? '#c97a3a' : '#fff',
                    outline: 'none',
                    boxShadow: selectedTopics[0] === customTopic && customTopic ? '0 0 0 3px #ffe06699' : '0 2px 8px rgba(0,0,0,0.08)',
                    fontWeight: 500
                  }}
                />
              </div>
            </>
          ) : (
            <div style={{ color: concluded ? "#c97a3a" : "#fff", fontSize: 16 }}>(No topics found)</div>
          )}
          {/* Date/Time Picker */}
          <div style={{ margin: '18px 0 0 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: concluded ? '#c97a3a' : '#fff', fontWeight: 500, fontSize: 16, marginBottom: 6 }}>
              Select date & time:
            </label>
            <input
              type="datetime-local"
              value={meetingDate}
              onChange={e => setMeetingDate(e.target.value)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 8,
                border: '1.5px solid #c97a3a',
                fontSize: 15,
                marginBottom: 10,
                background: concluded ? '#fffbe6' : '#23272f',
                color: concluded ? '#c97a3a' : '#fff',
                outline: 'none',
                width: 220
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: 8,
                border: "none",
                background: concluded ? "#FFD700" : "#c97a3a",
                color: concluded ? "#23272f" : "#fff",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}
              onClick={() => {
                setShowTopicDialog(false);
                setDialogTriggeredByCoffee(false);
                setSessionBooked(true);
                setExpanded(false);
                if (onCloseAllCards) onCloseAllCards();

                // Copy template to clipboard
                const topicsText = selectedTopics.length > 0 ? selectedTopics.join(", ") : "";
                const template = `Hi,\n\nWe were matched by the Curve CoffeeCollab app to have a coffee chat. Does the following time work for you?\n${meetingDate ? meetingDate : '<replace with date and time>'}\n\nI'd love to discuss the following topic${selectedTopics.length > 1 ? 's' : ''}: ${topicsText ? topicsText : '<replace with the topic selected>'}.\n\nThanks!`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(template);
                } else {
                  // fallback for older browsers
                  const textarea = document.createElement('textarea');
                  textarea.value = template;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                }

                setTimeout(() => setSessionBooked(false), 2000);
              }}
            >
              Book CoffeeCollab
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;