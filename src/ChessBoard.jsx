import { Box, IconButton, Stack, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import whitePawn from "./assets/images/chesspieces/pw.png";
import whiteBishop from "./assets/images/chesspieces/bw.png";
import whiteKnight from "./assets/images/chesspieces/nw.png"
import whiteRook from "./assets/images/chesspieces/rw.png";
import whiteQueen from "./assets/images/chesspieces/qw.png";
import whiteKing from "./assets/images/chesspieces/kw.png";
import blackPawn from "./assets/images/chesspieces/pb.png";
import blackBishop from "./assets/images/chesspieces/bb.png";
import blackKnight from "./assets/images/chesspieces/nb.png";
import blackRook from "./assets/images/chesspieces/rb.png";
import blackQueen from "./assets/images/chesspieces/qb.png";
import blackKing from "./assets/images/chesspieces/kb.png";
import moveAudio from "./assets/sounds/move.mp3";
import captureAudio from "./assets/sounds/capture.mp3";
import checkAudio from "./assets/sounds/check.mp3";
import castleAudio from "./assets/sounds/castle.mp3";
import promoteAudio from "./assets/sounds/promote.mp3";
import tenSecondsAudio from "./assets/sounds/tenseconds.mp3";
import React from "react";

const moveSoundEffect = new Audio(moveAudio);
const captureSoundEffect = new Audio(captureAudio);
const castleSoundEffect = new Audio(castleAudio);
const checkSoundEffect = new Audio(checkAudio);
const promoteSoundEffect = new Audio(promoteAudio);
const tenSecondsSoundEffect = new Audio(tenSecondsAudio);

function Timer({ turn, timerFor, mode, promotingSquare, setMode }) {
  const [seconds, setSeconds] = React.useState(600);
  let color = seconds <= 10 ? "red" : "white";
  React.useEffect(() => { // useEffect for timer
    if ((promotingSquare ? turn !== timerFor : turn === timerFor) && mode === 1) {
      const chessTimer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(chessTimer);
    }
  // eslint-disable-next-line
  }, [turn, mode, promotingSquare]);
  React.useEffect(() => {if (mode === 1) setSeconds(600)}, [mode]); // Resets timer on new game
  function formatTime(time) { // Formats time to minutes:seconds
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  if (seconds === 10) tenSecondsSoundEffect.play();
  else if (seconds === 0) setMode(2);

  return (
    <Box border="solid" borderColor={color} borderRadius={1} padding={1}>
      <Typography color={color} fontSize={20} fontWeight="bold">
        {formatTime(seconds)}
      </Typography>
    </Box>
  )
}

function SideBar({ mode, turn, pointsWhite, pointsBlack, promotingSquare, setMode }) {
  return (
    <Stack bgcolor="#4B4847" justifyContent="space-between" padding={2}>
      <Stack>
        <Typography color="white" fontSize={20}
          sx={{
            userSelect: "none"
          }}
        >
          {pointsBlack > pointsWhite ? `+${pointsBlack - pointsWhite}` : null}
        </Typography>
        <Timer turn={turn} timerFor={1} mode={mode} promotingSquare={promotingSquare} setMode={setMode} />
      </Stack>
      <Stack>
        <Timer turn={turn} timerFor={-1} mode={mode} promotingSquare={promotingSquare} setMode={setMode} />
        <Typography color="white" fontSize={20}
          sx={{
            userSelect: "none"
          }}
        >
          {pointsWhite > pointsBlack ? `+${pointsWhite - pointsBlack}` : null}
        </Typography>
      </Stack>
    </Stack>
  )
}

function ChessSquare({ x, y, piece, selected, destinated, clickSquare }) {
  const shaded = (x + y) % 2 === 0;
  let src;
  let bgcolor;
  switch (piece) {
    case 'pw':
      src = whitePawn;
      break;
    case 'bw':
      src = whiteBishop;
      break;
    case 'nw':
      src = whiteKnight;
      break;
    case 'rw':
      src = whiteRook;
      break;
    case 'qw':
      src = whiteQueen;
      break;
    case 'kw':
      src = whiteKing;
      break;
    case 'pb':
      src = blackPawn;
      break;
    case 'nb':
      src = blackKnight;
      break;
    case 'bb':
      src = blackBishop;
      break;
    case 'rb':
      src = blackRook;
      break;
    case 'qb':
      src = blackQueen;
      break;
    case 'kb':
      src = blackKing;
      break;
    default:
      src = null;
  }
  if (shaded) bgcolor = "#b58863";
  else bgcolor = "#f0d9B5";
  if (selected) bgcolor = "#ffff77";

  return (
    <div onClick={() => clickSquare(x, y, selected, destinated)}>
      <Stack
        width={64}
        height={64}
        bgcolor={bgcolor}
        justifyContent="center"
        position="relative"
        padding={0.2}
      >
        <Typography fontWeight="bold"
          sx={{
            position: "absolute",
            top: 0, left: 3,
            userSelect: "none"
          }}
        >
          {x === 0 ? y + 1 : null}
        </Typography>
        { src && 
          <Stack
            sx={{
              mr: 0.5,
              justifyContent: "center", alignItems: "center",
              userSelect: "none"
            }}
          >
            <img src={src} alt="Chess piece" />
          </Stack>
        }
        {destinated && !piece && <CircleIcon sx={{opacity: 0.2, alignSelf: "center"}} />}
        {destinated && piece && <CircleOutlinedIcon sx={{fontSize: 72, opacity: 0.2, alignSelf: "center",  position: "absolute"}} />}
        <Typography fontWeight="bold"
          sx={{
            position: "absolute",
            bottom: 0, right: 2,
            userSelect: "none"
          }}
        >
          {y === 0 ? String.fromCharCode(x + 97) : null}
        </Typography>
      </Stack>
    </div>
  )
}

function ChessColumn({ xAxis, pieces, selectedY, destinationY = [], clickSquare }) {
  return (
    <Stack direction="column-reverse">
      {Array.from(Array(8).keys()).map(y => <ChessSquare x={xAxis} y={y} piece={pieces[y]} selected={selectedY === y} destinated={destinationY.includes(y)} clickSquare={clickSquare} />)}
    </Stack>
  )
}

export default function ChessBoard({ mode, setMode }) {
  const initialBoard = [
    ['rw', 'pw', null, null, null, null, 'pb', 'rb'],
    ['nw', 'pw', null, null, null, null, 'pb', 'nb'],
    ['bw', 'pw', null, null, null, null, 'pb', 'bb'],
    ['qw', 'pw', null, null, null, null, 'pb', 'qb'],
    ['kw', 'pw', null, null, null, null, 'pb', 'kb'],
    ['bw', 'pw', null, null, null, null, 'pb', 'bb'],
    ['nw', 'pw', null, null, null, null, 'pb', 'nb'],
    ['rw', 'pw', null, null, null, null, 'pb', 'rb']
  ];
  const [board, setBoard] = React.useState(initialBoard);
  const [turn, setTurn] = React.useState(-1); // -1: White's turn || 1: Black's turn
  const [pointsWhite, setPointsWhite] = React.useState(0);
  const [pointsBlack, setPointsBlack] = React.useState(0);
  const [selectedSquare, setSelectedSquare] = React.useState(null);
  const [destinationSquares, setDestinationSquares] = React.useState(null);
  const [castleStateWhite, setCastleStateWhite] = React.useState(0); // 0: Can castle both sides || -1: Can only castle left side || 1: Can only castle right side || 2: Cannot castle
  const [castleStateBlack, setCastleStateBlack] = React.useState(0);
  const [promotingSquare, setPromotingSquare] = React.useState(null);
  const [enPassantSquare, setEnpassantSquare] = React.useState(null);
  const color = turn === 1 ? 'b' : 'w';
  const opposingColor = turn === -1 ? 'b' : 'w';
  React.useEffect(() => {
    if (mode === 1) { // if a new game starts
      setBoard(initialBoard);
      setTurn(-1);
      setPointsWhite(0);
      setPointsBlack(0);
      setCastleStateWhite(0);
      setCastleStateBlack(0);
    }
    else if (mode === 2) { // if the game ends
      setSelectedSquare(null);
      setDestinationSquares(null);
      setPromotingSquare(null);
    }
  // eslint-disable-next-line
  }, [mode]);
  function addPoint(pieceTaken, opposite = false, customPoint) {
    const condition = opposite ? turn === -1 : turn === 1;
    switch (pieceTaken[0]) {
      case 'p': // If pawn is taken...
        if (condition) setPointsBlack(pointsBlack + 1);
        else setPointsWhite(pointsWhite + 1)
        break;
      case 'b': // If bishop or knight is taken...
      case 'n':
        if (condition) setPointsBlack(pointsBlack + 3);
        else setPointsWhite(pointsWhite + 3);
        break;
      case 'r': // If rook is taken...
        if (condition) setPointsBlack(pointsBlack + 5);
        else setPointsWhite(pointsWhite + 5);
        break;
      case 'q': // If queen is taken...
        if (condition) setPointsBlack(pointsBlack + 9);
        else setPointsWhite(pointsWhite + 9);
        break;
      default:
        if (condition) setPointsBlack(pointsBlack + customPoint);
        else setPointsWhite(pointsWhite + customPoint);
    }
  }
  function spacesLen(x, y, direction) {
    /*
    Directions:
    0 = up, 1 = right, 2 = down, 3 = left,
    4 = topLeft, 5 = topRight, 6 = bottomRight, 7 = bottomLeft
    */
    switch (direction) {
      case 0: return 7 - y;
      case 1: return 7 - x;
      case 2: return y;
      case 3: return x;
      case 4: return Math.min(7 - y, x);
      case 5: return Math.min(7 - y, 7 - x);
      case 6: return Math.min(y, 7 - x);
      case 7: return Math.min(y, x);
      default: throw new Error("Invalid direction!");
    }
  }
  function PromotionCard() {
    function promote(promotionPiece) {
      let updatedBoard = board.map(row => [...row]);
      updatedBoard[promotingSquare[0]][promotingSquare[1]] = `${promotionPiece}${opposingColor}`;
      setBoard(updatedBoard);
      setPromotingSquare(null);
      promoteSoundEffect.play();
      switch (promotionPiece) {
        case 'q':
          addPoint(0, true, 8);
          break;
        case 'r':
          addPoint(0, true, 4);
          break;
        case 'n':
        case 'b':
          addPoint(0, true, 2);
          break;
        default: throw new Error("Invalid promotionPiece!");
      }
    }
    function promotionsrc(piece) {
      switch (piece) {
        case 'q':
          return turn === 1 ? whiteQueen : blackQueen;
        case 'r':
          return turn === 1 ? whiteRook : blackRook;
        case 'n':
          return turn === 1 ? whiteKnight : blackKnight;
        case 'b':
          return turn === 1 ? whiteBishop : blackBishop;
        default: throw new Error("Invalid piece!");
      }
    }

    return (
      <Stack
        border={"solid"}
        padding={1}
        spacing={2}
        sx={{
          backgroundImage: "linear-gradient(white, grey)"
        }}
      >
        <Typography fontSize={16} fontWeight="bold"
          sx={{
            userSelect: "none"
          }}
        >
          Promote to..
        </Typography>
        <IconButton onClick={() => promote('q')} disableRipple>
          <img src={promotionsrc('q')} alt={color ? "Black Queen" : "White Queen"} />
        </IconButton>
        -
        <IconButton onClick={() => promote('r')} disableRipple>
          <img src={promotionsrc('r')} alt={color ? "Black Rook" : "White Rook"} />
        </IconButton>
        -
        <IconButton onClick={() => promote('n')} disableRipple>
          <img src={promotionsrc('n')} alt={color ? "Black Knight" : "White Knight"} />
        </IconButton>
        -
        <IconButton onClick={() => promote('b')} disableRipple>
          <img src={promotionsrc('b')} alt={color ? "Black Bishop" : "White Bishop"} />
        </IconButton>
      </Stack>
    )
  }
  function clickSquare(x, y, selected, destinated) { // function when a square is clicked
  // Checks if move is within bounds
  const withinBounds = (x, y) => x >= 0 && x <= 7 && y >= 0 && y <= 7
  // Fundamentally canMove but does not consider king in check conditions
  const canPotentialMove = (toX, toY) => withinBounds(toX, toY) && board[toX][toY]?.[1] !== color;
  function canMove(toX, toY) {
    if (!canPotentialMove(toX, toY)) return false;
    // Now check if king is in check
    let tempBoard = board.map(row => [...row]);
    tempBoard[toX][toY] = tempBoard[x][y];
    tempBoard[x][y] = null;
    return !kingInCheck(tempBoard);
  }
  // In the current board state, can the piece, at position (x,y) make any of its potential moves, without leaving the king in check
  function pieceCanMove(x, y, board) {
  }
  function checkmated(board, color) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        // If there is no piece, or if this piece is the opposing color, ignore and CONTINUE the loops
        if (!piece || piece[1] !== color) continue
        // Otherwise, this is one of our pieces, we want to see if it can move to any of its potential moves without leaving the king in check
        // As soon as we find one move that leaves the king NOT IN CHECK, we can return false (not checkmated)
        if (pieceCanMove(i, j, board)) return false
      }
    }
    
    return true // If we exit the loop, that means we did not RETURN FALSE, which means we did not find a single move we can make without leaving the king in check, so we have been checkmated.
  }
  function kingInCheck(board, opposing = false) {
    let kingX, kingY;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === `k${opposing ? opposingColor : color}`) {
          kingX = i;
          kingY = j;
        }
      }
    }
    const usedColor = opposing ? color : opposingColor;
    /* 
    We want to test if any opposing pieces are able to capture the king in the current board state.
    The king is in check if:
    - It is able to move to a square (x,y), and
    - An opposing piece is in (x,y) and is in range to capture the king
    */
    const kicTurn = opposing ? -turn : turn;
    // Pawn
    if ((canPotentialMove(kingX-1, kingY-kicTurn) && board[kingX-1][kingY-kicTurn] === `p${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY-kicTurn) && board[kingX+1][kingY-kicTurn] === `p${usedColor}`)) return true;
    // Knight
    if ((canPotentialMove(kingX-1, kingY+2) && board[kingX-1][kingY+2] === `n${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY+2) && board[kingX+1][kingY+2] === `n${usedColor}`) ||
        (canPotentialMove(kingX+2, kingY+1) && board[kingX+2][kingY+1] === `n${usedColor}`) ||
        (canPotentialMove(kingX+2, kingY-1) && board[kingX+2][kingY-1] === `n${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY-2) && board[kingX+1][kingY-2] === `n${usedColor}`) ||
        (canPotentialMove(kingX-1, kingY-2) && board[kingX-1][kingY-2] === `n${usedColor}`) ||
        (canPotentialMove(kingX-2, kingY-1) && board[kingX-2][kingY-1] === `n${usedColor}`) ||
        (canPotentialMove(kingX-2, kingY+1) && board[kingX-2][kingY+1] === `n${usedColor}`)) return true;
    // King
    if ((canPotentialMove(kingX, kingY+1) && board[kingX][kingY+1] === `k${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY) && board[kingX+1][kingY] === `k${usedColor}`) ||
        (canPotentialMove(kingX, kingY-1) && board[kingX][kingY-1] === `k${usedColor}`) ||
        (canPotentialMove(kingX-1, kingY) && board[kingX-1][kingY] === `k${usedColor}`) ||
        (canPotentialMove(kingX-1, kingY+1) && board[kingX-1][kingY+1] === `k${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY+1) && board[kingX+1][kingY+1] === `k${usedColor}`) ||
        (canPotentialMove(kingX+1, kingY-1) && board[kingX+1][kingY-1] === `k${usedColor}`) ||
        (canPotentialMove(kingX-1, kingY-1) && board[kingX-1][kingY-1] === `k${usedColor}`)) return true;
    // Rook and Queen
    for (let i = 1; i <= spacesLen(kingX, kingY, 0); i++) {
      if (board[kingX][kingY+i] === `r${usedColor}` || board[kingX][kingY+i] === `q${usedColor}`) return true;
      if (board[kingX][kingY+i]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 1); i++) {
      if (board[kingX+i][kingY] === `r${usedColor}` || board[kingX+i][kingY] === `q${usedColor}`) return true;
      if (board[kingX+i][kingY]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 2); i++) {
      if (board[kingX][kingY-i] === `r${usedColor}` || board[kingX][kingY-i] === `q${usedColor}`) return true;
      if (board[kingX][kingY-i]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 3); i++) {
      if (board[kingX-i][kingY] === `r${usedColor}` || board[kingX-i][kingY] === `q${usedColor}`) return true;
      if (board[kingX-i][kingY]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 4); i++) {
      if (board[kingX-i][kingY+i] === `b${usedColor}` || board[kingX-i][kingY+i] === `q${usedColor}`) return true;
      if (board[kingX-i][kingY+i]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 5); i++) {
      if (board[kingX+i][kingY+i] === `b${usedColor}` || board[kingX+i][kingY+i] === `q${usedColor}`) return true;
      if (board[kingX+i][kingY+i]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 6); i++) {
      if (board[kingX+i][kingY-i] === `b${usedColor}` || board[kingX+i][kingY-i] === `q${usedColor}`) return true;
      if (board[kingX+i][kingY-i]) break;
    }
    for (let i = 1; i <= spacesLen(kingX, kingY, 7); i++) {
      if (board[kingX-i][kingY-i] === `b${usedColor}` || board[kingX-i][kingY-i] === `q${usedColor}`) return true;
      if (board[kingX-i][kingY-i]) break;
    }
    return false;
  }
    if (board[x][y]?.[1] === color && !selected && !destinated && !promotingSquare && mode === 1) { // If the clicked square has a piece and is their current turn...
      setSelectedSquare([x, y]);
      let lst = []; // We add possible moves to this array and setDestinationSquares to this at the end
      switch (board[x][y]) {
        // Pawn moves
        case `p${color}`:
          let mod = -turn;
          let startPoint = turn === 1 ? 6 : 1;
          if (!board[x][y+1*mod] && canMove(x, y+1*mod)) lst.push([x, y+1*mod]);
          if (y === startPoint && !board[x][y+2*mod] && canMove(x, y+2*mod)) lst.push([x, y+2*mod]);
          if (canMove(x-1, y+1*mod) && board[x-1][y+1*mod]) lst.push([x-1, y+1*mod]);
          if (canMove(x+1, y+1*mod) && board[x+1][y+1*mod]) lst.push([x+1, y+1*mod]);
          if (canMove(x-1, y+1*mod) && x === enPassantSquare?.[0] + 1 && y === enPassantSquare[1]) lst.push([x-1, y+1*mod]);
          if (canMove(x+1, y+1*mod) && x === enPassantSquare?.[0] - 1 && y === enPassantSquare[1]) lst.push([x+1, y+1*mod]);
          setDestinationSquares(lst);
          break;
        // Bishop moves
        case `b${color}`:
          for (let i = 1; i <= spacesLen(x, y, 4); i++) {
            if (canMove(x-i, y+i)) lst.push([x-i, y+i]); 
            if (board[x-i][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 5); i++) {
            if (canMove(x+i, y+i)) lst.push([x+i, y+i]);
            if (board[x+i][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 6); i++) {
            if (canMove(x+i, y-i)) lst.push([x+i, y-i]);
            if (board[x+i][y-i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 7); i++) {
            if (canMove(x-i, y-i)) lst.push([x-i, y-i]);
            if (board[x-i][y-i]) break;
          }
          setDestinationSquares(lst);
          break;
        // Knight moves
        case `n${color}`:
          if (canMove(x-1, y+2)) lst.push([x-1, y+2]);
          if (canMove(x+1, y+2)) lst.push([x+1, y+2]);
          if (canMove(x+2, y+1)) lst.push([x+2, y+1]);
          if (canMove(x+2, y-1)) lst.push([x+2, y-1]);
          if (canMove(x+1, y-2)) lst.push([x+1, y-2]);
          if (canMove(x-1, y-2)) lst.push([x-1, y-2]);
          if (canMove(x-2, y-1)) lst.push([x-2, y-1]);
          if (canMove(x-2, y+1)) lst.push([x-2, y+1]);
          setDestinationSquares(lst);
          break;
        // Rook moves
        case `r${color}`:
          for (let i = 1; i <= spacesLen(x, y, 0); i++) {
            if (canMove(x, y+i)) lst.push([x, y+i]);
            if (board[x][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 1); i++) {
            if (canMove(x+i, y)) lst.push([x+i, y]);
            if (board[x+i][y]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 2); i++) {
            if (canMove(x, y-i)) lst.push([x, y-i]);
            if (board[x][y-i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 3); i++) {
            if (canMove(x-i, y)) lst.push([x-i, y]);
            if (board[x-i][y]) break;
          }
          setDestinationSquares(lst);
          break;
        // Queen moves
        case `q${color}`:
          for (let i = 1; i <= spacesLen(x, y, 0); i++) {
            if (canMove(x, y+i)) lst.push([x, y+i]);
            if (board[x][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 1); i++) {
            if (canMove(x+i, y)) lst.push([x+i, y]);
            if (board[x+i][y]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 2); i++) {
            if (canMove(x, y-i)) lst.push([x, y-i]);
            if (board[x][y-i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 3); i++) {
            if (canMove(x-i, y)) lst.push([x-i, y]);
            if (board[x-i][y]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 4); i++) {
            if (canMove(x-i, y+i)) lst.push([x-i, y+i]); 
            if (board[x-i][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 5); i++) {
            if (canMove(x+i, y+i)) lst.push([x+i, y+i]);
            if (board[x+i][y+i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 6); i++) {
            if (canMove(x+i, y-i)) lst.push([x+i, y-i]);
            if (board[x+i][y-i]) break;
          }
          for (let i = 1; i <= spacesLen(x, y, 7); i++) {
            if (canMove(x-i, y-i)) lst.push([x-i, y-i]);
            if (board[x-i][y-i]) break;
          }
          setDestinationSquares(lst);
          break;
        // King moves
        case `k${color}`:
          if (canMove(x, y+1)) lst.push([x, y+1]);
          if (canMove(x+1, y)) lst.push([x+1, y]);
          if (canMove(x, y-1)) lst.push([x, y-1]);
          if (canMove(x-1, y)) lst.push([x-1, y]);
          if (canMove(x-1, y+1)) lst.push([x-1, y+1]);
          if (canMove(x+1, y+1)) lst.push([x+1, y+1]);
          if (canMove(x+1, y-1)) lst.push([x+1, y-1]);
          if (canMove(x-1, y-1)) lst.push([x-1, y-1]);
          if (turn === 1) {
            if ((castleStateBlack === 0 || castleStateBlack === -1) && x === 4 && y === 7 && !kingInCheck(board) && canMove(x-1, y) && canMove(x-2, y) && !board[3][7] && !board[2][7] && !board[1][7] && board[0][7] === 'rb') lst.push([x-2,y]);
            if ((castleStateBlack === 0 || castleStateBlack === 1) && x === 4 && y === 7 && !kingInCheck(board) && canMove(x+1, y) && canMove(x+2, y) && !board[5][7] && !board[6][7] && board[7][7]=== 'rb') lst.push([x+2,y]);
          } else {
            if ((castleStateWhite === 0 || castleStateWhite === -1) && x === 4 && y === 0 && !kingInCheck(board) && canMove(x-1, y) && canMove(x-2, y) && !board[3][0] && !board[2][0] && !board[1][0] && board[0][0] === 'rw') lst.push([x-2,y]);
            if ((castleStateWhite === 0 || castleStateWhite === 1) && x === 4 && y === 0 && !kingInCheck(board) && canMove(x+1, y) && canMove(x+2, y) && !board[5][0] && !board[6][0] && board[7][0] === 'rw') lst.push([x+2,y]);
          }
          setDestinationSquares(lst);
          break;
        default:
          throw new Error("Invalid piece!");
      }
    } else if (destinated) { // If the clicked square is destinated...
      let castle = false;
      // Setting states for castling
      if (color === 'w') { // If white's turn...
        if (castleStateWhite === 0) {
          if (selectedSquare[0] === 0 && selectedSquare[1] === 0) setCastleStateWhite(1);
          else if (selectedSquare[0] === 7 && selectedSquare[1] === 0) setCastleStateWhite(-1);
        } else if (castleStateWhite === -1) {
          if (selectedSquare[0] === 0 && selectedSquare[1] === 0) setCastleStateWhite(2);
        } else if (castleStateWhite === 1) {
          if (selectedSquare[0] === 7 && selectedSquare[1] === 0) setCastleStateWhite(2);
        }
        if (selectedSquare[0] === 4 && selectedSquare[1] === 0) setCastleStateWhite(2);
      } else if (color === 'b') { // If black's turn...
        if (castleStateBlack === 0) {
          if (selectedSquare[0] === 0 && selectedSquare[1] === 7) setCastleStateBlack(1);
          else if (selectedSquare[0] === 7 && selectedSquare[1] === 7) setCastleStateBlack(-1);
        } else if (castleStateBlack === -1) {
          if (selectedSquare[0] === 0 && selectedSquare[1] === 7) setCastleStateBlack(2);
        } else if (castleStateBlack === 1) {
          if (selectedSquare[0] === 7 && selectedSquare[1] === 7) setCastleStateBlack(2);
        }
        if (selectedSquare[0] === 4 && selectedSquare[1] === 7) setCastleStateBlack(2);
      }
      // Checks if pawn moved 2 squares forward
      if (board[selectedSquare[0]][selectedSquare[1]] === `p${color}` && (y === selectedSquare[1] + 2 || y === selectedSquare[1] - 2)) setEnpassantSquare([x, y]);
      const updatedBoard = board.map(row => [...row]); // Creates copy of board - changes will be made to this one
      updatedBoard[x][y] = updatedBoard[selectedSquare[0]][selectedSquare[1]];
      updatedBoard[selectedSquare[0]][selectedSquare[1]] = null;
      // Checks for castling
      if (board[selectedSquare[0]][selectedSquare[1]] === `k${color}`) {
        if (x === selectedSquare[0] - 2) {
          updatedBoard[x+1][y] = updatedBoard[0][y];
          updatedBoard[0][y] = null;
          castle = true;
        } else if (x === selectedSquare[0] + 2) {
          updatedBoard[x-1][y] = updatedBoard[0][y];
          updatedBoard[7][y] = null;
          castle = true;
        }
      }
      else if (board[selectedSquare[0]][selectedSquare[1]] === `p${color}` && y === (turn === 1 ? 0 : 7)) setPromotingSquare([x, y]); // Checks for promotion
      else if (board[selectedSquare[0]][selectedSquare[1]] === `p${color}` && !board[x][y] && (x === selectedSquare[0] - 1 || x === selectedSquare[0] + 1)) { // Checks for en passant
        updatedBoard[enPassantSquare[0]][enPassantSquare[1]] = null;
        addPoint('p');
        captureSoundEffect.play();
      } else if (kingInCheck(updatedBoard, true)) {
        const win = checkmated(updatedBoard, opposingColor)
        checkSoundEffect.play(); // Plays checkSoundEffect if opposing team is in check...
        console.log("check: " + color)
        if (win) console.log("checkmate: " + color + " wins!")
      } else if (castle) castleSoundEffect.play(); // Plays castleSoundEffect if move is castling
      else if (!board[x][y]) moveSoundEffect.play(); // Plays moveSoundEffect if destination square has no piece
      if (board[x][y]) { // Adds points and plays captureSoundEffect if destination square has an enemy piece
        addPoint(board[x][y]);
        captureSoundEffect.play();
      }
      // Sets board state to updated board and switches turn
      setBoard(updatedBoard);
      setTurn(-turn);
      // Sets selectedSquares, destinationSquares, enpassantSquare, to null
      setSelectedSquare(null);
      setDestinationSquares(null);
      if (enPassantSquare) {
        setEnpassantSquare(null);
      }
    } else { // Otherwise, if the square is empty or not their turn...
      setSelectedSquare(null);
      setDestinationSquares(null);
    }
  }
  let destinationColumns = [[],[],[],[],[],[],[],[]]; // Destination squares for each column - index is column number
  for (let x = 0; x < 8; x++) for (let coordinate in destinationSquares) if (destinationSquares[coordinate][0] === x) destinationColumns[x].push(destinationSquares[coordinate][1]); // pushes the Y coords of each array to destinationColumns and highlightedColumns in the correct indexes

  return (
    <Stack direction="row">
      {promotingSquare && <PromotionCard />}
      <Stack direction="row" boxShadow={10}>
        {Array.from(Array(8).keys()).map(x => <ChessColumn xAxis={x} pieces={board[x]} selectedY={x === selectedSquare?.[0] ? selectedSquare[1] : null} destinationY={destinationColumns[x]} clickSquare={clickSquare} />)}
      </Stack>
      <SideBar mode={mode} turn={turn} pointsWhite={pointsWhite} pointsBlack={pointsBlack} promotingSquare={promotingSquare} setMode={setMode} />
    </Stack>
  )
}