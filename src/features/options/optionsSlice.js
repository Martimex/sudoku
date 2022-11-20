import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'night',
    difficulty: '',
    extras: {
        timer: {
            isEnabled: false,
            isStopped: false, // determines whether timer is being temporarily stopped
        },
        backlit: {
            isEnabled: false,
        },
    },
}

export const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        toggleExtras(state, action) {
            const { name } = action.payload;
            state.extras[name].isEnabled = !state.extras[name].isEnabled;
        },

        switchTheme(state, action) {
            const {theme_name} = action.payload;
            theme_name && (state.theme = theme_name);
        },

        switchDifficulty(state, action) {
            const {difficulty_name} = action.payload;
            difficulty_name && (state.difficulty = difficulty_name);
        },

        // For extras functionality 

        stopTimer(state, action) {
            const shouldBeStopped = action.payload;
            state.extras[`timer`].isStopped = shouldBeStopped;
        },

        // RESET EXTRAS
        RESET_EXTRAS: () => initialState
    },

})

export const { toggleExtras, switchTheme, switchDifficulty, stopTimer, RESET_EXTRAS } = optionsSlice.actions;
export default optionsSlice.reducer;

