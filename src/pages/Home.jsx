import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../CSS/Home.css';

function Home() {
  return (
    <>
    {/* <Navbar /> */}
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <h1>Rent E-Rickshaw Easily!</h1>
        <p>Affordable, Eco-Friendly, and Available in Your Area.</p>
        <div className="btn-group">
          <Link to="/book" className="btn primary">📅 Book Now</Link>
          <Link to="/rickshaws" className="btn secondary">🛺 Browse Rickshaws</Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Find Rickshaw</h3>
            <p>Browse electric rickshaws in your city or nearby.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Book Instantly</h3>
            <p>Choose date & time and confirm your ride.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Enjoy Ride</h3>
            <p>Pay & ride with comfort and safety.</p>
          </div>
        </div>
      </section>
    </div>
    </>
    
  );
}

export default Home;
