import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SQUARE} from "../../model/const/figure.const";

const height = 5
const weight = 10

const activeRawsIndex = 0
const activeCellsIndex = 1

const emptyGrid = Array<boolean[]>(height).fill(Array<boolean>(weight).fill(false))

export interface BoardState {
    score: number,
    activeArea: number[][],
    grid: boolean[][],
}

const initialState: BoardState = {
    score: 0,
    activeArea: [],
    grid: emptyGrid,
}

const slice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setup(state, action: PayloadAction) {
            state.grid[9][3] = true // TODO: install start position
            state.grid[9][4] = true // TODO: install start position
        },
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
            if (state.activeArea.length === 0 && state.grid[height - 1].every(raw => (raw))) { // clear lines
                const shiftDown = (step: number) => { // shift down until empty line
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

            if (state.activeArea.length === 0 || state.activeArea[activeRawsIndex][0] === 0) { // setup new figure
                state.activeArea = [...SQUARE.space]

                if (state.grid[1]
                    .slice(state.activeArea[activeCellsIndex][0], state.activeArea[activeCellsIndex][0] + state.activeArea[activeCellsIndex].length)
                    .includes(true)) {

                    state.grid[0].forEach((_, ix) => {
                        state.grid[0][ix] = SQUARE.shape[0][ix]
                    })

                    state.activeArea = [[1], SQUARE.space[1]]

                    return;
                }

                // TODO: fill figure
                state.activeArea[activeRawsIndex].forEach(iy => {
                    state.activeArea[activeCellsIndex].forEach(ix => {
                        state.grid[iy][ix] = SQUARE.shape[iy][ix]
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

                        if (state.grid[0].includes(true)) { // game over
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

            if (state.grid[0].includes(true)) { // game over
                state.grid = emptyGrid
            }
        }
    },
})

export const boardActions = slice.actions
export const boardReducer = slice.reducer