import { createSlice } from "@reduxjs/toolkit";
import { helpers } from './sudokuHelpers.js';

const initialState = {
    isSudokuSolved: false,
    win_board: [],
    step: 0,  // which is maximum move count player has already made
    currentStep: 0, // which is current move count player is viewing (if it equals step, then it is unequivocal to playing)
    mode: 'play', // could be 'view', when player browse through time travel feature AND  step !== currentStep
    playerAction: '', // could be: add (add new move) || back (travel back in history move) || forth (travel forth in history move)
    isPencilmarkOn: false,
    gameHistory: [], // array of objects
}

export const sudokuSlice = createSlice({
    name: 'sudoku',
    initialState,
    reducers: {
        sudokuSolved(state, action) {
            const isSolved = action.payload;
            state.isSudokuSolved = isSolved;
        },
        defineSuccessBoard(state, action) {
            const { board } = action.payload;
            state.win_board = board;
        },
        initializeGameHistory(state, action) {
            // We will only use it once we get a brand new Sudoku
            const { history, availableDigits} = action.payload; 

            state.gameHistory.push({
                board: history,
                numbers: availableDigits,
                targetTile: '',
                appliedDigit: '',
                extraData: {
                    // HERE EXTRA FUNCTIONALITY CAN BE ADDED, WHICH IS TRACKED AND UPDATED EACH TIME PLAYER CHANGES THE BOARD STATE
                    removedPencilmarks_TileCords: [], // [{row: NUMBER, column: NUMBER}, ...] stores row and col of tile, where pencilmark of ${appliedDigit} was removed
                    digitConflicts: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []},
                },
            });
        },
        updateGameHistory(state, action) {
            const { tileRow, tileColumn, digit } = action.payload;

            // Grab some copies
            const isPencilmarkOn = state.isPencilmarkOn;
            const gameHistory_lastTurn_copy__numbers = {...state.gameHistory[state.gameHistory.length - 1].numbers};
            const gameHistory_lastTurn_digitConflicts = JSON.parse(JSON.stringify({...state.gameHistory[state.gameHistory.length - 1].extraData[`digitConflicts`]}));
            const gameHistory_lastTurn_copy__board = JSON.parse(JSON.stringify([...state.gameHistory[state.gameHistory.length - 1].board]));

            // UNMODIFIED version lets us work on a unchanged copy of an object, which would be useful for extraData updates
            const gameHistory_lastTurn_copy__board__UNMODIFIED = [...JSON.parse(JSON.stringify([...state.gameHistory[state.gameHistory.length - 1].board]))];

            state.gameHistory.push({
                board: helpers.updateBoard(gameHistory_lastTurn_copy__board, tileRow, tileColumn, digit, isPencilmarkOn).filter((el, ind) => ind <= 8),
                numbers: helpers.updateNumbers(gameHistory_lastTurn_copy__board__UNMODIFIED, tileRow, tileColumn, gameHistory_lastTurn_copy__numbers, digit, isPencilmarkOn),
                targetTile: {row: tileRow, column: tileColumn},
                appliedDigit: digit,
                extraData: {
                    removedPencilmarks_TileCords: helpers.checkRemovedPencilmarks(gameHistory_lastTurn_copy__board__UNMODIFIED, tileRow, tileColumn, digit, isPencilmarkOn),
                    digitConflicts: helpers.checkDigitConflicts(gameHistory_lastTurn_copy__board__UNMODIFIED, tileRow, tileColumn, gameHistory_lastTurn_digitConflicts, digit, isPencilmarkOn),
                    // more extra functionalities update pattern can be added below
                },
            })
        },
        togglePencilmarkMode(state, action) {
            state.isPencilmarkOn = !state.isPencilmarkOn;
        },
        changeCurrentStep(state, action) {
            const { value } = action.payload;
            state.currentStep = state.currentStep += value;
        },
        increaseSteps(state, action) {
            state.step = state.step += 1;
            state.currentStep = state.currentStep += 1;
        },
        overRideHistory(state, action) {
            // Invoke order is IMPORTANT HERE !
            state.gameHistory.splice(state.currentStep + 1);
            state.step = state.currentStep;
        },
        updatePlayerAction(state, action) {
            const { action_type } = action.payload;
            state.playerAction = action_type;
        },

        // RESET STATE
        RESET_STATE: () => initialState
    }
    
})

export const { defineSuccessBoard, initializeGameHistory, updateGameHistory, togglePencilmarkMode, increaseSteps, overRideHistory,
               changeCurrentStep, updatePlayerAction, sudokuSolved, RESET_STATE } = sudokuSlice.actions;

export default sudokuSlice.reducer;