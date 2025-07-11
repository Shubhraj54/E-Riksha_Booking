import React, { useState } from 'react';
import '../CSS/Book.css';
import rikshaList from '../data/rikshaList.json';
import BookForm from '../components/BookForm';

function Book() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="booking-container">
      <h2>Book Your E-Rickshaw</h2>
      {!selected && (
        <>
          <p style={{ textAlign: 'center', marginBottom: 24 }}>
            Select a rickshaw to continue booking:
          </p>
          <div className="riksha-list">
            {rikshaList.map(riksha => (
              <div key={riksha.id} className={`riksha-card`}>
                <img
                  src={riksha.image}
                  alt={riksha.name}
                  className="riksha-img"
                />
                <h4>{riksha.name}</h4>
                <p>{riksha.desc}</p>
                <button
                  className="book-now-button"
                  onClick={() => setSelected(riksha)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {selected && (
        <BookForm riksha={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

export default Book;
