const isOpponentPiece = (board, row, col, turn) => {
  const piece = board[row]?.[col];
  return piece && ((turn === 'white' && piece === piece.toLowerCase()) || (turn === 'black' && piece === piece.toUpperCase()));
};


export const isValidMove = (board, selectedPiece, destRow, destCol, lastMove, castlingState) => {
  if (!selectedPiece) return false;

  const { piece, row, col } = selectedPiece;
  const turn = piece === piece.toUpperCase() ? 'white' : 'black';
  let valid = false;

  switch (piece.toLowerCase()) {
    case 'p':
      valid = isValidPawnMove(board, row, col, destRow, destCol, turn, lastMove);
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
      valid = isValidKingMove(board, row, col, destRow, destCol, turn, castlingState);
      break;
    default:
      return false;
  }

  if (!valid) return false;

  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = '';
  newBoard[destRow][destCol] = piece;

  return !isKingInCheck(newBoard, turn);
};
export const isKingInCheck = (board, turn) => {
  const king = turn === 'white' ? 'K' : 'k';
  let kingPosition = null;

  // Locate the king
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row]?.[col] === king) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break; // exit outer loop when king is found
  }

  if (!kingPosition) return false; // Safety check, king must exist

  // Check if any opponent piece can attack the king
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row]?.[col];
      if (piece && isOpponentPiece(board, row, col, turn)) {
        if (isValidMove(board, { piece, row, col }, kingPosition.row, kingPosition.col, null)) {
          return true;
        }
      }
    }
  }

  return false;
};




export const isCheckmate = (board, turn) => {
  if (!isKingInCheck(board, turn)) return false;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
        for (let destRow = 0; destRow < board.length; destRow++) {
          for (let destCol = 0; destCol < board[destRow].length; destCol++) {
            if (isValidMove(board, { piece, row, col }, destRow, destCol, null)) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
};

function simulateMove(board, selectedPiece, destRow, destCol) {
  // Deep copy the board to avoid modifying the original
  const simulatedBoard = board.map(row => row.slice());

  // Get the current position of the selected piece
  const { row, col } = selectedPiece;

  // Move the piece to the new position
  simulatedBoard[destRow][destCol] = simulatedBoard[row][col];
  simulatedBoard[row][col] = null; // Remove the piece from its original position

  return simulatedBoard;
}

export const isValidKingMove = (board, row, col, destRow, destCol, turn, castlingState) => {
  const rowDiff = Math.abs(destRow - row);
  const colDiff = Math.abs(destCol - col);

  if (rowDiff <= 1 && colDiff <= 1) {
    const targetPiece = board[destRow][destCol];
    return !targetPiece || isOpponentPiece(board, destRow, destCol, turn);
  }

  if (rowDiff === 0 && Math.abs(destCol - col) === 2) {
    const isKingside = destCol > col;
    const rookCol = isKingside ? 7 : 0;
    const isWhite = turn === 'white';
    
    if (castlingState){
      const kingMoved = isWhite ? castlingState.whiteKingMoved : castlingState.blackKingMoved;
      const rookMoved = isWhite ? castlingState.whiteRookMoved : castlingState.blackRookMoved;
    

    

    if (kingMoved || rookMoved[isKingside ? 'kingside' : 'queenside']) return false;

    const step = isKingside ? 1 : -1;
    for (let c = col + step; c !== rookCol; c += step) {
      if (board[row][c]) return false;
    }

    const intermediateCol = col + step;
    return (
      !isKingInCheck(simulateMove(board, { row, col }, row, intermediateCol), turn) &&
      !isKingInCheck(simulateMove(board, { row, col }, row, destCol), turn)
    );
    }
  }

  return false;
};

function isValidPawnMove(board, row, col, destRow, destCol, turn, lastMove) {
  const direction = turn === 'white' ? -1 : 1;
  const startRow = turn === 'white' ? 6 : 1;

  // Single move forward
  if (destRow === row + direction && destCol === col && board[destRow][destCol] === '') {
    return true;
  }

  // Double move forward from starting position
  if (row === startRow && destRow === row + 2 * direction && destCol === col && board[destRow][destCol] === '' && board[row + direction][col] === '') {
    return true;
  }

  // Diagonal capture
  if (destRow === row + direction && Math.abs(destCol - col) === 1) {
    // Normal capture
    if (isOpponentPiece(board, destRow, destCol, turn)) {
      return true;
    }

    // En passant
    if (
      lastMove &&
      lastMove.piece.toLowerCase() === 'p' && // Last moved piece was a pawn
      Math.abs(lastMove.startRow - lastMove.endRow) === 2 && // Moved two squares
      lastMove.endRow === row && // The opponent's pawn is on the same row
      lastMove.endCol === destCol && // The opponent's pawn is adjacent
      board[lastMove.endRow][lastMove.endCol] // Ensure the opponent's pawn still exists
    ) {
      return true;
    }
  }

  return false;
};



const isValidRookMove = (board, row, col, destRow, destCol) => {
  if (row !== destRow && col !== destCol) return false;

  const rowStep = destRow === row ? 0 : (destRow > row ? 1 : -1);
  const colStep = destCol === col ? 0 : (destCol > col ? 1 : -1);

  for (let i = row + rowStep, j = col + colStep; i !== destRow || j !== destCol; i += rowStep, j += colStep) {
    if (board[i][j]) return false;
  }
  return true;
};

const isValidKnightMove = (row, col, destRow, destCol) => {
  const rowDiff = Math.abs(row - destRow);
  const colDiff = Math.abs(col - destCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

const isValidBishopMove = (board, row, col, destRow, destCol) => {
  if (Math.abs(row - destRow) !== Math.abs(col - destCol)) return false;

  const rowStep = destRow > row ? 1 : -1;
  const colStep = destCol > col ? 1 : -1;

  for (let i = row + rowStep, j = col + colStep; i !== destRow || j !== destCol; i += rowStep, j += colStep) {
    if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) {
      return false;  // Don't continue checking if out of bounds
    }
    if (board[i][j]) return false;
  }
  return true;
};

const isValidQueenMove = (board, row, col, destRow, destCol) => {
  return isValidRookMove(board, row, col, destRow, destCol) || isValidBishopMove(board, row, col, destRow, destCol);
};
