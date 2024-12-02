const isOpponentPiece = (board, row, col, turn) => {
  const piece = board[row]?.[col];
  return piece && ((turn === 'white' && piece === piece.toLowerCase()) || (turn === 'black' && piece === piece.toUpperCase()));
};

function simulateMove(board, selectedPiece, destRow, destCol) {
  const simulatedBoard = board.map((row) => [...row]);
  const { piece, row, col } = selectedPiece;

  simulatedBoard[row][col] = '';
  simulatedBoard[destRow][destCol] = piece;

  return simulatedBoard;
}

export const isValidMove = (board, selectedPiece, destRow, destCol, lastMove, castlingState) => {
  if (!selectedPiece) return false;
  

  const { piece, row, col } = selectedPiece;
  const turn = piece === piece.toUpperCase() ? 'white' : 'black';
  let valid = false;
 
  const king = turn === 'white' ? 'K' : 'k';
  if (board[destRow][destCol] === king) {
    console.log('Invalid move: cannot move to your own king\'s square');
    return false; 
  }

  switch (piece.toLowerCase()) {
    case 'p':
      valid = isValidPawnMove(board, row, col, destRow, destCol, turn, lastMove);
      break;
    case 'r':
      valid = isValidRookMove(board, row, col, destRow, destCol, turn);
      break;
    case 'n':
      valid = isValidKnightMove(board, row, col, destRow, destCol, turn);
      break;
    case 'b':
      valid = isValidBishopMove(board, row, col, destRow, destCol, turn);
      break;
    case 'q':
      valid = isValidQueenMove(board, row, col, destRow, destCol, turn);
      break;
    case 'k':
      valid = isValidKingMove(board, row, col, destRow, destCol, turn, castlingState);
      break;
    default:
      return false;
  }

  if (!valid) {
    console.log(`Invalid move: ${piece} from (${row}, ${col}) to (${destRow}, ${destCol})`);
    return false;
  }

  return true;
};


export const isKingInCheck = (board, turn) => {
  const king = turn === 'white' ? 'K' : 'k';
  let kingPosition = null;

  // Find the king's position
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row]?.[col] === king) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false;

  // Check if any opponent's piece can attack the king
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row]?.[col];
      if (piece && isOpponentPiece(board, row, col, turn)) {
        // Check if any piece can attack the king
        if (isValidMove(board, { piece, row, col }, kingPosition.row, kingPosition.col, null, null)) {
          return true; // King is in check
        }
      }
    }
  }

  return false; // No check detected
};

export const isCheckmate = (board, turn, castlingState, lastMove) => {
  if (!isKingInCheck(board, turn)) {
    return false; // If the king is not in check, it's not checkmate
  }

  // Check if the player has any valid moves to get out of check
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];

      if ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase())) {
        for (let destRow = 0; destRow < board.length; destRow++) {
          for (let destCol = 0; destCol < board[destRow].length; destCol++) {
            if (isValidMove(board, { piece, row, col }, destRow, destCol, lastMove, castlingState)) {
              // Simulate the move
              const simulatedBoard = simulateMove(board, { piece, row, col }, destRow, destCol);
              
              // If the move removes the check, it's not checkmate
              if (!isKingInCheck(simulatedBoard, turn)) {
                return false; // The move removes the check, so it's not checkmate
              }
            }
          }
        }
      }
    }
  }

  return true; // No valid moves found, it's checkmate
};

export const isStalemate = (board, turn, castlingState, lastMove) => {
  // If the king is in check, it's not a stalemate
  if (isKingInCheck(board, turn)) {
    return false;
  }

  // Check if the player has any valid moves left
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase())) {
        for (let destRow = 0; destRow < board.length; destRow++) {
          for (let destCol = 0; destCol < board[destRow].length; destCol++) {
            if (isValidMove(board, { piece, row, col }, destRow, destCol, lastMove, castlingState)) {
              return false; // Found a valid move, so not stalemate
            }
          }
        }
      }
    }
  }

  return true; // No valid moves left, it's a stalemate
};


export const isValidKingMove = (board, row, col, destRow, destCol, turn, castlingState) => {
  const rowDiff = Math.abs(destRow - row);
  const colDiff = Math.abs(destCol - col);

  if (rowDiff <= 1 && colDiff <= 1) {
    const targetPiece = board[destRow][destCol];
    const piece = turn === 'white' ? 'K' : 'k';
    const simulatedBoard = simulateMove(board, {piece, row, col}, destRow, destCol);
    if ((!targetPiece || isOpponentPiece(board, destRow, destCol, turn)) && (!isKingInCheck(simulatedBoard, turn) && !isKingInCheck(simulatedBoard, turn === 'white' ? 'black' : 'white'))){
      return true;
    }
    else{
      return false;
    }
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
    const piece = turn === 'white' ? 'K' : 'k';
    return (
      !isKingInCheck(simulateMove(board, { piece, row, col }, row, intermediateCol), turn) &&
      !isKingInCheck(simulateMove(board, { piece, row, col }, row, destCol), turn)
    );
    }
  }

  return false;
};

function isValidPawnMove(board, row, col, destRow, destCol, turn, lastMove) {
  const direction = turn === 'white' ? -1 : 1;
  const startRow = turn === 'white' ? 6 : 1;
  let valid = false;
  // Single move forward
  if (destRow === row + direction && destCol === col && board[destRow][destCol] === '') {
    valid = true;
  }

  // Double move forward from starting position
  if (row === startRow && destRow === row + 2 * direction && destCol === col && board[destRow][destCol] === '' && board[row + direction][col] === '') {
    valid = true;
  }

  // Diagonal capture
  if (destRow === row + direction && Math.abs(destCol - col) === 1) {
    // Normal capture
    if (isOpponentPiece(board, destRow, destCol, turn)) {
      valid = true;
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
      valid = true;
    }
  }
  const piece = turn === 'white' ? 'P' : 'p'
  const simulatedBoard = simulateMove(board, {piece, row, col}, destRow, destCol);
  const curr_turn = !isKingInCheck(simulatedBoard, turn);
  const next_turn = !isKingInCheck(simulatedBoard, turn === 'white' ? 'black' : 'white');
  if (valid && ((curr_turn || next_turn) && (curr_turn))){
    return true;
  } else{
    return false;
  }
};



const isValidRookMove = (board, row, col, destRow, destCol, turn) => {
  if (row !== destRow && col !== destCol) return false;

  const rowStep = destRow === row ? 0 : (destRow > row ? 1 : -1);
  const colStep = destCol === col ? 0 : (destCol > col ? 1 : -1);

  for (let i = row + rowStep, j = col + colStep; i !== destRow || j !== destCol; i += rowStep, j += colStep) {
    if (board[i][j]) return false;
  }

  const piece = turn === 'white' ? 'R' : 'r'
  const simulatedBoard = simulateMove(board, {piece, row, col}, destRow, destCol);
  const curr_turn = !isKingInCheck(simulatedBoard, turn);
  const next_turn = !isKingInCheck(simulatedBoard, turn === 'white' ? 'black' : 'white');
  if ((curr_turn || next_turn) || (curr_turn && next_turn)){
    return true;
  } else{
    return false;
  }
};

const isValidKnightMove = (board, row, col, destRow, destCol, turn) => {
  const rowDiff = Math.abs(row - destRow);
  const colDiff = Math.abs(col - destCol);
  const piece = turn === 'white' ? 'N' : 'n'
  const simulatedBoard = simulateMove(board, {piece, row, col}, destRow, destCol);
  const curr_turn = !isKingInCheck(simulatedBoard, turn);
  const next_turn = !isKingInCheck(simulatedBoard, turn === 'white' ? 'black' : 'white');
  if ((curr_turn || next_turn) || (curr_turn && next_turn)){
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  } else{
    return false;
  }
  

};

const isValidBishopMove = (board, row, col, destRow, destCol, turn) => {
  if (Math.abs(row - destRow) !== Math.abs(col - destCol)) return false;

  const rowStep = destRow > row ? 1 : -1;
  const colStep = destCol > col ? 1 : -1;

  for (let i = row + rowStep, j = col + colStep; i !== destRow || j !== destCol; i += rowStep, j += colStep) {
    if (i < 0 || i >= board.length || j < 0 || j >= board[i].length) {
      return false; 
    }
    if (board[i][j]) return false;
  }
  const piece = turn === 'white' ? 'B' : 'b'
  const simulatedBoard = simulateMove(board, {piece, row, col}, destRow, destCol);
  const curr_turn = !isKingInCheck(simulatedBoard, turn);
  const next_turn = !isKingInCheck(simulatedBoard, turn === 'white' ? 'black' : 'white');
  if ((curr_turn || next_turn) || (curr_turn && next_turn)){
    return true;
  } else{
    return false;
  }
  
};

const isValidQueenMove = (board, row, col, destRow, destCol, turn) => {
  return isValidRookMove(board, row, col, destRow, destCol, turn) || isValidBishopMove(board, row, col, destRow, destCol, turn);
};
