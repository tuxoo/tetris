import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    E_SHAPE,
    Figure,
    IL_SHAPE,
    IZ_SHAPE,
    L_SHAPE,
    LINE,
    SQUARE,
    Z_SHAPE,
    ZERO
} from "../../model/const/figure.const";
import {toast} from "react-toastify";

export const HEIGHT = 20
export const WEIGHT = 16

const activeRawsIndex = 0
const activeCellsIndex = 1

const emptyGrid = Array<boolean[]>(HEIGHT).fill(Array<boolean>(WEIGHT).fill(false))

export interface BoardState {
    score: number,
    activeArea: number[][],
    grid: boolean[][],
    figures: Figure[],
    figure: Figure,
}

const initialState: BoardState = {
    score: 0,
    activeArea: [],
    grid: emptyGrid,
    figures: [SQUARE, LINE, L_SHAPE, IL_SHAPE, E_SHAPE, Z_SHAPE, IZ_SHAPE],
    figure: ZERO,
}

const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        left(state, action: PayloadAction) {
            if (state.activeArea.length === 0
                || state.activeArea[activeCellsIndex][0] === 0
            ) {
                return
            }

            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] + 1; iy > state.activeArea[activeRawsIndex][0]; iy--) {
                for (let ix = state.activeArea[activeCellsIndex][0]; ix <= state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1]; ix++) {
                    state.grid[iy - 1][ix - 1] = state.grid[iy - 1][ix]
                    state.grid[iy - 1][ix] = false
                }
            }

            state.activeArea[activeCellsIndex].forEach((_, ix) => {
                state.activeArea[activeCellsIndex][ix]--
            })
        },
        right(state, action: PayloadAction) {
            if (state.activeArea.length === 0
                || state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1] === WEIGHT - 1
            ) {
                return
            }

            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] + 1; iy > state.activeArea[activeRawsIndex][0]; iy--) {
                for (let ix = state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1]; ix >= state.activeArea[activeCellsIndex][0]; ix--) {
                    state.grid[iy - 1][ix + 1] = state.grid[iy - 1][ix]
                    state.grid[iy - 1][ix] = false
                }
            }

            state.activeArea[activeCellsIndex].forEach((_, ix) => {
                state.activeArea[activeCellsIndex][ix]++
            })
        },
        down(state, action: PayloadAction) {
            // clear lines
            if (state.activeArea.length === 0) {
                for (let iy = HEIGHT - 1; iy > 0; iy--) {
                    if (state.grid[iy].every(raw => (raw))) {
                        // shift down until empty line
                        const shiftDown = (step: number) => {
                            let stepDec = step

                            while (state.grid[stepDec].includes(true)) {
                                state.grid[stepDec] = state.grid[stepDec - 1]
                                state.score++

                                stepDec--
                            }

                            if (state.grid[iy].every(raw => (raw))) {
                                shiftDown(iy)
                            }
                        }

                        shiftDown(iy)
                    }
                }
            }

            // setup new figure
            if (state.activeArea.length === 0) {
                // get random figure
                state.figure = state.figures[Math.floor(Math.random() * state.figures.length)]

                state.figure.space.forEach(raw => {
                    state.activeArea.push([...raw])
                })

                // get random figure shift
                const randomShift = Math.floor(Math.random() * (WEIGHT - state.figure.space[activeCellsIndex].length))
                state.activeArea[activeCellsIndex].forEach((_, ix) => {
                    state.activeArea[activeCellsIndex][ix] = state.activeArea[activeCellsIndex][ix] + randomShift
                })

                if (state.grid[1]
                    .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][0] + state.activeArea[activeCellsIndex].length)
                    .includes(true)) {

                    state.figure.space[activeCellsIndex].forEach((ix, item) => {
                        state.grid[0][ix] = state.figure.shape[state.figure.shape.length - 1][item]
                    })

                    state.activeArea = [[1], state.figure.space[state.figure.shape.length - 1]]

                    return;
                }

                // fill figure
                state.activeArea[activeRawsIndex].forEach(iy => {
                    state.activeArea[activeCellsIndex].forEach((ix, item) => {
                        state.grid[iy][ix] = state.figure.shape[iy][item]
                    })
                })

                return
            }

            let nextIsBusy = false
            state.grid[state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] + 1]
                .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1] + 1)
                .forEach((cell, item) => {
                    if ((state.figure.shape[state.figure.shape.length - 1][item] && cell)) {
                        nextIsBusy = true
                    }

                    // stub for z-shapes
                    if (state.figure.shape[state.figure.shape.length - 1].includes(false)) {
                        if ((state.figure.shape[state.figure.shape.length - 1]
                            [state.figure.shape[state.figure.shape.length - 1].indexOf(false)] && cell)) {
                            nextIsBusy = true
                        }
                    }
                })

            let iyCounter = state.activeArea[activeRawsIndex].length - 1
            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] + 1; iy > state.activeArea[activeRawsIndex][0]; iy--) {
                let ixCounter = 0

                for (let ix = state.activeArea[activeCellsIndex][0]; ix <= state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1]; ix++) {
                    if (!nextIsBusy) {
                        if (state.figure.shape[iyCounter][ixCounter]) {
                            state.grid[iy][ix] = state.grid[iy - 1][ix]
                            state.grid[iy - 1][ix] = false
                        }
                    } else {
                        state.activeArea = []

                        // game over
                        if (state.grid[0].includes(true)) {
                            state.grid = emptyGrid

                            toast.error("Game Over")
                        }

                        return
                    }

                    ixCounter++
                }

                iyCounter--
            }

            if (state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] < state.grid.length - 2) {
                state.activeArea[activeRawsIndex].forEach((_, iy) => {
                    state.activeArea[activeRawsIndex][iy]++
                })

                if (state.grid[state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]].every(raw => (raw))) {
                    state.activeArea = []
                }
            } else {
                state.activeArea = []
            }

            // game over
            if (state.grid[0].includes(true)) {
                state.grid = emptyGrid

                toast.error("Game Over")
            }
        }
    },
})

export const boardActions = slice.actions
export const boardReducer = slice.reducer