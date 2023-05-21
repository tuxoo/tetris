export interface Figure {
    space: readonly number[][],
    shape: readonly boolean[][],
}

export const SQUARE: Figure = {
    space: [[0, 1], [0, 1]],
    shape: [
        [true, true],
        [true, true],
    ],
}

export const LINE: Figure = {
    space: [[0], [0, 1, 2, 3]],
    shape: [
        [true, true, true, true],
    ],
}

export const L_SHAPE: Figure = {
    space: [[0, 1], [0, 1, 2]],
    shape: [
        [true, false, false],
        [true, true, true],
    ],
}

export const IL_SHAPE: Figure = {
    space: [[0, 1], [0, 1, 2]],
    shape: [
        [false, false, true],
        [true, true, true],
    ],
}

export const E_SHAPE: Figure = {
    space: [[0, 1], [0, 1, 2]],
    shape: [
        [false, true, false],
        [true, true, true],
    ],
}

export const Z_SHAPE: Figure = {
    space: [[0, 1], [0, 1, 2]],
    shape: [
        [false, true, true],
        [true, true, false],
    ],
}

export const IZ_SHAPE: Figure = {
    space: [[0, 1], [0, 1, 2]],
    shape: [
        [true, true, false],
        [false, true, true],
    ],
}