import React, { useState } from 'react';
import Board from './Board';
import initialBoardSetup from './initialBoardSetup';
import { isValidMove, isKingInCheck } from './moveValidation';

const App = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('white'); // Track whose turn it is
  const [kingInCheck, setKingInCheck] = useState(null); // "white" or "black" if in check

  const handlePieceClick = (row, col) => {
    const piece = board[row][col];
  
    if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
      setSelectedPiece({ piece, row, col });
    } else if (selectedPiece && isValidMove(board, selectedPiece, row, col)) {

      const newBoard = board.map((r) => [...r]);
      newBoard[selectedPiece.row][selectedPiece.col] = ''; // Clear the original square
      newBoard[row][col] = selectedPiece.piece; // Place the piece in the new square

      // Check if move leaves the current player's king in check
      const currentKing = turn === 'white' ? 'white' : 'black';



      const isOwnKingInCheck = isKingInCheck(newBoard, currentKing);
      if (isOwnKingInCheck) {
        alert("Invalid move: your king would be in check!");
        return;
      }

      

      // Check if opponent's king is now in check
      const opponentKing = turn === 'white' ? 'black': 'white';

      const isOpponentKingInCheck = isKingInCheck(newBoard, opponentKing);
      // Update `kingInCheck` state only if a king is in check
      setKingInCheck(isOpponentKingInCheck ? (turn === 'white' ? 'black' : 'white') : null);

      
      setBoard(newBoard);
      setSelectedPiece(null);
      setTurn(turn === 'white' ? 'black' : 'white'); // Toggle turn
      
  
      
    }
  };

  return (
    <Board
      board={board}
      onPieceClick={handlePieceClick}
      selectedPiece={selectedPiece}
      kingInCheck={kingInCheck}
    />
  );
};

export default App;
