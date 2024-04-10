import React, { FunctionComponent, useEffect, useState } from "react";
import { GameHeader } from "./gameHeader.tsx";
import { Gameboard } from "./gameboard.tsx";
import { GameStatus } from "./utils.ts";

export const Layout: FunctionComponent = () => {
    const [gameStatus, setGameStatus] = useState(GameStatus.PAUSE);
    const [numPoints, setNumPoints] = useState(0);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === ' ') {
                if (gameStatus === GameStatus.OVER) {
                    setNumPoints(0);
                }
                setGameStatus(gameStatus === GameStatus.PLAY ? GameStatus.PAUSE : GameStatus.PLAY);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return (() => {
            document.removeEventListener('keydown', handleKeyDown);
        });
    },);

    return (
        <div>
            <GameHeader gameStatus={gameStatus} />
            <Gameboard gameStatus={gameStatus}
                gameplayCallbacks={{
                    gameOverCallback: () => setGameStatus(GameStatus.OVER),
                    pointScoredCallback: () => { setNumPoints(numPoints + 1) },
                    gameStartCallback: () => { setNumPoints(0) }
                }}
            />
            <div>Points: {numPoints}</div>
        </div>
    );
}


