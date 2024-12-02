import React from 'react';
import Square from './Square';
import './Board.css';

const Board = ({ board, onPieceClick, selectedPiece, kingInCheck, checkmate, stalemate, isFlipped }) => {
  return (
    <div className="chess-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          // Flipped Board Logic
          const adjustedRow = isFlipped ? 7 - rowIndex : rowIndex;
          const adjustedCol = isFlipped ? 7 - colIndex : colIndex;

          let icon = null;

          // Stalemate Graphics
          if (stalemate) {
            if (piece === 'K') {
              icon = '/images/icons/draw_white.png';  // White stalemate icon
            } else if (piece === 'k') {
              icon = '/images/icons/draw_black.png';  // Black stalemate icon
            }
          }

          // Checkmate Graphics
          if (checkmate) {
            if (piece === 'K' && checkmate.winner === 'white') {
              icon = '/images/icons/winner.png';
            } else if (piece === 'k' && checkmate.winner === 'black') {
              icon = '/images/icons/winner.png';
            } else if (piece === 'K' && checkmate.loser === 'white') {
              icon = '/images/icons/checkmate_white.png';
            } else if (piece === 'k' && checkmate.loser === 'black') {
              icon = '/images/icons/checkmate_black.png';
            }
          }

          return (
            <Square
              key={`${adjustedRow}-${adjustedCol}`}
              piece={piece}
              row={adjustedRow}
              col={adjustedCol}
              onPieceClick={onPieceClick}
              isSelected={selectedPiece && selectedPiece.row === adjustedRow && selectedPiece.col === adjustedCol}
              isInCheck={
                (kingInCheck === 'white' && piece === 'K') ||
                (kingInCheck === 'black' && piece === 'k')
              }
            >
              {icon && (
                <img
                  src={icon}
                  alt="checkmate or stalemate icon"
                  className="checkmate-icon"
                />
              )}
            </Square>
          );
        })
      )}
    </div>
  );
};

export default Board;
