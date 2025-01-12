import React, { useState } from 'react';
import Board from './Board';
import initialBoardSetup from './initialBoardSetup';
import { isValidMove, isKingInCheck, isCheckmate, isStalemate} from './moveValidation';
import PromotionModal from './PromotionModal';

const App = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turn, setTurn] = useState('white');
  const [kingInCheck, setKingInCheck] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [checkmate, setCheckmate] = useState(null); // { winner: 'white', loser: 'black' }
  const [flip, setFlip] = useState(false); 
  const [stalemate, setStalemate] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);




  const [castlingState, setCastlingState] = useState({
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookMoved: { kingside: false, queenside: false },
    blackRookMoved: { kingside: false, queenside: false },
  });

  const resetBoard = () => {
    setBoard(initialBoardSetup);
    setSelectedPiece(null);
    setTurn('white');
    setFlip(false);
    setKingInCheck(null);
    setLastMove(null);
    setPromotion(null);
    setCheckmate(null);
    setStalemate(false);
    setCastlingState({
      whiteKingMoved: false,
      blackKingMoved: false,
      whiteRookMoved: { kingside: false, queenside: false },
      blackRookMoved: { kingside: false, queenside: false },
    });
    setMoveHistory([]); 
  };

  const handleFlipBoard = () => {
    setFlip((prevFlip) => !prevFlip);
  };

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
      setKingInCheck(opponentInCheck ? opponentTurn : null);
    }
  };

  const getChessNotation = (piece, startRow, startCol, endRow, endCol) => {
    const file = String.fromCharCode(97 + startCol); 
    const rank = 8 - startRow; 
    const targetFile = String.fromCharCode(97 + endCol);
    const targetRank = 8 - endRow;
    return `${piece}${file}${rank}-${targetFile}${targetRank}`;
  };
  

  const handlePieceClick = (row, col) => {
    if(stalemate) return;
    if(checkmate) return;
  
    const piece = board[row][col];
  
    if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
      setSelectedPiece({ piece, row, col });
    } else if (selectedPiece && isValidMove(board, selectedPiece, row, col, lastMove, castlingState)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[selectedPiece.row][selectedPiece.col] = '';
      newBoard[row][col] = selectedPiece.piece;
  
      // Pawn promotion logic
      if (selectedPiece.piece.toLowerCase() === 'p' && ((turn === 'white' && row === 0) || (turn === 'black' && row === 7))) {
        setPromotion({ row, col, color: turn });
        newBoard[selectedPiece.row][selectedPiece.col] = ''; 
        setBoard(newBoard);
        setSelectedPiece(null);
        return;
      }
  
      // Castling Logic
      if (selectedPiece.piece.toLowerCase() === 'k' && Math.abs(col - selectedPiece.col) === 2) {
        const rookCol = col > selectedPiece.col ? 7 : 0;
        const newRookCol = col > selectedPiece.col ? col - 1 : col + 1;
        newBoard[row][rookCol] = '';
        newBoard[row][newRookCol] = turn === 'white' ? 'R' : 'r';
      }

      const updatedCastlingState = { ...castlingState };
      if (selectedPiece.piece === 'K') updatedCastlingState.whiteKingMoved = true;
      if (selectedPiece.piece === 'k') updatedCastlingState.blackKingMoved = true;
      if (selectedPiece.piece === 'R' && selectedPiece.row === 7) {
        if (selectedPiece.col === 0) updatedCastlingState.whiteRookMoved.queenside = true;
        if (selectedPiece.col === 7) updatedCastlingState.whiteRookMoved.kingside = true;
      }
      if (selectedPiece.piece === 'r' && selectedPiece.row === 0) {
        if (selectedPiece.col === 0) updatedCastlingState.blackRookMoved.queenside = true;
        if (selectedPiece.col === 7) updatedCastlingState.blackRookMoved.kingside = true;
      }
  
      // En passant capture
      if (selectedPiece.piece.toLowerCase() === 'p' && Math.abs(col - selectedPiece.col) === 1 && board[row][col] === '') {
        const captureRow = turn === 'white' ? row + 1 : row - 1;
        newBoard[captureRow][col] = '';
      }

      setCastlingState(updatedCastlingState);
      setBoard(newBoard);
      setSelectedPiece(null);
      setTurn(turn === 'white' ? 'black' : 'white');
      setLastMove({ piece: selectedPiece.piece, startRow: selectedPiece.row, startCol: selectedPiece.col, endRow: row, endCol: col });

      // Notation Logic
      const moveNotation = getChessNotation(selectedPiece.piece, selectedPiece.row, selectedPiece.col, row, col);
      setMoveHistory((prevHistory) => [...prevHistory, moveNotation]);

      // Check if the opponent's king is in check
      const opponentTurn = turn === 'white' ? 'black' : 'white';
      const opponentInCheck = isKingInCheck(newBoard, opponentTurn);
      setKingInCheck(opponentInCheck ? opponentTurn : null);

      // Checkmate logic
      if (opponentInCheck && isCheckmate(newBoard, opponentTurn, castlingState, lastMove)) {
        setCheckmate({ winner: turn, loser: opponentTurn });
        return; // Stop further moves if game ends in checkmate
      }

      // Stalemate Logic
      if (isStalemate(newBoard, opponentTurn, castlingState, lastMove)) {
        setStalemate(true);
      }
    }
  };
  

  return (
    <div className="board-wrapper">
      <div className="controls">
        <button onClick={resetBoard}>Reset Board</button>
        <button onClick={handleFlipBoard}>Flip Board</button>
      </div>
      <div className="board-container">
        <Board
          board={flip ? board.slice().reverse().map((row) => row.slice().reverse()) : board}
          onPieceClick={handlePieceClick}
          selectedPiece={selectedPiece}
          kingInCheck={kingInCheck}
          checkmate={checkmate}
          isFlipped={flip}
          stalemate={stalemate}
        />
        <div className="notation-table">
          <div className="notation-table--title"><h3>Notation</h3></div>
          <div className="scrollable-table">
            <table>
              <thead>
                <tr>
                  <th>Turn</th>
                  <th>White</th>
                  <th>Black</th>
                </tr>
              </thead>
              <tbody>
                {moveHistory.map((_, index) => {
                  if (index % 2 === 0) {
                    const whiteMove = moveHistory[index] || '';
                    const blackMove = moveHistory[index + 1] || '';
                    return (
                      <tr key={index / 2}>
                        <td>{Math.floor(index / 2) + 1}</td>
                        <td>{whiteMove}</td>
                        <td>{blackMove}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {promotion && <PromotionModal onSelect={handlePromotion} />}
    </div>
  );
  
};

export default App;
