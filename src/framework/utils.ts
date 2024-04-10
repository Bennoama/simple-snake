export enum GameStatus {
    PAUSE = 0,
    PLAY = 1,
    OVER = 2
}

export type Borders = {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export enum Direction {
    UP = 0,
    DOWN = 1,
    RIGHT = 3,
    LEFT = 4
}