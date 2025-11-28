import React from 'react';
import './Footer.css';
// 1. IMPORT ICON FEATHER
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from 'react-feather';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-col">
          <div className="socials">
            {/* 2. DÙNG ICON NHƯ COMPONENT */}
            <div className="social-icon"><Facebook size={18} /></div>
            <div className="social-icon"><Twitter size={18} /></div>
            <div className="social-icon"><Instagram size={18} /></div>
          </div>
          <div style={{marginTop:20}}>
             <div className="footer-link">Home</div>
             <div className="footer-link">About</div>
             <div className="footer-link">Service</div>
          </div>
        </div>
        
        <div className="footer-col">
           <h3>#TUTOR SUPPORT SYSTEM</h3>
           <div className="footer-link">Contact us</div>
           <div className="footer-link">Policy</div>
           <div className="footer-link">Account</div>
        </div>
        
        <div className="footer-col">
          <h3>GET IN TOUCH</h3>
          <div className="contact-row">
             <MapPin size={18} /> 268 Lý Thường Kiệt, P.14, Q.10, TP.HCM
          </div>
          <div className="contact-row">
             <Mail size={18} /> tutorsupport@hcmut.edu.vn
          </div>
          <div className="contact-row">
             <Phone size={18} /> +84 363 699 696
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2025 Tutor Support System - Trường Đại Học Bách Khoa TP.HCM.</div>
        <div>Terms of Use - Private Policy</div>
      </div>
    </footer>
  );
};
export default Footer;