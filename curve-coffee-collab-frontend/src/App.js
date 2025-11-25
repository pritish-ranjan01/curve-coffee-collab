import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import Card from "./components/Card";
import { shufflePairs } from "./utils/shuffleUtils";
import React, { useEffect, useState } from "react";

function App() {
  const [pairs, setPairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    const url = `${API_BASE_URL}/pairs-with-names`;
    console.log("Fetching from:", url);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Pairs data:", data);
        setPairs(data);
      })
      .catch((err) => {
        console.error("Failed to fetch pairs:", err);
      });
  }, [API_BASE_URL]);

  const filteredPairs = pairs.filter(
    (pair) =>
      pair.member1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.member2.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShuffle = () => {
    setPairs(shufflePairs(pairs));
  };

  return (
    <div className="App">
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Overview onShuffle={handleShuffle} />
      <div className="cards-container">
        {filteredPairs.length > 0 ? (
          filteredPairs.map((pair, idx) => (
            <Card
              key={idx}
              name1={pair.member1.name}
              name2={pair.member2.name}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", margin: "2rem 0" }}>
            No coffee collabs for you!
          </div>
        )}
      </div>
      <NameSection />
      <Footer />
    </div>
  );
}

export default App;
