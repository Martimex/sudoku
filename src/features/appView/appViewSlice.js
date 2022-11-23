import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentView: 'landing',
    extraView: '', // it implies to any extra view we use simultanously (like Info, Reset, Loading...)
}

export const appViewSlice = createSlice({
    name: 'appView',
    initialState,
    reducers: {
        changeView(state, action) {
            const { newViewName } = action.payload;
            newViewName && (state.currentView = newViewName);
        },
        addExtraView(state, action) {
            const { extraViewName } = action.payload;
            (state.extraView = extraViewName);
        }
    }
})

export const { changeView, addExtraView } = appViewSlice.actions;

export default appViewSlice.reducer;