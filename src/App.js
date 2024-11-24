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
  
    if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
      // Always select the piece that matches the current turn
      setSelectedPiece({ piece, row, col });
    } else if (selectedPiece && isValidMove(board, selectedPiece, row, col)) {
      // Attempt to move the selected piece if a valid move is made
      const newBoard = board.map((r) => [...r]);
      newBoard[selectedPiece.row][selectedPiece.col] = ''; // Clear the original square
      newBoard[row][col] = selectedPiece.piece; // Place the piece in the new square
      setBoard(newBoard);
      setSelectedPiece(null); // Clear selection after the move
      setTurn(turn === 'white' ? 'black' : 'white'); // Toggle turn
    }
  };
  
  return <Board board={board} onPieceClick={handlePieceClick} selectedPiece={selectedPiece} />;
};

export default App;
