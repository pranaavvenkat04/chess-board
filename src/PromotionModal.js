import React from 'react';

const PromotionModal = ({ onSelect }) => {
  return (
    <div>
      <div><h3>Choose a piece for promotion:</h3></div>
      <div className="promotion-modal">
        <button class="promotionButtons" onClick={() => onSelect('Q')}>Queen</button>
        <button class="promotionButtons" onClick={() => onSelect('R')}>Rook</button>
        <button class="promotionButtons" onClick={() => onSelect('B')}>Bishop</button>
        <button class="promotionButtons" onClick={() => onSelect('N')}>Knight</button>
      </div>
      
    </div>
  );
};

export default PromotionModal;
