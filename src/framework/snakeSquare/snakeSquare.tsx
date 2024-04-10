import React, { FunctionComponent } from "react";
import './snakeSquare.scss'


interface Props {
    x: number;
    y: number;
    isFood: boolean;
}

export const SnakeSquare: FunctionComponent<Props> = ({ x, y, isFood }) => {
    const snakeSquareStyle = {
        left: x + 'px',
        top: y + 'px',
        backgroundColor: isFood ? 'red' : 'green',
    }

    return (
        <>
            <div className="snakeSquare" style={snakeSquareStyle} />
        </>
    )
};