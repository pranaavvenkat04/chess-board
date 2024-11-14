const isOpponentPiece = (board, row, col, turn) => {
    const piece = board[row][col];
    return piece && ((turn === 'white' && piece === piece.toLowerCase()) || (turn === 'black' && piece === piece.toUpperCase()));
  };
  
  export const isValidMove = (board, selectedPiece, destRow, destCol) => {
    const { piece, row, col } = selectedPiece;
    const turn = piece === piece.toUpperCase() ? 'white' : 'black';
  
    // Validate moves based on piece type
    switch (piece.toLowerCase()) {
      case 'p':
        return isValidPawnMove(board, row, col, destRow, destCol, turn);
      case 'r':
        return isValidRookMove(board, row, col, destRow, destCol);
      case 'n':
        return isValidKnightMove(row, col, destRow, destCol);
      case 'b':
        return isValidBishopMove(board, row, col, destRow, destCol);
      case 'q':
        return isValidQueenMove(board, row, col, destRow, destCol);
      case 'k':
        return isValidKingMove(row, col, destRow, destCol);
      default:
        return false;
    }
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
