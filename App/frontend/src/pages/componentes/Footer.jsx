import React from 'react';
import { Container } from 'react-bootstrap';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <div>
      <footer className="footer-custom py-3" >
        <Container className="d-flex justify-content-center">
          <a href="https://instagram.com" className="mx-3" aria-label="Instagram">
            <FaInstagram size={30} />
          </a>
          <a href="https://facebook.com" className="mx-3" aria-label="Facebook">
            <FaFacebookF size={30} />
          </a>
          <a href="https://twitter.com" className="mx-3" aria-label="X (Twitter)">
            <FaTwitter size={30} />
          </a>
        
        </Container>
      </footer>
      </div>
    );
  };
  
  export default Footer;