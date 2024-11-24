// Board.js
import React from 'react';
import Square from './Square';
import './Board.css';

const Board = ({ board, onPieceClick, selectedPiece, kingInCheck }) => {
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
            isSelected={selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex}
            isInCheck={
              (kingInCheck === 'white' && piece === 'K') ||
              (kingInCheck === 'black' && piece === 'k')
            }
          />
        ))
      )}
    </div>
  );
};


export default Board;
