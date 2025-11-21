import "../styles/components/Footer.scss";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img
              src={logo}
              alt="CoffeeCollab Logo"
              className="footer-logo-image"
            />
            <p className="footer-text">
              2025 CoffeeCollab. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
