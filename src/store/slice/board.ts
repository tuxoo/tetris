import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {E_SHAPE, Figure, IL_SHAPE, IZ_SHAPE, L_SHAPE, LINE, SQUARE, Z_SHAPE} from "../../model/const/figure.const";

const height = 20
const weight = 20

const activeRawsIndex = 0
const activeCellsIndex = 1

const emptyGrid = Array<boolean[]>(height).fill(Array<boolean>(weight).fill(false))

export interface BoardState {
    score: number,
    activeArea: number[][],
    grid: boolean[][],
    figures: Figure[]
}

const initialState: BoardState = {
    score: 0,
    activeArea: [],
    grid: emptyGrid,
    figures: [SQUARE, LINE, L_SHAPE, IL_SHAPE, E_SHAPE, Z_SHAPE, IZ_SHAPE]
}

const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        left(state, action: PayloadAction) {
            if (state.activeArea.length === 0
                || state.activeArea[activeRawsIndex][0] === 0
                || state.activeArea[activeCellsIndex][0] === 0
            ) {
                return
            }

            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]; iy >= state.activeArea[activeRawsIndex][0]; iy--) {
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
                || state.activeArea[activeRawsIndex][0] === 0
                || state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1] === weight - 1
            ) {
                return
            }

            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]; iy >= state.activeArea[activeRawsIndex][0]; iy--) {
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
            if (state.activeArea.length === 0 && state.grid[height - 1].every(raw => (raw))) {
                // shift down until empty line
                const shiftDown = (step: number) => {
                    let stepDec = step

                    while (state.grid[stepDec].includes(true)) {
                        state.grid[stepDec] = state.grid[stepDec - 1]
                        state.score++

                        stepDec--
                    }

                    if (state.grid[height - 1].every(raw => (raw))) {
                        shiftDown(height - 1)
                    }
                }

                shiftDown(height - 1)
            }

            // setup new figure
            if (state.activeArea.length === 0 || state.activeArea[activeRawsIndex][0] === 0) {
                // get random figure
                const figure = state.figures[Math.floor(Math.random() * state.figures.length)]

                state.activeArea = [...figure.space]

                const randomShift = Math.floor(Math.random() * (weight - figure.space[activeCellsIndex].length))
                console.log(randomShift)

                state.activeArea[activeCellsIndex].forEach((_, ix) => {
                    state.activeArea[activeCellsIndex][ix] = state.activeArea[activeCellsIndex][ix] + randomShift
                })

                if (state.grid[1]
                    .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][0] + state.activeArea[activeCellsIndex].length)
                    .includes(true)) {

                    figure.space[activeCellsIndex].forEach((ix, i) => {
                        state.grid[0][ix] = figure.shape[figure.shape.length - 1][i]
                    })

                    state.activeArea = [[1], figure.space[figure.shape.length - 1]]

                    return;
                }

                // fill figure
                state.activeArea[activeRawsIndex].forEach(iy => {
                    state.activeArea[activeCellsIndex].forEach((ix, i) => {
                        state.grid[iy][ix] = figure.shape[iy][i]
                    })
                })

                state.activeArea[activeRawsIndex] = state.activeArea[activeRawsIndex].map(iy => {
                    return iy + 1
                })

                return
            }

            const nextIsBusy = state.grid[state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]]
                .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1] + 1)
                .includes(true)

            for (let iy = state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]; iy >= state.activeArea[activeRawsIndex][0]; iy--) {
                for (let ix = state.activeArea[activeCellsIndex][0]; ix <= state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1]; ix++) {
                    if (!nextIsBusy) {
                        state.grid[iy][ix] = state.grid[iy - 1][ix]
                        state.grid[iy - 1][ix] = false
                    } else {
                        state.activeArea = []

                        // game over
                        if (state.grid[0].includes(true)) {
                            state.grid = emptyGrid
                        }

                        return
                    }
                }
            }

            if (state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1] < state.grid.length - 1) {
                state.activeArea[activeRawsIndex].forEach((_, iy) => {
                    state.activeArea[activeRawsIndex][iy]++
                })

                if (state.grid[state.activeArea[activeRawsIndex][state.activeArea[activeRawsIndex].length - 1]]
                    .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][state.activeArea[activeCellsIndex].length - 1] + 1)
                    .includes(true)
                ) {
                    state.activeArea = []
                }
            } else {
                state.activeArea = []
            }

            // game over
            if (state.grid[0].includes(true)) {
                state.grid = emptyGrid
            }
        }
    },
})

export const boardActions = slice.actions
export const boardReducer = slice.reducer