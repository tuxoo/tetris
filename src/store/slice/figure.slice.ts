import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const height = 5
const weight = 10

export interface FigureState {
    score: number,
    active: number[],
    grid: boolean[][],
}

const initialState: FigureState = {
    score: 0,
    active: [0, 1],
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
            const tryPosition : boolean[][] = state.active.map(row => {
                let nextPosition: boolean[] = []

                if (!state.grid[row - 1][state.grid[0].length - 1]) {
                    nextPosition = state.grid[row - 1].slice()
                    for (let i = 0; i < 1; i++) {
                        nextPosition.unshift(...nextPosition.splice(1))
                    }
                }

                return nextPosition
            })

            for (let i= state.active[0]; i < state.active[0] + state.active.length; i++) {
                if (state.grid[i - 1][0]) {
                    return
                }
            }

            state.active.forEach((raw, i) => {
                state.grid[raw - 1] = tryPosition[i]
            })
        },
        right(state, action: PayloadAction) {
            const tryPosition : boolean[][] = state.active.map(row => {
                let nextPosition: boolean[] = []

                if (!state.grid[row - 1][state.grid[0].length - 1]) {
                    nextPosition = state.grid[row - 1].slice()
                    for (let i = 0; i < 1; i++) {
                        nextPosition.unshift(...nextPosition.splice(-1))
                    }

                }

                return nextPosition
            })

            for (let i= state.active[0]; i < state.active[0] + state.active.length; i++) {
                if (state.grid[i - 1][state.grid[0].length - 1]) {
                    return
                }
            }

            state.active.forEach((raw, i) => {
                state.grid[raw - 1] = tryPosition[i]
            })
        },
        down(state, action: PayloadAction) {
            if (state.grid[state.grid.length - 1].every(raw => (raw))) { // clear line
                state.score++
                state.grid[state.grid.length - 1] = Array<boolean>(state.grid[0].length).fill(false)
            }

            if (state.active[0] === 0) {
                const start = Math.abs(Math.floor(Math.random() * state.grid[0].length - 1))
                switch (true) {
                    case (start === 0 || start === 1 || state.grid[0].length - 1):
                        switch (start) {
                            case 0 :
                                state.grid[0][start] = true
                                state.grid[0][start + 1] = true
                                state.grid[1][start] = true
                                state.grid[1][start + 1] = true
                                break
                            case state.grid[0].length - 1:
                                state.grid[0][start] = true
                                state.grid[0][start - 1] = true
                                state.grid[1][start] = true
                                state.grid[1][start - 1] = true
                                break
                            default:
                                state.grid[0][start] = true
                                state.grid[0][start - 1] = true
                                state.grid[1][start] = true
                                state.grid[1][start - 1] = true
                                break
                        }
                        break
                    case (start === 3 || start === 4 || start === 5):
                        switch (start) {
                            case 3 :
                                state.grid[0][start + 2] = true
                                state.grid[0][start + 1] = true
                                state.grid[1][start + 1] = true
                                state.grid[1][start] = true
                                break
                            case 4:
                                state.grid[0][start] = true
                                state.grid[0][start - 1] = true
                                state.grid[1][start - 1] = true
                                state.grid[1][start - 2] = true
                                break
                            default:
                                state.grid[0][start] = true
                                state.grid[0][start - 1] = true
                                state.grid[1][start] = true
                                state.grid[1][start + 1] = true
                                break
                        }
                        break
                    default :
                        switch (start) {
                            case 6 :
                                state.grid[0][start] = true
                                state.grid[1][start] = true
                                state.grid[1][start - 1] = true
                                state.grid[1][start + 1] = true
                                break
                            default:
                                state.grid[1][start] = true
                                state.grid[0][start] = true
                                state.grid[0][start - 1] = true
                                state.grid[0][start + 1] = true
                                break
                        }
                        break
                }

                state.active.forEach((_, i) => {
                    state.active[i]++
                })

                return
            }

            // for (let iy = state.grid.length - 1; iy > 0; iy--) {
            for (let iy = state.active[state.active.length - 1]; iy >= state.active[0]; iy--) {
                let prev: number[] = []
                let next: number[] = []

                for (let i = 0; i < state.grid[iy].length; i++) {
                    if (state.grid[iy][i]) {
                        prev.push(i)
                    }

                    if (state.grid[iy - 1][i]) {
                        next.push(i)
                    }
                }

                console.log(next.filter(x => prev.includes(x)).toString())

                if (next.filter(x => prev.includes(x)).length === 0) {
                    for (let ix = 0; ix < state.grid[iy].length; ix++) {
                        if (!state.grid[iy][ix]) {
                            state.grid[iy][ix] = state.grid[iy - 1][ix]
                            state.grid[iy - 1][ix] = false
                        }
                    }
                }
            }

            if (state.grid[0].includes(true)) { // game over
                state.grid = Array<boolean[]>(state.grid.length).fill(Array<boolean>(state.grid[0].length).fill(false))
            }

            if (state.active[state.active.length - 1] < state.grid.length - 1) {
                state.active.forEach((_, i) => {
                    state.active[i]++
                })
            } else {
                state.active = initialState.active
            }
        },
    },
})

export const figureActions = slice.actions
export const figureReducer = slice.reducer