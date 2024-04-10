import React from "react"
import { FunctionComponent } from "react"
import { GameStatus } from "./utils.ts"

interface Props {
    gameStatus: GameStatus
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
  }

const headerText = (gameStatus: number): string => {
    switch (gameStatus) {
        case GameStatus.PAUSE:
            return "Press space to start"
        case GameStatus.PLAY:
            return "Press space to pause"
        case GameStatus.OVER:
            return "Oh darn, it seems you've lost, press space to start new game"
        default:
            return "Something went wrong";
    }
  }
export const GameHeader:FunctionComponent<Props> = ({gameStatus}) => {
    return (
        <h3 style={headerStyle}>{headerText(gameStatus)}</h3>
    );
};