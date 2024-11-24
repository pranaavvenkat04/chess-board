const isOpponentPiece = (board, row, col, turn) => {
    const piece = board[row][col];
    return piece && ((turn === 'white' && piece === piece.toLowerCase()) || (turn === 'black' && piece === piece.toUpperCase()));
  };
  
  export const isValidMove = (board, selectedPiece, destRow, destCol) => {
    const { piece, row, col } = selectedPiece;
    const turn = piece === piece.toUpperCase() ? 'white' : 'black';
  
    // Validate based on piece type
    let valid = false;
    switch (piece.toLowerCase()) {
      case 'p':
        valid = isValidPawnMove(board, row, col, destRow, destCol, turn);
        break;
      case 'r':
        valid = isValidRookMove(board, row, col, destRow, destCol);
        break;
      case 'n':
        valid = isValidKnightMove(row, col, destRow, destCol);
        break;
      case 'b':
        valid = isValidBishopMove(board, row, col, destRow, destCol);
        break;
      case 'q':
        valid = isValidQueenMove(board, row, col, destRow, destCol);
        break;
      case 'k':
        valid = isValidKingMove(row, col, destRow, destCol);
        break;
      default:
        return false;
    }
  
    if (!valid) return false;
  
    // Simulate the move and check if it leaves the king in check
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = ''; // Remove the piece from the original position
    newBoard[destRow][destCol] = piece; // Place the piece in the new position
  
    return !isKingInCheck(newBoard, turn);
  };

  export const isKingInCheck = (board, turn) => {
    const king = turn === 'white' ? 'K' : 'k';
    let kingPosition = null;
  
    // Locate the king
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === king) {
          kingPosition = { row, col };
          break;
        }
      }
    }
  
    if (!kingPosition) {
      console.error("King not found for turn:", turn);
      return false; // Safety check if king is not found (shouldn't happen in a valid game)
    }
    console.log("King position:", kingPosition);
  
    // Check if any opponent piece can attack the king
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && ((turn === 'white' && piece === piece.toLowerCase()) || (turn === 'black' && piece === piece.toUpperCase()))) {
          console.log("Checking opponent piece:", { piece, row, col });
          if (isValidMove(board, { piece, row, col }, kingPosition.row, kingPosition.col)) {
            console.log(`King is under attack by ${piece} at (${row}, ${col})`);
            return true; // King is under attack
          }
        }
      }
    }
  
    return false; // King is safe
  };

  
  export const isCheckmate = (board, turn) => {
    if (!isKingInCheck(board, turn)) return false; // Not check, the king is safe
  
    // Check all possible moves for the current player
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
          for (let destRow = 0; destRow < board.length; destRow++) {
            for (let destCol = 0; destCol < board[destRow].length; destCol++) {
              if (isValidMove(board, { piece, row, col }, destRow, destCol)) {
                return false; // Found a move that gets out of check
              }
            }
          }
        }
      }
    }
  
    return true; // No valid moves left, checkmate
  };

  
  // Sample validation for a pawn
  const isValidPawnMove = (board, row, col, destRow, destCol, turn) => {
    const direction = turn === 'white' ? -1 : 1; // White pawns move up, black pawns move down
    const startRow = turn === 'white' ? 6 : 1;
    
    if (col === destCol) {
      // Regular move forward
      if (destRow === row + direction && !board[destRow][destCol]) return true;
      // Move forward two squares from starting position
      if (row === startRow && destRow === row + 2 * direction && !board[row + direction][col] && !board[destRow][destCol]) return true;
    } else if (Math.abs(col - destCol) === 1 && destRow === row + direction) {
      // Capture diagonally
      return isOpponentPiece(board, destRow, destCol, turn);
    }
    return false;
  };
  
  // Additional validation functions for each piece type...
  
  // Example for a knight move
  const isValidKnightMove = (row, col, destRow, destCol) => {
    const rowDiff = Math.abs(row - destRow);
    const colDiff = Math.abs(col - destCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };
  
  const isValidRookMove = (board, row, col, destRow, destCol) => {
    if (row !== destRow && col !== destCol) return false;
  
    const rowStep = destRow === row ? 0 : (destRow > row ? 1 : -1);
    const colStep = destCol === col ? 0 : (destCol > col ? 1 : -1);
  
    for (let i = row + rowStep, j = col + colStep; i !== destRow || j !== destCol; i += rowStep, j += colStep) {
      if (board[i][j]) return false; // Path blocked
    }
    return true;
  };

  const isValidBishopMove = (board, row, col, destRow, destCol) => {
    if (Math.abs(row - destRow) !== Math.abs(col - destCol)) return false;
  
    const rowStep = destRow > row ? 1 : -1;
    const colStep = destCol > col ? 1 : -1;
  
    for (let i = row + rowStep, j = col + colStep; i !== destRow; i += rowStep, j += colStep) {
      if (board[i][j]) return false; // Path blocked
    }
    return true;
  };

  const isValidQueenMove = (board, row, col, destRow, destCol) => {
    // Queen moves like a rook or a bishop
    return isValidRookMove(board, row, col, destRow, destCol) || isValidBishopMove(board, row, col, destRow, destCol);
  };
  
  const isValidKingMove = (row, col, destRow, destCol) => {
    const rowDiff = Math.abs(row - destRow);
    const colDiff = Math.abs(col - destCol);
    return rowDiff <= 1 && colDiff <= 1;
  };
