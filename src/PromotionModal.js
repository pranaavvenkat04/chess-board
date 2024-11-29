import React from 'react';

const PromotionModal = ({ onSelect }) => {
  return (
    <div className="promotion-modal">
      <h3>Choose a piece for promotion:</h3>
      <button onClick={() => onSelect('Q')}>Queen</button>
      <button onClick={() => onSelect('R')}>Rook</button>
      <button onClick={() => onSelect('B')}>Bishop</button>
      <button onClick={() => onSelect('N')}>Knight</button>
    </div>
  );
};

export default PromotionModal;
