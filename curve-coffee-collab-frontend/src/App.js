import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Card from "./components/Card";
import SoloSipper from "./components/SoloSipper";
import Leaderboard from "./components/Leaderboard";
import React, { useEffect, useState } from "react";

function App() {
  const [pairs, setPairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    const url = `${API_BASE_URL}/pairs-with-names`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setPairs(data))
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', alignItems: 'center', width: '100%' }}>
          <Leaderboard />
          <SoloSipper />
        </div>
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
    </div>
  );
}

export default App;