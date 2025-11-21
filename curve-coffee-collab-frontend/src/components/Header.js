import "../styles/components/Header.scss";
import logo from "../assets/logo.png";

function Header() {
  return (
    <div className="header">
      <div className="header-container">
        <div className="logo-section">
          <img src={logo} alt="CoffeeCollab Logo" className="logo-image" />
          <h1 className="logo-text">CoffeeCollab</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
