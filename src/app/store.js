import {configureStore} from "@reduxjs/toolkit";

// import reducers
import optionsReducer  from "../features/options/optionsSlice";
import appViewReducer from "../features/appView/appViewSlice";
//import numberBoxReducer from '../features/numberBox/numberBoxSlice';
import sudokuReducer from '../features/sudoku/sudokuSlice.js';

export default configureStore({
    reducer: {
        appView: appViewReducer,
        options: optionsReducer,
        ///numberBox:  numberBoxReducer,
        sudoku: sudokuReducer,
    }

    
})