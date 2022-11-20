import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    numbers: {
        1: {timesUsed: 0},
        2: {timesUsed: 0},
        3: {timesUsed: 0},
        4: {timesUsed: 0},
        5: {timesUsed: 0},
        6: {timesUsed: 0},
        7: {timesUsed: 0},
        8: {timesUsed: 0},
        9: {timesUsed: 0},
    }
}

export const numberBoxSlice = createSlice({
    name: 'numberBox',
    initialState,
    reducers: {
        incrementUse(state, action) {
            const { number } = action.payload;
            state.numbers[number].timesUsed++;
        },
        decrementUse(state, action) {
            const { number } = action.payload;
            state.numbers[number].timesUsed--;
        }
    }
});


export default numberBoxSlice.reducer;