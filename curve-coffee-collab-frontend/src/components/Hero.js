import "../styles/components/Hero.scss";

function Hero({ searchTerm, setSearchTerm }) {
  return (
    <div className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Welcome to CoffeeCollab</h1>
        <p>Your pairing buddy for collaboration.</p>
        <input
          type="text"
          placeholder="Search for a name..."
          className="hero-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Hero;
