import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Card from "./components/Card";
import React, { useEffect, useState } from "react";

function App() {
  const [pairs, setPairs] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

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

  return (
    <div className="App">
      <Header />
      <Hero />
      <div className="cards-container">
        {pairs.map((pair, idx) => (
          <Card
            key={idx}
            name1={pair.member1.name}
            name2={pair.member2.name}
          />
        ))}
      </div>
      <NameSection />
      <Footer />
    </div>
  );
}

export default App;