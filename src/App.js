import React, { useState } from 'react';
import Board from './Board';
import initialBoardSetup from './initialBoardSetup';
import { isValidMove, isKingInCheck, isCheckmate } from './moveValidation';
import PromotionModal from './PromotionModal';

const App = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('white');
  const [kingInCheck, setKingInCheck] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [promotion, setPromotion] = useState(null);

  const [castlingState, setCastlingState] = useState({
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookMoved: { kingside: false, queenside: false },
    blackRookMoved: { kingside: false, queenside: false },
  });

  const handlePromotion = (piece) => {
    if (promotion) {
      piece = turn === 'white' ? piece.toUpperCase() : piece.toLowerCase();
      const newBoard = board.map((r) => [...r]);
      newBoard[promotion.row][promotion.col] = piece;
      setBoard(newBoard);
      setPromotion(null);

      // Ensure turn switches after promotion
      setTurn((prevTurn) => (prevTurn === 'white' ? 'black' : 'white'));

      // Checkmate or check logic after promotion
      const opponentTurn = turn === 'white' ? 'black' : 'white';
      const opponentInCheck = isKingInCheck(newBoard, opponentTurn);
      if (opponentInCheck && isCheckmate(newBoard, opponentTurn)) {
        alert(`Checkmate! ${turn} wins!`);
      } else {
        setKingInCheck(opponentInCheck ? opponentTurn : null);
      }
    }
  };

  const handlePieceClick = (row, col) => {
    const piece = board[row][col];

    if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
      setSelectedPiece({ piece, row, col });
    } else if (selectedPiece && isValidMove(board, selectedPiece, row, col, lastMove, castlingState)) {
      const newBoard = board.map((r) => [...r]);

      const isPawnPromotion =
        selectedPiece.piece.toLowerCase() === 'p' &&
        ((turn === 'white' && row === 0) || (turn === 'black' && row === 7));

      if (isPawnPromotion) {
        setPromotion({ row, col, color: turn });
        newBoard[selectedPiece.row][selectedPiece.col] = ''; // Clear the original pawn position
        setBoard(newBoard);
        setSelectedPiece(null);
        return; // Prevent switching turns until promotion is handled
      }

      // Handle castling move
      if (selectedPiece.piece.toLowerCase() === 'k' && Math.abs(col - selectedPiece.col) === 2) {
        const rookCol = col > selectedPiece.col ? 7 : 0;
        const newRookCol = col > selectedPiece.col ? col - 1 : col + 1;
        newBoard[row][rookCol] = '';
        newBoard[row][newRookCol] = turn === 'white' ? 'R' : 'r';
      }

      // En passant capture
      if (
        selectedPiece.piece.toLowerCase() === 'p' &&
        Math.abs(col - selectedPiece.col) === 1 &&
        board[row][col] === ''
      ) {
        const captureRow = turn === 'white' ? row + 1 : row - 1;
        newBoard[captureRow][col] = '';
      }


      newBoard[selectedPiece.row][selectedPiece.col] = '';
      newBoard[row][col] = selectedPiece.piece;

      // Check for king in check after the move
      if (isKingInCheck(newBoard, turn)) {
        alert("Invalid move: your king would be in check!");
        return;
      }

      // Handle castling and other special moves here...

      
      setBoard(newBoard);
      setSelectedPiece(null);
      setTurn(turn === 'white' ? 'black' : 'white');
      setLastMove({ piece: selectedPiece.piece, startRow: selectedPiece.row, startCol: selectedPiece.col, endRow: row, endCol: col });

      // Checkmate logic
      const opponentTurn = turn === 'white' ? 'black' : 'white';
      const opponentInCheck = isKingInCheck(newBoard, opponentTurn);
      if (opponentInCheck && isCheckmate(newBoard, opponentTurn)) {
        alert(`Checkmate! ${turn} wins!`);
      } else {
        setKingInCheck(opponentInCheck ? opponentTurn : null);
      }
    }
  };

  return (
    <div>
      <Board
        board={board}
        onPieceClick={handlePieceClick}
        selectedPiece={selectedPiece}
        kingInCheck={kingInCheck}
      />
      {promotion && 
      <PromotionModal 
        onSelect={handlePromotion}
      />}
    </div>
  );
};

export default App;
