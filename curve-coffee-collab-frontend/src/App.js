import "./App.scss";
import Header from "./components/Header";
import NameSection from "./components/NameSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <NameSection />
      <Footer />
    </div>
  );
}

export default App;
