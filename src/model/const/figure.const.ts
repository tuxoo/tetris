export interface Figure {
    space: readonly number[][],
    shape: boolean[][],
}

export const SQUARE: Figure = {
    space: [[0, 1], [0, 1]],
    shape: [
        [true, true],
        [true, true],
    ],
}