import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h2>ShopNest</h2>
          <p>Your one-stop destination for smart shopping.</p>
          <p>Discover quality products and amazing deals, all in one place.</p>

          <div className="footer-socials">
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>Support</h3>
          <a href="/faq">FAQ</a>
          <a href="/shipping">Shipping & Returns</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>Company</h3>
          <a href="/about">About Us</a>
          <a href="/sustainability">Sustainability</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Get in Touch</h3>
          <p>123 Shopping Avenue</p>
          <p>India</p>
          <a href="/contact">Send us a message</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ShopNest. All rights reserved.</p>
        <p>Shop Smart. Live Better.</p>
      </div>
    </footer>
  );
}

export default Footer;
