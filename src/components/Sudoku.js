import { useLayoutEffect, useEffect, useRef, createRef, useState } from "react";
import Square from "./Square";
import {Toolbox, tools} from './Toolbox';
import Reset from './Reset';
import Loading from './Loading';
import Win from './Win';
import Timer from './Timer';
import Info from './Info';
import '../styles/sudoku.css';
import { engine, success_board} from '../addons/engine.js';
import anime from 'animejs/lib/anime.es.js';

import { useSelector, useDispatch } from 'react-redux';
import { changeView, addExtraView} from '../features/appView/appViewSlice.js';
import { stopTimer } from '../features/options/optionsSlice.js';
import { defineSuccessBoard, initializeGameHistory, updateGameHistory, increaseSteps, overRideHistory, updatePlayerAction, sudokuSolved, RESET_STATE} from "../features/sudoku/sudokuSlice";

const currentHistory = {
    history: [],
};

let availableDigits = { } // Stores how many times a number is used
let availableDigits_history = []; // Array that stores history of available Digits through the game

let game_History = [];
let activeTiles_History = []; // Array that contains history of tiles, which were targeted by player (change onto them - each index = change)

const difficultyColors = {
    day: {
        easy: 'hsl(116, 40%, 40%)',
        medium: 'hsl(55, 40%, 40%)',
        hard: 'hsl(12, 40%, 40%)',
        master: 'hsl(182, 40%, 40%)',
    },
    
    night: {
        easy: 'hsl(116, 65%, 45%)',
        medium: 'hsl(55, 65%, 45%)',
        hard: 'hsl(12, 65%, 45%)',
        master: 'hsl(182, 65%, 45%)',
    }
}

function Sudoku(props) {

    // 💡 final_Difficulty should be replaced by props.difficulty, once a not-random pick-up Sudoku generating mechanism would be implemented
    const dispatch = useDispatch();

    const queried_difficulty = useSelector(state => state.options.difficulty);
    const theme = useSelector(state => state.options.theme);
    const extras = useSelector(state => state.options.extras);
    const app_view = useSelector(state => state.appView.currentView);
    const extra_view = useSelector(state => state.appView.extraView);
    const sudoku_state = useSelector(state => state.sudoku);
    const sudoku_gameHistory = useSelector(state => state.sudoku.gameHistory); 
    const thisStep = useSelector(state => state.sudoku.step);
    const thisCurrentStep = useSelector(state => state.sudoku.currentStep);
    const isPencilmarkEnabled = useSelector(state => state.sudoku.isPencilmarkOn);
    const sudoku_solved = useSelector(state => state.sudoku.isSudokuSolved);

    const squareRows = 3;
    const squareColumns = 3;
    const rows = 9;
    const columns = 9;

    const [active, setActive] = useState(''); // stores a DOM element (more specifically a non-initial tile) that user has clicked recently
    const [final_Difficulty, setFinalDifficulty] = useState(null); // what's the sudoku finalDifficulty
    const [pencilmarks_Enabled, setPencilMarksEnabled] = useState(false); // checks whether player turned pencilmark mode ON (toolbox spec.)
    const [step, setStep] = useState(0); // determines no of action (would enable to travel in time regarding board progress)
    const [current_step, setCurrentStep] = useState(0); // determines current step no - also the one currently browsed by player
    const [history_travel, setHistoryTravel] = useState(0); // it's only use to trigger stuff properly, it's an artificial state, but dont remove it !
    //const [sudoku_solved, setSudokuSolved] = useState(false); // indicates whether Sudoku has been Solved or not (boolean)

    //const [checkInfo, setCheckInfo] = useState(false);         // should we set Check Info screen ?
    //const [confirmReset, setconfirmReset] = useState(false);   // should we set Reset Confirmation screen ?
    //const [newSudokuLoading, setNewSudokuLoading] = useState(0); // should we set Sudoku Loading screen ?

    const [[hours, minutes, seconds], setTime] = useState([0, 0, 0]);  // used for Timer Component  - we'll keep this one !
    //const [stopTimer, setStopTimer] = useState(false);  // shall we stop the timer now ?

    const sudoku = useRef(null);
    const all = useRef(null);
    const board = useRef(null);
    const numbox = useRef(null);
    const rubber = useRef(null);
    const paletteRef = createRef();

    let renderArray = [];
    
    for(let i=0; i<(squareRows * squareColumns); i++) {
        renderArray.push('');
    }

    const allSquares = renderArray.map((square, index) => 
        <Square key={index.toString()} id={index} theme={theme} difficulty={final_Difficulty}
         mainRows={rows} mainColumns={columns} squareRows={squareRows} squareColumns={squareColumns} />
    );

    const checkMarkTileConditions = (e) => {
        if((e.target.classList.contains('tile')) && (!e.target.classList.contains('initial'))) {
            markTile(e.target)
        }
    }

    const markTile = (el) => {
        if(active) { active.classList.remove('active'); }
        if(!el) { setActive(''); return}
        setActive(el);
        el.classList.add('active');

        if(extras['backlit'].isEnabled) {
            engine.resetHighlightEffect(theme);
            engine.applyHighlightEffect(el, final_Difficulty, theme);
        }
    }

    const appendNumber_v2 = (e) => {
        if(e.target.classList.contains('numbers-box')) {return;}
        console.warn(sudoku_state);
    }

    const updateHistory_v2 = (e) => {
        // let each single Tile Component store its value (the number / pencilmarks) they currently hold. 
        // It'll make state updates and further management much easier
        // START FROM HERE
        //dispatch(updateGameHistory({history, availableDigits, active})); uncomment later lol

        // ORDER STRICTLY IMPORTANT !

        if(thisStep !== thisCurrentStep) {
            dispatch(overRideHistory());
            console.log('GAME HISTORY IS ABOUT TO BE OVERRIDDEN');
        }

        dispatch(updateGameHistory({
            //tile: active, // Redux does not allow adding DOM elems !
            tileRow: active.dataset['row'],
            tileColumn: active.dataset['column'],
            digit: (parseInt(e.target.dataset['number']) === 0)? '': parseInt(e.target.dataset['number']), // conditional only for rubber purposes
            // isPencilmarkOn can be omitted since our state control this variable
        }))
        
        dispatch(increaseSteps());
    }

    useEffect(() => {
        // repaint Board
        console.log('this step is: ', thisStep)
        if(thisStep <= 0) { return; }

        const current_step = sudoku_state.currentStep;
        console.log(current_step);
        const viewedBoard = sudoku_state.gameHistory[current_step].board;
        console.log(viewedBoard);

        const {row, column} =  sudoku_gameHistory[current_step].targetTile;
        console.log('ROW: ', row, '   COL:   ', column); // working fine

        // setActiveCursor
        markTile(document.querySelector(`.tile[data-row="${row}"][data-column="${column}"]`));
        console.log(`%c active is now changed!`, 'color: yellow');

        checkNumberBoxUpdates();

        if(sudoku_state.playerAction !== 'add') {
            // so it's either back or forth
            const boardToCompare = (sudoku_state.playerAction !== 'back')? sudoku_state.gameHistory[current_step - 1].board : sudoku_state.gameHistory[current_step + 1].board;
            travelInTime(viewedBoard, boardToCompare);
            return;
        }

        //console.error(sudoku_state.playerAction)
        //document.querySelector('.tile').style.background = 'lime';
        //document.querySelector(`.tile[data-row="${row}"][data-column="${column - 1}"]`).style.background = 'pink';
        
        //console.log('BEFORE: ', (sudoku_gameHistory[thisCurrentStep-1].board[row][column] | sudoku_gameHistory[thisCurrentStep].board[row][column]), '\n', 'AFTER: ', sudoku_gameHistory[thisCurrentStep].board[row][column]);
        //console.log('Type::BEFORE: ', typeof(sudoku_gameHistory[thisCurrentStep-1].board[row][column]), '\n', 'Type::AFTER: ', typeof(sudoku_gameHistory[thisCurrentStep].board[row][column]))

        const prevTileValue = sudoku_gameHistory[thisCurrentStep - 1].board[row][column];
        const newTileValue = sudoku_gameHistory[thisCurrentStep].board[row][column];
        //const thisTile = document.querySelector(`.tile[data-row="${row}"][data-column="${column}"]`);

        repaintBoard([{row: row, column: column}], [prevTileValue], [newTileValue]);

        // Lastly, check if Sudku is solved
        checkSudokuSolved(sudoku_gameHistory[current_step].board, sudoku_state.win_board);

        // Finally, animate stuff
        const numberBoxTarget = document.querySelector(`.option[data-number="${sudoku_gameHistory[thisCurrentStep].appliedDigit}"]`) // CAN BE, SINCE IT WORKS ONLY FOR "ADD" TYPE OF USER ACTION

        anime({
            targets: active,
            duration: 1000,
            color: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`], // props.difficulty 💡
            easing: 'linear',
        })

        anime({
            targets: numberBoxTarget,
            duration: 1100,
            background: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`],  // props.difficulty 💡
            easing: 'easeOutSine',
            direction: 'alternate',
        })
    }, /* [sudoku_gameHistory] */ [thisCurrentStep]);

    const checkNumberBoxUpdates = () => {
        // Update number box buttons visually whenever player uses all possible digits or retrieve one of those
        // TODO  
        /* 
         const current_step = sudoku_state.currentStep;
         sudoku_gameHistory[current_step].numbers; // here we can access current
        */

        const current_step = sudoku_state.currentStep;
        console.log(sudoku_gameHistory[current_step].numbers); // here we can access current
        for(let key in sudoku_gameHistory[current_step].numbers) {
            //console.log(key, sudoku_gameHistory[current_step].numbers[key]);
            let numberBox_el = document.querySelector(`.option[data-number="${key}"]`); // fortunately, it will NOT query rubber
            (sudoku_gameHistory[current_step].numbers[key] > 0)? numberBox_el.classList.remove('option-blank') : numberBox_el.classList.add('option-blank');
        }

    }

    const travelInTime = (newBoard, oldBoard) => {
        // get the second version
        console.warn(newBoard);
        console.log(oldBoard);
        //console.log([1, 2, 3, 4] === [1, 2, 3, 4], [1, 3, 2] === [1, 2, 3], [5, 3, 1] === [5, 3]);
        //const secondBoard = (playerAction === 'before')? 
        const modifiedTiles_cords = [];
        const tiles_previousValue = [];
        const tiles_newValue = [];

        for(let iir = 0; iir<9; iir++) {
            for(let iic = 0; iic<9; iic++) {
                if(newBoard[iir][iic] !== oldBoard[iir][iic]) {
                    //const tile_modified =  document.querySelector(`.tile[data-row="${iir}"][data-column="${iic}"]`);
                    modifiedTiles_cords.push({row: iir, column: iic});
                    tiles_previousValue.push(oldBoard[iir][iic]);
                    tiles_newValue.push(newBoard[iir][iic]);
                }
            }
        }

        repaintBoard(modifiedTiles_cords, tiles_previousValue, tiles_newValue); // uncomment when you update it to work for both "add" and "back" + "forth" player actions
        // TODO : work on above + apply cut mechanism when player make a move while travelling in time
        // TODO #2 : test if history travel works correctly + prepare a hisotry travel overriding stuff
    }

    const repaintBoard = (thisTile_cords, prevTileValue, newTileValue) => {

        // We are assuming that all function arguments are arrays + each arguments length is the same !
        const len = thisTile_cords.length;

        for(let no=0; no<len; no++) {
            let thisTile = document.querySelector(`.tile[data-row="${thisTile_cords[no].row}"][data-column="${thisTile_cords[no].column}"]`);
            console.log(typeof(prevTileValue[no]), typeof(newTileValue[no]))
            switch(typeof(prevTileValue[no])) {
                case 'object': {
                    switch(typeof(newTileValue[no])) {
                        case 'object': {
                            let allSubgrids = thisTile.querySelectorAll('div.xd');
                            const changedDigit = checkPencilmarkChange(prevTileValue[no], newTileValue[no]);
                            if(prevTileValue[no].length > newTileValue[no].length) {
                                allSubgrids[changedDigit - 1].textContent = ''
                            } else {
                                if(changedDigit) allSubgrids[changedDigit - 1].textContent = changedDigit;
                            }
    
                            break;
                        }
                        case 'string': {
                            removePencilmarkNodes(thisTile);
                            thisTile.textContent = '';
                            break;
                        }
                        case 'number': {
                            removeExtraPencilmarks(sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column]);
                            removePencilmarkNodes(thisTile);
                            thisTile.textContent = sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column];
                            break;
                        }
                        default: throw new Error(`Unknown type of new tile state value!  => ${typeof(newTileValue[no])}`);
                    }
                    break;
                }
                case 'string': {
                    switch(typeof(newTileValue[no])) {
                        case 'object': {
                            thisTile.textContent = '';
                            const nodesToUpdate = createPencilmarkNodes(thisTile, thisTile_cords[no].row, thisTile_cords[no].column);
                            nodesToUpdate.forEach(pencilmark_digit => thisTile.querySelector(`.no-${pencilmark_digit}`).textContent = parseInt(pencilmark_digit));
                            break;
                        }
                        case 'string': {
                            thisTile.textContent = '';
                            break;
                        }
                        case 'number': {
                            //console.error('str to str');
                            removeExtraPencilmarks(sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column]);
                            thisTile.textContent = sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column];
                            break;
                        }
                        default: throw new Error(`Unknown type of new tile state value!  => ${typeof(newTileValue[no])}`);
                    }
                    break;
                }
                case 'number': {
                    switch(typeof(newTileValue[no])) {
                        case 'object': {
                            thisTile.textContent = '';
                            const nodesToUpdate = createPencilmarkNodes(thisTile, thisTile_cords[no].row, thisTile_cords[no].column);
                            nodesToUpdate.forEach(pencilmark_digit => thisTile.querySelector(`.no-${pencilmark_digit}`).textContent = parseInt(pencilmark_digit));
                            break;
                        }
                        case 'string': {
                            thisTile.textContent = '';
                            break;
                        }
                        case 'number': {
                            removeExtraPencilmarks(sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column]);
                            thisTile.textContent = sudoku_gameHistory[thisCurrentStep].board[thisTile_cords[no].row][thisTile_cords[no].column];
                            break;
                        }
                        default: throw new Error(`Unknown type of new tile state value!  => ${typeof(newTileValue[no])}`);
                    }
                    break;
                }
                default: throw new Error(`Unexpected type of previous tile state value!  => ${typeof(prevTileValue[no])}`);
    
            }
        }

    }

    const checkPencilmarkChange = (prevTileValue, newTileValue) => {
        const [longerArr, shorterArr] = (prevTileValue.length > newTileValue.length)? [prevTileValue, newTileValue] : [newTileValue, prevTileValue];
        return longerArr.find(el => !shorterArr.includes(el)); 
    }

    const createPencilmarkNodes = (thisTile, row, column) => {
        let nodesToAddPencilmark = [];
        thisTile.classList.add('pencilmark_tile');
        // Append divs to pencilmark tile
        for(let x=1; x<=9; x++) {
            let el = document.createElement('div');
            //if(x === parseInt(sudoku_gameHistory[thisCurrentStep].board[row][column])) {nodeToAddPencilmark = el};
            el.classList.add('xd', `no-${x}`);
            thisTile.appendChild(el);
        }

        if(!Array.isArray(sudoku_gameHistory[thisCurrentStep].board[row][column])) { 
            nodesToAddPencilmark.push(sudoku_gameHistory[thisCurrentStep].board[row][column]);
        }   else {
            // it's array then
            for(let digit_ind = 0; digit_ind < sudoku_gameHistory[thisCurrentStep].board[row][column].length; digit_ind++) {
                nodesToAddPencilmark.push(sudoku_gameHistory[thisCurrentStep].board[row][column][digit_ind]);
            }
        }

        return nodesToAddPencilmark;
    }

    const removePencilmarkNodes = (thisTile) => {
        thisTile.classList.remove('pencilmark_tile');
        while(thisTile.childNodes.length) {
            thisTile.childNodes[thisTile.childNodes.length - 1].remove();
        }
    }

    const removeExtraPencilmarks = (digitUsed) => {
        if(!sudoku_gameHistory[thisCurrentStep].extraData[`removedPencilmarks_TileCords`].length) return;

        const tileCords = sudoku_gameHistory[thisCurrentStep].extraData[`removedPencilmarks_TileCords`];

        for(let x=0; x<tileCords.length; x++) {
            let currentTile = document.querySelector(`.tile[data-row="${tileCords[x].row}"][data-column="${tileCords[x].column}"]`);
            if(!sudoku_gameHistory[thisCurrentStep].board[tileCords[x].row][tileCords[x].column].length) {
                removePencilmarkNodes(currentTile);
            } else { currentTile.querySelector(`div.no-${digitUsed}`).textContent = ''; }
        }
    }

    const appendNumber = (e) => {
        appendNumber_v2(e);
        updateHistory_v2(e);

        return;
        if(e.target.classList.contains('numbers-box')) {return;}

        if(current_step !== step) {
            availableDigits_history.splice(current_step + 1);
            availableDigits = {...availableDigits_history[availableDigits_history.length - 1]};
        }

        if(!pencilmarks_Enabled) {
            if(active.classList.contains('pencilmark_tile')) {
                active.classList.remove('pencilmark_tile');
                while(active.childNodes.length) {
                    active.childNodes[active.childNodes.length - 1].remove();
                }
            }
            
            // History travel still causes errors... (bugs)

            if((!parseInt(e.target.textContent)) || (parseInt(active.textContent) === parseInt(e.target.textContent))) { // Erase or change number to exact same
                availableDigits[parseInt(active.textContent)]++;
            }
            else if(parseInt(active.textContent) !== parseInt(e.target.textContent)) {  // Change a digit into another
                availableDigits[parseInt(active.textContent)]++;
                availableDigits[parseInt(e.target.textContent)]--;
            }
            else { // Simply add a digit to an empty tile
                availableDigits[parseInt(e.target.textContent)]--;
            }

            // Push this availableDigits state into a availableDigits_history array
            delete availableDigits.NaN; // prevent from some weird error happenning, which appended key 'NaN' to an object
            let availableDigits_copy = JSON.parse(JSON.stringify({...availableDigits}));
            availableDigits_history.push(availableDigits_copy);

            // Finally, visually update used Digits' in numbers box
            //engine.switchAvailableDigits(availableDigits_history, availableDigits_history.length - 1, step);

            // Update board view (?)
            (parseInt(active.textContent) === parseInt(e.target.textContent)) ? active.textContent = '' : active.textContent = e.target.textContent;
            if(!parseInt(active.textContent)) {active.textContent = '';} // minor change when using rubber, prevents from bugs
        
        }
        else {

            if(active.classList.contains('pencilmark_tile')) {

                let availableDigits_copy = JSON.parse(JSON.stringify({...availableDigits}));
                availableDigits_history.push(availableDigits_copy);

                for(let ind=0; ind<active.childNodes.length; ind++) {
                    if(active.childNodes[ind].classList.contains(`no-${parseInt(e.target.textContent)}`)) {
                        if(active.childNodes[ind].textContent) {
                            active.childNodes[ind].textContent = '';
                        }
                        else {
                            active.childNodes[ind].textContent = e.target.textContent;
                        }
                    }
                }
            }
            else {
    
                if(parseInt(active.textContent)) { // Change from an existing digit into a pencilmark tile
                    availableDigits[parseInt(active.textContent)]++;
                }

                delete availableDigits.NaN; // prevent from some weird error happenning, which appended key 'NaN' to an object
                let availableDigits_copy = JSON.parse(JSON.stringify({...availableDigits}));
                availableDigits_history.push(availableDigits_copy);
    
                // Finally, visually update used Digits' in numbers box
                //engine.switchAvailableDigits(availableDigits_history, availableDigits_history.length - 1, step);
                
                active.textContent = '';
                active.classList.add('pencilmark_tile');
                // Append divs to pencilmark tile
                for(let x=1; x<=9; x++) {
                    let el = document.createElement('div');
                    if(x === parseInt(e.target.textContent)) {el.textContent = e.target.textContent};
                    el.classList.add('xd', `no-${x}`);
                    active.appendChild(el);
                }
            }
        }

        // Błąd pojawia się, gdy np. zrobimy 2 ruchy, klikniemy "cofnij" a potem "ponów" i wykonamy jakąś turę (!) = probably solved
        //console.log(availableDigits);
        //console.log(availableDigits_history);

        anime({
            targets: active,
            duration: 1000,
            color: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`], // props.difficulty 💡
            easing: 'linear',
        })

        anime({
            targets: e.target,
            duration: 1100,
            background: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`],  // props.difficulty 💡
            easing: 'easeOutSine',
            direction: 'alternate',
        })

    }

    const updateHistory = (e) => {
        //return; // disable this function and prepare a replacement one !
        return;

        let activeTileOrder = parseInt(active.dataset['order']);
        const activeTile_Row = Math.floor((activeTileOrder - 1) / 9);
        const activeTile_Col = ((activeTileOrder - 1) % 9);

        if(current_step !== step) {
            game_History.splice(current_step + 1);
            activeTiles_History.splice(current_step + 1);
            currentHistory.history = game_History[game_History.length - 1];
        }
  
        let currentHistory_copy = JSON.parse(JSON.stringify(currentHistory));

        if(pencilmarks_Enabled) {
            if(active.classList.contains('pencilmark_tile')) {
                
                if(typeof(game_History[current_step][activeTile_Row][activeTile_Col]) === 'object') {
                    // Pencilmark tile into pencilmark tile
                    if(game_History[current_step][activeTile_Row][activeTile_Col].includes(parseInt(e.target.textContent))) {
                        let ind = game_History[current_step][activeTile_Row][activeTile_Col].indexOf(parseInt(e.target.textContent));
                        currentHistory_copy.history[activeTile_Row][activeTile_Col].splice(ind, 1);
                        if(!currentHistory_copy.history[activeTile_Row][activeTile_Col].length) {
                            currentHistory_copy.history[activeTile_Row][activeTile_Col] = '';
                        }
                    } else {
                        currentHistory_copy.history[activeTile_Row][activeTile_Col].push(parseInt(e.target.textContent));
                    }
                }

                else {
                    // Single digit into pencilmark
                    currentHistory_copy.history[activeTile_Row][activeTile_Col] = [];
                    currentHistory_copy.history[activeTile_Row][activeTile_Col].push(parseInt(e.target.textContent));
                }

                // If we have multiple elems pencilmark tile, sort'em
                if(typeof(currentHistory_copy.history[activeTile_Row][activeTile_Col]) === 'object') {
                    currentHistory_copy.history[activeTile_Row][activeTile_Col].sort();
                }

            }
            else {
                // This else statement will never happen
            }
        }
        else {
            if(currentHistory_copy.history[activeTile_Row][activeTile_Col] === parseInt(e.target.textContent)) {
                currentHistory_copy.history[activeTile_Row][activeTile_Col] = '';
            } else{
                parseInt(e.target.textContent)? currentHistory_copy.history[activeTile_Row][activeTile_Col] = parseInt(e.target.textContent) : currentHistory_copy.history[activeTile_Row][activeTile_Col] = '';
                engine.removeOutDatedPencilmarks(currentHistory_copy.history, activeTile_Row, activeTile_Col, parseInt(e.target.textContent));
            }
        }
        
        game_History.push(currentHistory_copy.history);
        currentHistory.history = currentHistory_copy.history;

        //Update active's history
        activeTiles_History.push(parseInt(active.dataset.order));

        if(current_step !== step) {
            // If we override history
            setStep(current_step + 1);
            setCurrentStep(current_step + 1);
            
        } else {
            // Normal behaviour
            setStep(step + 1);
            setCurrentStep(current_step + 1);
        }

        // Check winning condition
        checkSudokuSolved(game_History[game_History.length - 1], success_board);

        //console.log(game_History.length, availableDigits_history.length);
    }    

    const checkSudokuSolved = (current_board, win_board) => {
        const isSudokuSolved = checkIfSolved(current_board, win_board);

        if(isSudokuSolved) {
            dispatch(stopTimer(true));
            dispatch(sudokuSolved(true));
        }

        function checkIfSolved(current_board, win_board) {
            for(let row_no = 0; row_no < 9; row_no++) {
                for(let col_no = 0; col_no < 9; col_no++) {
                    if((parseInt(current_board[row_no][col_no]) !== parseInt(win_board[row_no][col_no])) ||
                      (typeof(current_board[row_no][col_no]) === 'object')) 
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }


    const resetSudoku = () => {
        dispatch(RESET_STATE());
        setTimeout(() => { // helpful, because it prevents player for spamming reset button for too much
            //setNewSudokuLoading(1);
            dispatch(addExtraView({extraViewName: 'loading'}))
        }, 350)

    }

    const conditionsPassed = (e) => {
        if(active && !e.target.parentNode.classList.contains('palette') &&  (!(isPencilmarkEnabled && !e.target.dataset['number'])) && (!(!parseInt(active.textContent) && !e.target.dataset['number']))) {
            // TO DO
            if(parseInt(e.target.dataset['number']) === 0) {
                // It handles all the rubber functionality and exceptions
                return (isPencilmarkEnabled)?
                    false
                    :
                    Boolean(parseInt(sudoku_gameHistory[thisCurrentStep].board[active.dataset['row']][active.dataset['column']]))?
                        true
                        :
                        false
            }
            return true;
        }
        return false;
    }

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Important for lower-sized devices !
        if(extra_view === 'loading' /* newSudokuLoading !== 0 */) {
            //dispatch(addExtraView({extraViewName: 'loading'}));
            // 1. Make some cleanups first !
            setActive(0);
            setStep(0);
            //setconfirmReset(false); => redux will handle that
            //setSudokuSolved(false); => we will look for redux replacement for this one
            setCurrentStep(0);
            setHistoryTravel(0);
            setTime([0, 0, 0]);
            //setStopTimer(false);
            engine.resetSudoku(final_Difficulty);
            game_History = [];
            activeTiles_History = [];
            availableDigits = {};
            availableDigits_history = [];
            engine.cleanBlankNumberBoxes();
    
            setPencilMarksEnabled(false);
            tools['pencil'].isActive = false;
            let pencilmark = document.querySelector('.pencilmark_on');
            if(pencilmark) {pencilmark.classList.remove('pencilmark_on')}

            engine.resetHighlightEffect(props);
            engine.setBoard();
            let difficulty;

            // Interval use
            const timeOut = setTimeout(fireAsync, 100);
            const loadingInterval = setInterval(checkAsyncCompletion, 200);

            function fireAsync() {
                difficulty = engine.hideDigits(queried_difficulty, theme);
                clearTimeout(timeOut);
            }

            function checkAsyncCompletion() {
                if(typeof(difficulty) === 'string' || typeof(difficulty) === null) {
                    setFinalDifficulty(difficulty);
                    init();

                    async function init() {
                        await fadeOut()
                            .then(() => {
                                clearInterval(loadingInterval);
                                //setNewSudokuLoading(0);
                                dispatch(addExtraView({extraViewName: ''}))
                                // Create game history
                                const history = engine.createInitialGameHistory();
                                availableDigits = engine.reduceAvailableDigits(history);
                                currentHistory.history = history;
                                if(!game_History.length) {
                                    availableDigits_history.push(availableDigits);
                                    game_History.push(history);

                                    // v2 below :
                                    console.error(success_board);
                                    dispatch(stopTimer(false));
                                    dispatch(defineSuccessBoard({ board: success_board}));
                                    dispatch(initializeGameHistory({history, availableDigits}));
                                }

                                engine.applyInitials(theme);
                            })
                    } 

                    async function fadeOut() {
                        const a1 = anime({
                            targets: '.loading',
                            duration: 450,
                            opacity: 0,
                            easing: 'linear',
                        
                        }).finished;

                        const a2 = anime({
                            targets: ['.loading-text', '.loading-spinner'],
                            duration: 400,
                            background: '#000',
                            color: '#000',
                            easing: 'linear',
                        }).finished;

                        await Promise.all([a1, a2]);
                    }
                }
            }
        }
    }, [extra_view])

    // Perform engine operations
    useLayoutEffect(() => {
        //setNewSudokuLoading(1);
        dispatch(addExtraView({extraViewName: 'loading'}));
        return () => {}
    }, []);

    useEffect(() => {
        engine.setInitialClassToChosenTiles(props);
    }, [final_Difficulty])

/*     useEffect(() => {
        console.log('extra view is: ',  extra_view)
        if(extra_view === 'info') {
           // setStopTimer(!stopTimer);
            dispatch(stopTimer(true)); // CAN STOP AND UNSTOP TIMER !
        }
        //if(app_view !== '' !checkInfo ) {
            //document.body.style.overflow = 'auto';
        //}
    }, [extra_view]) */

    useEffect(() => {
        if(pencilmarks_Enabled === true) {
            anime({
                targets: rubber.current,
                duration: 800,
                backgroundColor: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`], // props.difficulty 💡
                easing: 'easeInSine',
                border: `${difficultyColors[theme][final_Difficulty]}`,  
                opacity: .5,
            })
        } else {
            anime({
                targets: rubber.current,
                duration: 800,
                backgroundColor: [`#000`], // props.difficulty 💡
                easing: 'easeOutSine',
                border: 'none',
                opacity: 0,
            })
        }
    }, [pencilmarks_Enabled]);

/*     useEffect(() => {
        // will no longer happen after our rework
        if(step > 0) { // Prevents from initial fire when component is being rendered
           // engine.travelInTime(current_step, game_History, activeTiles_History, setActive, final_Difficulty, props);
           // availableDigits = engine.switchAvailableDigits(availableDigits_history, current_step, step);
        }
    }, [history_travel]) */

    return (
        <div className={`sudoku-${theme} sudoku-main`} ref={sudoku}>
            <div className={`all all-${theme}`} ref={all}>
                <div className="sudoku-title">
                    Sudoku {final_Difficulty}
                </div>
                {extras['timer'].isEnabled === true && (
                    <Timer setTime={setTime} hours={hours} minutes={minutes} seconds={seconds} />
                )}
                <div className="game-elems">
                    <Toolbox difficulty={final_Difficulty} theme={theme} handlePencilmarks={setPencilMarksEnabled} isEnabled={pencilmarks_Enabled} 
                            changeCurrentStep={setCurrentStep} currentStep={current_step} maxStep={step} travel={history_travel} historyTravel={setHistoryTravel}
                            /* setCheckInfo={setCheckInfo} */ /* setStopTimer={setStopTimer} */
                    />
                    <div className="sudoku-map">
                        <div className="sudoku-board" ref={board} onClick={(e) => {checkMarkTileConditions(e)}} difficulty={final_Difficulty} theme={theme} >
                            {allSquares}
                        </div>
                    </div>
                    <div className="palette">
                        <div className={`numbers-box numbers-${theme}-${final_Difficulty}`} ref={numbox} onClick={(e) => { if(conditionsPassed(e)) { dispatch(updatePlayerAction({action_type: 'add'})); appendNumber(e); updateHistory(e); } }}>
                            <div data-number="1" className="option option-1"> 1 </div>
                            <div data-number="2" className="option option-2"> 2 </div>
                            <div data-number="3" className="option option-3"> 3 </div>
                            <div data-number="4" className="option option-4"> 4 </div>
                            <div data-number="5" className="option option-5"> 5 </div>
                            <div data-number="6" className="option option-6"> 6 </div>
                            <div data-number="7" className="option option-7"> 7 </div>
                            <div data-number="8" className="option option-8"> 8 </div>
                            <div data-number="9" className="option option-9"> 9 </div>
                            <div data-number="0" className="option option-0" ref={rubber}>  </div>
                        </div> 
                    </div>
                </div>

                <div className="new-sudoku-box">
                    <div className={`new-sudoku new-sudoku-${theme}-${final_Difficulty}`} onClick={() => { if(step <= 0) { resetSudoku() } else { dispatch(addExtraView({extraViewName: 'reset'}))/* setconfirmReset(true); */ } } } > New Sudoku </div>
                </div>

                {extra_view === 'info' /* checkInfo === true */ && (
                    <Info theme={theme} finalDifficulty={final_Difficulty} /* checkInfo={checkInfo} setCheckInfo={setCheckInfo} */ /* setStopTimer={setStopTimer} */ />
                )}

                {extra_view === 'reset' /* confirmReset === true */ && (
                    <Reset theme={theme} /* setconfirmReset={setconfirmReset} */ proceedReset={resetSudoku} />
                )}

                {extra_view === 'loading' /* newSudokuLoading === 1 */ && (
                    <Loading theme={theme} />
                )}

                {sudoku_solved === true && (
                    <Win theme={theme} final_difficulty={final_Difficulty} getNewSudoku={resetSudoku} goHome={() => {dispatch(changeView({newViewName: 'landing'}))}} isTimeEnabled={props.options['timer']} time={[hours, minutes, seconds]} />
                )}

            </div>
        </div>
    );
}

export default Sudoku;