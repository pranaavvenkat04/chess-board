// Board.js
import React from 'react';
import Square from './Square';
import './Board.css';

const Board = ({ board, onPieceClick, selectedPiece }) => {
  return (
    <div className="chess-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            row={rowIndex}
            col={colIndex}
            onPieceClick={onPieceClick}
            isSelected={
              selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex
            }
          />
        ))
      )}
    </div>
  );
};

export default Board;
