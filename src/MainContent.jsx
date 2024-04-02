import { Button, Stack, Typography, darken } from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react';
import gameStartAudio from "./assets/sounds/game-start.mp3";
import gameEndAudio from "./assets/sounds/game-end.mp3";
import ChessBoard from "./ChessBoard";

const gameStartSoundEffect = new Audio(gameStartAudio);
const gameEndSoundEffect = new Audio(gameEndAudio);

export default function MainContent() {
  const [mode, setMode] = React.useState(0); // 0 = Initial, 1 = InGame, 2 = EndGame
  const [winAnnouncement, setWinAnnouncement] = React.useState(null);
  const [whiteWins, setWhiteWins] = React.useState(0);
  const [blackWins, setBlackWins] = React.useState(0);
  let buttonText;
  let buttonColor;
  let startButtonIcon;
  let endButtonIcon;
  if (mode === 0) {
    buttonText = "Start new game";
    buttonColor = green[600];
    startButtonIcon = <LocalFireDepartmentIcon />;
  } else if (mode === 1) {
    buttonText = "End game";
    buttonColor = red[600];
    endButtonIcon = <CancelIcon />;
  } else {
    buttonText = "Rematch";
    buttonColor = orange[600];
    endButtonIcon = <RefreshIcon />;
  }
  function clickGameButton() {
    if (mode === 0) setMode(1);
    else if (mode === 1) setMode(2);
    else setMode(1);
  }
  React.useEffect(() => {
    if (mode === 1) {
      gameStartSoundEffect.play();
      setWinAnnouncement(null);
    }
    else if (mode === 2) gameEndSoundEffect.play();
  }, [mode]);
  React.useEffect(() => {
    if (mode === 2) setWinAnnouncement("White wins!");
  // eslint-disable-next-line
  }, [whiteWins]);
  React.useEffect(() => {
    if (mode === 2) setWinAnnouncement("Black wins!");
  // eslint-disable-next-line
  }, [blackWins]);

  return (
    <Stack direction="row" justifyContent="space-between" mx={5}>
      <Button disableRipple disableElevation
        onClick={clickGameButton}
        variant="contained"
        startIcon={startButtonIcon}
        endIcon={endButtonIcon}
        sx={{
          width: 220,
          height: 75,
          fontSize: 20,
          fontWeight: "bold",
          backgroundColor: buttonColor,
          textTransform: "none",
          ":hover": {
            backgroundColor: darken(buttonColor, 0.1)
          }
        }}
      >
        {buttonText}
      </Button>
      <Stack>
        <Stack direction="row" justifyContent="space-around" bgcolor="grey">
          { !winAnnouncement &&
            <Typography color="white" fontSize={24} fontWeight="bold">
              White: {whiteWins}
            </Typography>
          }
          { winAnnouncement &&
            <Typography color="white" fontSize={24} fontWeight="bold">
              {winAnnouncement}
            </Typography>
          }
          { !winAnnouncement &&
            <Typography color="white" fontSize={24} fontWeight="bold">
              Black: {blackWins}
            </Typography>
          }
        </Stack>
        <ChessBoard mode={mode} setMode={setMode} whiteWins={whiteWins} blackWins={blackWins} setWhiteWins={setWhiteWins} setBlackWins={setBlackWins} />
      </Stack>
    </Stack>
  )
}