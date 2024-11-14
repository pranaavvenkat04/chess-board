// Square.js
import React from 'react';
import pieceImages from './pieceImages';

const Square = ({ piece, row, col, onPieceClick, isSelected }) => {
  const isDark = (row + col) % 2 === 1;

  return (
    <div
      className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''}`}
      onClick={() => onPieceClick(row, col)}
    >
      {piece && (
        <img
          src={pieceImages[piece]}
          alt={piece}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default Square;
