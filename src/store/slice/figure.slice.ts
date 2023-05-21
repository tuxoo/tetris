import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const height = 10
const weight = 10

const activeRawsIndex = 0
const activeCellsIndex = 1

export interface FigureState {
    score: number,
    active: number[][],
    grid: boolean[][],
}

const initialState: FigureState = {
    score: 0,
    active: [],
    grid: Array<boolean[]>(height).fill(Array<boolean>(weight).fill(false)),
}

const slice = createSlice({
    name: 'figure',
    initialState,
    reducers: {
        setup(state, action: PayloadAction) {
            state.grid[9][3] = true // TODO: install start position
            state.grid[9][4] = true // TODO: install start position
        },
        left(state, action: PayloadAction) {
            if (state.active.length === 0
                || state.active[activeRawsIndex][0] === 0
                || state.active[activeCellsIndex][0] === 0
            ) {
                return
            }

            for (let iy = state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1]; iy >= state.active[activeRawsIndex][0]; iy--) {
                for (let ix = state.active[activeCellsIndex][0]; ix <= state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1]; ix++) {
                    state.grid[iy - 1][ix - 1] = state.grid[iy - 1][ix]
                    state.grid[iy - 1][ix] = false
                }
            }

            state.active[activeCellsIndex].forEach((_, ix) => {
                state.active[activeCellsIndex][ix]--
            })
        },
        right(state, action: PayloadAction) {
            if (state.active.length === 0
                || state.active[activeRawsIndex][0] === 0
                || state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1] === weight - 1
            ) {
                return
            }

            for (let iy = state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1]; iy >= state.active[activeRawsIndex][0]; iy--) {
                for (let ix = state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1]; ix >= state.active[activeCellsIndex][0]; ix--) {
                    state.grid[iy - 1][ix + 1] = state.grid[iy - 1][ix]
                    state.grid[iy - 1][ix] = false
                }
            }

            state.active[activeCellsIndex].forEach((_, ix) => {
                state.active[activeCellsIndex][ix]++
            })
        },
        down(state, action: PayloadAction) {
            // TODO: shift down after clearing
            if (state.active.length !== 0 && state.active[0][0] === 0) { // clear lines
                for (let iy = height - 1; iy > height - state.active[activeRawsIndex].length - 1; iy--) {
                    if (state.grid[iy].every(raw => (raw))) { // clear line

                        // state.grid[iy] = Array<boolean>(weight).fill(false)

                        let ss = iy

                        console.log(ss)

                        while (state.grid[ss - 1].includes(true)) {
                            console.log(ss)
                            state.grid[ss] = state.grid[ss - 1]
                            ss--
                        }

                        state.score++
                    }
                }
            }


            if (state.active.length === 0 || state.active[activeRawsIndex][0] === 0) {
                state.active = [[0, 1], [1, 2]] // TODO: active test left up line

                if (state.grid[state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1]]
                    .slice(state.active[activeCellsIndex][0], state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1])
                    .includes(true)) {
                    state.grid[state.active[activeRawsIndex][0]] = [false, true, true, false, false, false, false, false, false, false]

                    state.active = [[1], [1, 2]] // stub

                    return;
                }

                // TODO: stub
                state.grid[0] = [false, true, true, false, false, false, false, false, false, false] // TODO: test left up line
                state.grid[1] = [false, true, true, false, false, false, false, false, false, false] // TODO: test left up line

                state.active[activeRawsIndex].forEach((_, iy) => {
                    state.active[activeRawsIndex][iy]++
                })

                return
            }


            const nextIsBusy = state.grid[state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1]].slice(state.active[activeCellsIndex][0], state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1] + 1).includes(true)

            for (let iy = state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1]; iy >= state.active[activeRawsIndex][0]; iy--) {
                for (let ix = state.active[activeCellsIndex][0]; ix <= state.active[activeCellsIndex][state.active[activeCellsIndex].length - 1]; ix++) {
                    if (!nextIsBusy) {
                        state.grid[iy][ix] = state.grid[iy - 1][ix]
                        state.grid[iy - 1][ix] = false
                    } else {
                        state.active = []

                        if (state.grid[0].includes(true)) { // game over
                            state.grid = Array<boolean[]>(state.grid.length).fill(Array<boolean>(weight).fill(false))
                        }

                        return
                    }
                }
            }

            if (state.active[activeRawsIndex][state.active[activeRawsIndex].length - 1] < state.grid.length - 1) {
                state.active[activeRawsIndex].forEach((_, iy) => {
                    state.active[activeRawsIndex][iy]++
                })
            } else {
                state.active[activeRawsIndex].forEach((_, iy) => {
                    state.active[activeRawsIndex][iy] = 0
                })
            }

            if (state.grid[0].includes(true)) { // game over
                state.grid = Array<boolean[]>(state.grid.length).fill(Array<boolean>(weight).fill(false))
            }
        }
    },
})

export const figureActions = slice.actions
export const figureReducer = slice.reducer