import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><button onClick={openModal} className="contact-button">Contact Me</button></li>
        </ul>
      </nav>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Contact Me</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Your Name" required />
              
              <label>Email:</label>
              <input type="email" placeholder="Your Email" required />
              
              <label>Message:</label>
              <textarea placeholder="Your Message" required></textarea>
              
              <div className="modal-buttons">
                <button type="submit">Send</button>
                <button type="button" onClick={closeModal}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;