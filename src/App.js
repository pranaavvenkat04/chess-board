// App.js
import React, { useState } from 'react';
import Board from './Board';
import initialBoardSetup from './initialBoardSetup';
import { isValidMove } from './moveValidation';

const App = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('white'); // Track whose turn it is

  const handlePieceClick = (row, col) => {
    const piece = board[row][col];

    // Check if we’re selecting our own piece according to the turn
    if (selectedPiece) {
      const isOwnPiece = piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()));

      if (selectedPiece.row === row && selectedPiece.col === col) {
        // Deselect if the same square is clicked
        setSelectedPiece(null);
      } else if (isValidMove(board, selectedPiece, row, col) && !isOwnPiece) {
        // Check if the move is valid and doesn’t capture own piece
        const newBoard = board.map((r) => [...r]);
        newBoard[selectedPiece.row][selectedPiece.col] = ''; // Clear old position
        newBoard[row][col] = selectedPiece.piece; // Place the piece in the new position
        setBoard(newBoard); // Update board state
        setSelectedPiece(null); // Deselect piece after move
        setTurn(turn === 'white' ? 'black' : 'white'); // Toggle turn
      } else {
        setSelectedPiece(null); // Deselect if invalid move
      }
    } else if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
      // Select the piece only if it's the player's turn
      setSelectedPiece({ piece, row, col });
    }
  };

  return <Board board={board} onPieceClick={handlePieceClick} selectedPiece={selectedPiece} />;
};

export default App;
