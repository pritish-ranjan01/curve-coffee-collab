import "../styles/components/Hero.scss";




function Hero({ searchTerm, setSearchTerm }) {
  return (
    <div className="hero">
      <div className="hero-text">
        <img
          src={require("../assets/logo_coffee_collab.png")}
          alt="Coffee Collab Logo"
          className="hero-logo"
          style={{ width: "110px", height: "auto", margin: "0 auto 1.5rem auto", display: "block" }}
        />
        <h1>Welcome to CoffeeCollab</h1>
        <p>Connect. Collaborate. Caffeinate.</p>
        <input
          type="text"
          placeholder="Search for a name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginTop: "1rem", padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}

export default Hero;
