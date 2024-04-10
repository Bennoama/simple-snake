import React, { FunctionComponent, useEffect, useState } from "react";
import { SnakeSquare } from "./snakeSquare/snakeSquare.tsx";
import { Borders, Direction, GameStatus } from "./utils.ts";

interface FoodProperties {
    x: number;
    y: number;
    eatCallback: (snakeSquaresArr: React.JSX.Element[]) => void;
};

interface Props {
    direction: Direction;
    gameStatus: GameStatus;
    borders: Borders;
    gameOverCallback: () => void;
    foodProperties: FoodProperties;
};

let idCounter = 3
const initialSnake = [
    <SnakeSquare isFood={false} key={0} x={500} y={400} />,
    <SnakeSquare isFood={false} key={1} x={520} y={400} />,
    <SnakeSquare isFood={false} key={2} x={540} y={400} />
];

const getNextBlockMultipliers = (direction: Direction, snakeSquares: React.JSX.Element[]) => {
    const multipliers = { x: 0, y: 0 };
    if (direction === Direction.DOWN) {
        multipliers.y = 1;
    } else if (direction === Direction.UP) {
        multipliers.y = -1;
    } else if (direction === Direction.RIGHT) {
        multipliers.x = 1;
    } else if (direction === Direction.LEFT) {
        multipliers.x = -1;
    }
    return multipliers
}

const hasEatenFood = (head: React.JSX.Element, foodProperties: FoodProperties): boolean => {
    console.log(head.props.x, foodProperties.x)
    console.log(head.props.y, foodProperties.y)
    return (head.props.x === foodProperties.x && head.props.y === foodProperties.y)
}

const moveSnake = (direction: Direction,
    snakeSquares: React.JSX.Element[],
    borders: Borders,
    gameOverCallback: () => void,
    foodProperties: FoodProperties) => {
    const mutation = addToSnake(direction, snakeSquares, borders, gameOverCallback);
    if (hasEatenFood(mutation[mutation.length - 1], foodProperties)) {
        foodProperties.eatCallback(mutation);
        return mutation
    }
    mutation.shift();
    return mutation;
}

const isCollisionWithSelf = (head: React.JSX.Element, snakeSquares: React.JSX.Element[]): boolean => {
    let gameOver = false;
    snakeSquares.forEach((square) => {
        if (square.props.x === head.props.x && square.props.y === head.props.y) {
            gameOver = true;
        }
    })
    return gameOver;
}

const isCollisionWithBorders = (newHead: React.JSX.Element, borders: Borders): boolean => {
    return (
        newHead.props.x >= borders.right ||
        newHead.props.x <= borders.left ||
        newHead.props.y <= borders.top ||
        newHead.props.y >= borders.bottom
    );

}

const addToSnake = (direction: Direction, snakeSquares: React.JSX.Element[], borders, gameOverCallBack: () => void) => {
    const mutation = snakeSquares.slice();
    const multipliers = getNextBlockMultipliers(direction, snakeSquares);
    const length = mutation.length;
    const newY = mutation[length - 1].props.y + multipliers.y * 20;
    const newX = mutation[length - 1].props.x + multipliers.x * 20;
    const newHead = <SnakeSquare isFood={false} key={idCounter} x={newX} y={newY} />
    if (isCollisionWithSelf(newHead, snakeSquares) || isCollisionWithBorders(newHead, borders)) {
        gameOverCallBack();
        mutation.push(newHead);
        return mutation;
    }

    mutation.push(newHead);
    idCounter++;
    return mutation;
}

export const Snake: FunctionComponent<Props> = ({ direction, gameStatus, borders, gameOverCallback, foodProperties }) => {
    const [snakeSquares, setSnakeSquares] = useState(initialSnake);
    useEffect(() => {
        if (GameStatus.PLAY === gameStatus) {
            const intervalID = setInterval(() => { setSnakeSquares(moveSnake(direction, snakeSquares, borders, gameOverCallback, foodProperties)) }, 40)
            return (() => {
                clearInterval(intervalID);
            });
        }

        const handleKeyDown = (event) => {
            if (event.key === ' ' && gameStatus === GameStatus.OVER) {
                setSnakeSquares(initialSnake);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return (() => {
            document.removeEventListener('keydown', handleKeyDown);
        });
    });

    return (
        <>
            {/* <button onClick={() => { setSnakeSquares(addToSnake(direction, snakeSquares, borders, gameOverCallback)) }}>Click to make me bigger</button> */}
            {snakeSquares.map((element) => { return element })}
        </>
    );
};