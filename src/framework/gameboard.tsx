import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Borders, Direction, GameStatus } from "./utils.ts";
import { Snake } from "./snake.tsx";
import { SnakeSquare } from "./snakeSquare/snakeSquare.tsx";

const gameboardStyle = {
    width: '1000px',
    height: '800px',
    backgroundColor: 'white',
    justifyContent: 'center',
    border: '5px solid red',
    margin: 'auto',
}

const keyToDirection: Record<string, Direction> = {
    'ArrowUp': Direction.UP,
    'ArrowDown': Direction.DOWN,
    'ArrowLeft': Direction.LEFT,
    'ArrowRight': Direction.RIGHT,
};

interface gameplayCallbacks {
    gameOverCallback: () => void;
    pointScoredCallback: () => void;
    gameStartCallback: () => void;
}

interface Props {
    gameStatus: GameStatus;
    gameplayCallbacks: gameplayCallbacks;
}

const randomNumberGeneration = (min: number, max: number, interval: number): number => {
    // Calculate the number of possible jumps within the range
    const numberOfJumps = Math.floor((max - min) / interval) + 1;
    // Generate a random jump index
    const randomJumpIndex = Math.floor(Math.random() * numberOfJumps);
    // Calculate the random number
    const randomNumber = min + randomJumpIndex * interval;
    return randomNumber;
}

const pointInSnakeArray = (x: number, y: number, snakeArr: React.JSX.Element[]) => {
    for (const snakeElement of snakeArr) {
        const snakeElementProps = (snakeElement as React.ReactElement).props;
        if (snakeElementProps.x === x && snakeElementProps.y === y) {
            return true;
        }
    }
    return false;
}

const setFoodLocationHandler = (setFoodLocation, snakeArr: React.JSX.Element[]) => {
    let newX = randomNumberGeneration(460, 1440, 20);
    let newY = randomNumberGeneration(40, 800, 20);
    while (pointInSnakeArray(newX, newY, snakeArr)) {
        newX = randomNumberGeneration(460, 1440, 20);
        newY = randomNumberGeneration(40, 800, 20);
    }
    setFoodLocation({ x: newX, y: newY })
}

export const Gameboard: FunctionComponent<Props> = ({ gameStatus, gameplayCallbacks }) => {
    const [direction, setDirection] = useState(Direction.RIGHT);
    const [foodLocation, setFoodLocation] = useState({ x: 600, y: 600 })

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (undefined !== keyToDirection[event.key]) {
                if (gameStatus === GameStatus.PLAY && 1 !== Math.abs(direction - keyToDirection[event.key])) {
                    setDirection(keyToDirection[event.key])
                }
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return (() => {
            document.removeEventListener('keydown', handleKeyDown);
        });
    },);

    const borders: Borders = {
        left: 440,// LOL
        right: 1460,// LOL
        top: 20,// LOL
        bottom: 820// LOL
    }

    return (
        <div className="gameBoard" style={gameboardStyle}>
            <Snake direction={direction}
                gameStatus={gameStatus}
                borders={borders}
                gameOverCallback={() => {
                    setDirection(Direction.RIGHT);
                    gameplayCallbacks.gameOverCallback();
                }}
                foodProperties={{
                    x: foodLocation.x,
                    y: foodLocation.y,
                    eatCallback: (snakeSquaresArr: React.JSX.Element[]) => {
                        gameplayCallbacks.pointScoredCallback();
                        setFoodLocationHandler(setFoodLocation, snakeSquaresArr)
                    }
                }}
            />
            <SnakeSquare x={foodLocation.x} y={foodLocation.y} isFood={true} />
        </div>
    );
};