import React, { useState } from 'react';
import rikshaList from '../data/rikshaList.json';
import '../CSS/Riksha.css';

function Riksha() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="riksha-browse-container">
      <h2>Browse E-Rickshaws</h2>
      {!selected && (
        <div className="riksha-list">
          {rikshaList.map(riksha => (
            <div key={riksha.id} className="riksha-card" onClick={() => setSelected(riksha)}>
              <img src={riksha.image} alt={riksha.name} className="riksha-img" />
              <h4>{riksha.name}</h4>
              <p>{riksha.desc}</p>
              <button className="view-features-btn">View Features</button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="riksha-features-modal">
          <div className="riksha-features-content">
            <img src={selected.image} alt={selected.name} className="riksha-img-large" />
            <h3>{selected.name}</h3>
            <p>{selected.desc}</p>
            {/* Example features, you can expand this as needed */}
            <ul className="features-list">
              <li>Eco-friendly electric drive</li>
              <li>Comfortable seating</li>
              <li>GPS enabled</li>
              <li>Mobile charging port</li>
              <li>Safety features</li>
            </ul>
            <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Riksha;
