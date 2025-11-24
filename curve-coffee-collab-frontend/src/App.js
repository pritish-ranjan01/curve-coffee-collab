import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Card from "./components/Card";
import React, { useEffect, useState } from "react";

function App() {
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    fetch("/pairs-with-names")
      .then((res) => res.json())
      .then((data) => setPairs(data));
  }, []);

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