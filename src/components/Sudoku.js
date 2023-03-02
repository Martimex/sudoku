import { useLayoutEffect, useEffect, useRef, useState } from "react";
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

let isGameHistoryInitialized = false; // Do not removethis variable, since it keeps track of rendering game history just once

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

function Sudoku() {

    // 💡 final_Difficulty should be replaced by props.difficulty, once a not-random pick-up Sudoku generating mechanism would be implemented
    const dispatch = useDispatch();

    const queried_difficulty = useSelector(state => state.options.difficulty);
    const theme = useSelector(state => state.options.theme);
    const extras = useSelector(state => state.options.extras);
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

    const [[hours, minutes, seconds], setTime] = useState([0, 0, 0]);  // used for Timer Component  - we'll keep this one !

    const sudoku = useRef(null);
    const all = useRef(null);
    const board = useRef(null);
    const numbox = useRef(null);
    const rubber = useRef(null);

/*     let renderArray = [];
    
    for(let i=0; i<(squareRows * squareColumns); i++) {
        renderArray.push('');
    } */

    const allSquares = Array.from(new Array(squareRows * squareColumns)).map((square, index) => 
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

    const updateHistory = (e) => {
        // ORDER STRICTLY IMPORTANT !

        if(thisStep !== thisCurrentStep) {
            dispatch(overRideHistory());
        }

        dispatch(updateGameHistory({
            tileRow: active.dataset['row'],
            tileColumn: active.dataset['column'],
            digit: (parseInt(e.target.dataset['number']) === 0)? '': parseInt(e.target.dataset['number']), // conditional only for rubber purposes
            // isPencilmarkOn can be omitted since our state control this variable
        }))
        
        dispatch(increaseSteps());
    }

    useEffect(() => {
        // repaint Board

        if(thisStep <= 0) { return; }

        const current_step = sudoku_state.currentStep;
        const viewedBoard = sudoku_state.gameHistory[current_step].board;

        const {row, column} =  sudoku_gameHistory[current_step].targetTile;

        // setActiveCursor
        markTile(document.querySelector(`.tile[data-row="${row}"][data-column="${column}"]`));

        checkNumberBoxUpdates();
        updateDigitConflicts();

        if(sudoku_state.playerAction !== 'add') {
            // so it's either back or forth
            const boardToCompare = (sudoku_state.playerAction !== 'back')? sudoku_state.gameHistory[current_step - 1].board : sudoku_state.gameHistory[current_step + 1].board;
            travelInTime(viewedBoard, boardToCompare);
            return;
        }

        const prevTileValue = sudoku_gameHistory[thisCurrentStep - 1].board[row][column];
        const newTileValue = sudoku_gameHistory[thisCurrentStep].board[row][column];

        repaintBoard([{row: row, column: column}], [prevTileValue], [newTileValue]);

        // Lastly, check if Sudoku is solved
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
    }, [thisCurrentStep]);

    const checkNumberBoxUpdates = () => {
        // Update number box buttons visually whenever player uses all possible digits or retrieve one of those

        const current_step = sudoku_state.currentStep;
        for(let key in sudoku_gameHistory[current_step].numbers) {
            let numberBox_el = document.querySelector(`.option[data-number="${key}"]`); // fortunately, it will NOT query rubber
            (sudoku_gameHistory[current_step].numbers[key] > 0)? numberBox_el.classList.remove('option-blank') : numberBox_el.classList.add('option-blank');
        }

    }

    const updateDigitConflicts = () => {
        removeDigitConflicts(); // uncomment later on
        markDigitConflicts();
    }

    const removeDigitConflicts = () => {
        for(let row = 0; row < 9; row++) {
            for(let col = 0; col < 9; col++) {
                document.querySelector(`.tile[data-row="${row}"][data-column="${col}"]`).classList.remove(`conflict-tile__${final_Difficulty}--${theme}`);
            }
        }
    }

    const markDigitConflicts = () => {
        for(let key=1; key<=Object.keys(sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`]).length; key++) { // key = 1 to 9
            if(sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key].length) {
                //console.warn(sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key]);
                for(let conflict_no = 0; conflict_no<sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key].length; conflict_no++) {
                    let [creator_row, creator_column] = [sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key][conflict_no].creator[`row`],
                        sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key][conflict_no].creator[`column`]];
                    // add creator color
                    document.querySelector(`.tile[data-row="${creator_row}"][data-column="${creator_column}"]`).classList.add(`conflict-tile__${final_Difficulty}--${theme}`);
                
                    for(let member_no = 0; member_no < sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key][conflict_no].members.length; member_no++) {
                        let [member_row, member_column] = [sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key][conflict_no].members[member_no][`row`],
                            sudoku_gameHistory[thisCurrentStep].extraData[`digitConflicts`][key][conflict_no].members[member_no][`column`]]
                        // add member color
                        document.querySelector(`.tile[data-row="${member_row}"][data-column="${member_column}"]`).classList.add(`conflict-tile__${final_Difficulty}--${theme}`);
                    }       
                }
            }
        }
    }

    const travelInTime = (newBoard, oldBoard) => {
        // get the second version

        const modifiedTiles_cords = [];
        const tiles_previousValue = [];
        const tiles_newValue = [];

        for(let iir = 0; iir<9; iir++) {
            for(let iic = 0; iic<9; iic++) {
                if(newBoard[iir][iic] !== oldBoard[iir][iic]) {
                    modifiedTiles_cords.push({row: iir, column: iic});
                    tiles_previousValue.push(oldBoard[iir][iic]);
                    tiles_newValue.push(newBoard[iir][iic]);
                }
            }
        }

        repaintBoard(modifiedTiles_cords, tiles_previousValue, tiles_newValue);
    }

    const repaintBoard = (thisTile_cords, prevTileValue, newTileValue) => {

        // We are assuming that all function arguments are arrays + each arguments length is the same !
        const len = thisTile_cords.length;

        for(let no=0; no<len; no++) {
            let thisTile = document.querySelector(`.tile[data-row="${thisTile_cords[no].row}"][data-column="${thisTile_cords[no].column}"]`);
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
            el.classList.add('xd', `no-${x}`);
            thisTile.appendChild(el);
        }

        if(!Array.isArray(sudoku_gameHistory[thisCurrentStep].board[row][column])) { 
            nodesToAddPencilmark.push(sudoku_gameHistory[thisCurrentStep].board[row][column]);
        } else {
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

    const checkSudokuSolved = (current_board, win_board) => {
        const isSudokuSolved = checkIfSolved(current_board, win_board);

        if(isSudokuSolved) {
            dispatch(stopTimer(true));
            dispatch(sudokuSolved(true));
            dispatch(addExtraView({extraViewName: 'win'}));
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
            dispatch(addExtraView({extraViewName: 'loading'}))
        }, 350)

    }

    const conditionsPassed = (e) => {
        if(active && !e.target.parentNode.classList.contains('palette') &&  (!(isPencilmarkEnabled && !e.target.dataset['number'])) && (!(!parseInt(active.textContent) && !e.target.dataset['number']))) {
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
        if(extra_view === 'loading') {
            // 1. Make some cleanups first !
            setActive(0);
            setTime([0, 0, 0]);

            engine.resetSudoku(final_Difficulty);
            isGameHistoryInitialized = false;

            engine.cleanBlankNumberBoxes();
    
            tools['pencil'].isActive = false;
            let pencilmark = document.querySelector('.pencilmark_on');
            if(pencilmark) {pencilmark.classList.remove('pencilmark_on')}

            engine.resetHighlightEffect(theme);
            engine.setBoard();
            let difficulty;

            // Interval use
            const timeOut = setTimeout(fireAsync, 100);
            const loadingInterval = setInterval(checkAsyncCompletion, 200);

            function fireAsync() {
                difficulty = engine.hideDigits(queried_difficulty, theme);
                clearTimeout(timeOut);

                // Last but not least - force a full screen mode
                document.documentElement.requestFullscreen();
            }

            function checkAsyncCompletion() {
                if(typeof(difficulty) === 'string' || typeof(difficulty) === null) {
                    setFinalDifficulty(difficulty);
                    init();

                    async function init() {
                        await fadeOut()
                            .then(() => {
                                clearInterval(loadingInterval);
                                dispatch(addExtraView({extraViewName: ''}))
                                // Create game history
                                const history = engine.createInitialGameHistory();
                                let availableDigits = engine.reduceAvailableDigits(history);

                                if(!isGameHistoryInitialized) {
                                    isGameHistoryInitialized = true;
                                    // v2 below :
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

        else if(extra_view) {
            // If there is a top-level extra window layer
            document.body.style.overflowY = 'hidden';
        }

        else if(!extra_view) {
            // When user closes extra window
            document.body.style.overflowY = 'auto';
        }

    }, [extra_view])

    // Perform engine operations
    useLayoutEffect(() => {
        dispatch(addExtraView({extraViewName: 'loading'}));
        return () => {}
    }, []);

    useEffect(() => {
        engine.setInitialClassToChosenTiles(theme);
    }, [final_Difficulty])

    useEffect(() => {
        if(isPencilmarkEnabled === true) {
            anime({
                targets: rubber.current,
                duration: 800,
                //backgroundColor: [`#0000`, `${difficultyColors[theme][final_Difficulty]}`], // props.difficulty 💡
                easing: 'easeInSine',
                //border: `${difficultyColors[theme][final_Difficulty]}`,
                opacity: 0,
            })
        } else {
            anime({
                targets: rubber.current,
                duration: 800,
                //backgroundColor: [`#000`], // props.difficulty 💡
                easing: 'easeOutSine',
                opacity: 1,
            })
        }
    }, [isPencilmarkEnabled]);

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
                    <Toolbox difficulty={final_Difficulty} theme={theme} />
                    <div className="sudoku-map">
                        <div className="sudoku-board" ref={board} onClick={(e) => {checkMarkTileConditions(e)}} difficulty={final_Difficulty} theme={theme} >
                            {allSquares}
                        </div>
                    </div>
                    <div className="palette">
                        <div className={`numbers-box numbers-${theme}-${final_Difficulty}`} ref={numbox} onClick={(e) => { if(conditionsPassed(e)) { dispatch(updatePlayerAction({action_type: 'add'})); updateHistory(e); } }}>
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
                    <div className={`new-sudoku new-sudoku-${theme}-${final_Difficulty}`} onClick={() => { if(thisStep <= 0) { resetSudoku() } else { dispatch(addExtraView({extraViewName: 'reset'})) } } } > New Sudoku </div>
                </div>

                {extra_view === 'info' && (
                    <Info theme={theme} finalDifficulty={final_Difficulty} />
                )}

                {extra_view === 'reset' && (
                    <Reset theme={theme} proceedReset={resetSudoku} />
                )}

                {extra_view === 'loading' && (
                    <Loading theme={theme} />
                )}

                {sudoku_solved === true && (
                    <Win theme={theme} final_difficulty={final_Difficulty} getNewSudoku={resetSudoku} goHome={() => {dispatch(changeView({newViewName: 'landing'}))}} time={[hours, minutes, seconds]} />
                )}

            </div>
        </div>
    );
}

export default Sudoku;