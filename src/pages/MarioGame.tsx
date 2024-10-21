import React, { useRef, useEffect } from "react";
import marioImg from "../img/mario.gif";
import pipeImg from "../img/pipe.png";
import cloudsImg from "../img/clouds.png";
import gameOverImg from "../img/game-over.png";
import audioTheme from "../audio/audio_theme.mp3";
import audioGameOver from "../audio/audio_gameover.mp3";
import "./styles.css";

const MarioGame: React.FC = () => {
  const marioRef = useRef<HTMLImageElement | null>(null);
  const pipeRef = useRef<HTMLImageElement | null>(null);
  const gameOverRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  const audioStart = new Audio(audioTheme);
  const audioGameOverInstance = new Audio(audioGameOver);

  const startGame = () => {
    if (pipeRef.current) {
      pipeRef.current.classList.add("pipe-animation");
    }
    if (startButtonRef.current) {
      startButtonRef.current.style.display = "none";
    }
    audioStart.play();
  };

  const restartGame = () => {
    if (gameOverRef.current) {
      gameOverRef.current.style.display = "none";
    }
    if (pipeRef.current) {
      pipeRef.current.style.left = "";
      pipeRef.current.style.right = "0";
    }
    if (marioRef.current) {
      marioRef.current.src = marioImg;
      marioRef.current.style.width = "150px";
      marioRef.current.style.bottom = "0";
    }
    if (startButtonRef.current) {
      startButtonRef.current.style.display = "block";
    }

    audioGameOverInstance.pause();
    audioGameOverInstance.currentTime = 0;

    audioStart.play();
    audioStart.currentTime = 0;
  };

  const jump = () => {
    if (marioRef.current) {
      marioRef.current.classList.add("jump");
      setTimeout(() => {
        if (marioRef.current) {
          marioRef.current.classList.remove("jump");
        }
      }, 800);
    }
  };

  useEffect(() => {
    const loop = setInterval(() => {
      if (pipeRef.current && marioRef.current && gameOverRef.current) {
        const pipePosition = pipeRef.current.offsetLeft;
        const marioPosition = window
          .getComputedStyle(marioRef.current)
          .bottom.replace("px", "");

        if (
          pipePosition <= 120 &&
          pipePosition > 0 &&
          parseInt(marioPosition) < 80
        ) {
          pipeRef.current.classList.remove("pipe-animation");
          pipeRef.current.style.left = `${pipePosition}px`;

          marioRef.current.classList.remove("jump");
          marioRef.current.src = gameOverImg;
          marioRef.current.style.width = "80px";
          marioRef.current.style.marginLeft = "50px";

          audioStart.pause();
          audioGameOverInstance.play();

          setTimeout(() => {
            audioGameOverInstance.pause();
          }, 7000);

          gameOverRef.current.style.display = "flex";

          clearInterval(loop);
        }
      }
    }, 10);

    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        jump();
      }
      if (e.key === "Enter") {
        startGame();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length) {
        jump();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <div className="game">
      <img ref={marioRef} className="mario" src={marioImg} alt="Mario" />
      <img ref={pipeRef} className="pipe" src={pipeImg} alt="Cano" />
      <img className="clouds" src={cloudsImg} alt="Nuvem" />
      <button ref={startButtonRef} className="start" onClick={startGame}>
        Iniciar
      </button>
      <div ref={gameOverRef} className="game-over">
        <h1>Game Over :(</h1>
        <button onClick={restartGame}>Reiniciar</button>
      </div>
    </div>
  );
};

export default MarioGame;
