import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Card from "./components/Card";
import SoloSipper from "./components/SoloSipper";
import Leaderboard from "./components/Leaderboard";

import React, { useEffect, useState } from "react";

function getApiBaseUrl() {
  // Use env variable if set, otherwise choose based on environment
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // If running on localhost, use local backend
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000";
  }
  // Otherwise, use the public backend (replace with your deployed backend URL)
  return "https://curve-coffee-collab-backend-893898539752.us-central1.run.app";
}


function App() {
  const [pairs, setPairs] = useState([]);
  const [week, setWeek] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [closeAllCardsFlag, setCloseAllCardsFlag] = useState(false);

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const url = `${API_BASE_URL}/pairs-with-names`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setPairs(data.pairs || data);
        if (Array.isArray(data) && data.length > 0 && data[0].week) {
          setWeek(data[0].week);
        } else if (data.week) {
          setWeek(data.week);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch pairs:", err);
      });
  }, [API_BASE_URL]);

  // Handler to update attendance in state after backend update
  const handleAttendanceUpdate = (pairId, member1Attended, member2Attended) => {
    setPairs((prevPairs) =>
      prevPairs.map((pair) =>
        pair.id === pairId
          ? { ...pair, member1_attended: member1Attended, member2_attended: member2Attended }
          : pair
      )
    );
  };

  // Handler to close all cards (triggered by session booking)
  const handleCloseAllCards = () => {
    setCloseAllCardsFlag(true);
    setTimeout(() => setCloseAllCardsFlag(false), 200); // allow cards to react
  };

  // Filter pairs based on search term (case-insensitive)
  const filteredPairs = pairs.filter(
    (pair) =>
      pair.member1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.member2.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchTerm.length <= 2 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '100%' }}>
            <Leaderboard />
            <SoloSipper />
          </div>
          {week && (
            <div
              style={{
                fontWeight: 600,
                fontSize: 20,
                margin: '2.5rem auto 2.5rem auto',
                color: '#FFD700',
                textAlign: 'center',
                width: '100%',
                maxWidth: 600,
                background: '#23272f',
                borderRadius: 16,
                padding: '1.2rem 1.5rem',
                boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                display: 'block',
              }}
            >
              Random CoffeeCollab pairs for the week {week}
            </div>
          )}
        </>
      )}
      <div className="cards-container">
        {filteredPairs.length > 0 ? (
          filteredPairs.filter(pair => pair.id !== undefined && pair.id !== null).map((pair, idx) => (
            <Card
              key={pair.id || idx}
              pairId={pair.id}
              name1={pair.member1.name}
              name2={pair.member2.name}
              member1Attended={pair.member1_attended}
              member2Attended={pair.member2_attended}
              onAttendanceUpdate={handleAttendanceUpdate}
              onCloseAllCards={handleCloseAllCards}
              closeAllCardsFlag={closeAllCardsFlag}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", margin: "2rem 0" }}>
            no coffee collabs for you!
          </div>
        )}
      </div>
      <NameSection />
      <Footer />
      {/* Shuffle Pairs Button */}
      <button
        onClick={async () => {
          try {
            await fetch(`${API_BASE_URL}/shuffle-pairs`, { method: 'POST' });
            // Re-fetch pairs after shuffling
            const url = `${API_BASE_URL}/pairs-with-names`;
            const res = await fetch(url);
            const data = await res.json();
            setPairs(data.pairs || data);
            if (Array.isArray(data) && data.length > 0 && data[0].week) {
              setWeek(data[0].week);
            } else if (data.week) {
              setWeek(data.week);
            }
          } catch (err) {
            alert('Failed to shuffle pairs.');
          }
        }}
        style={{
          position: 'fixed',
          left: 12,
          bottom: 12,
          zIndex: 2000,
          background: '#2196f3',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.4rem 1.1rem',
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(33,150,243,0.18)',
          cursor: 'pointer',
          opacity: 0.92,
        }}
        title="Shuffle pairs and solo sipper"
      >
        Shuffle Pairs
      </button>
    </div>
  );
}

export default App;