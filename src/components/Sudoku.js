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

    const squareRows = 3;
    const squareColumns = 3;
    const rows = 9;
    const columns = 9;

    const [active, setActive] = useState(0); // stores a DOM element (more specifically a non-initial tile) that user has clicked recently
    const [final_Difficulty, setFinalDifficulty] = useState(null); // what's the sudoku finalDifficulty
    const [pencilmarks_Enabled, setPencilMarksEnabled] = useState(false); // checks whether player turned pencilmark mode ON (toolbox spec.)
    const [step, setStep] = useState(0); // determines no of action (would enable to travel in time regarding board progress)
    const [current_step, setCurrentStep] = useState(0); // determines current step no - also the one currently browsed by player
    const [history_travel, setHistoryTravel] = useState(0); // it's only use to trigger stuff properly, it's an artificial state, but dont remove it !
    const [sudoku_solved, setSudokuSolved] = useState(false); // indicates whether Sudoku has been Solved or not (boolean)

    const [checkInfo, setCheckInfo] = useState(false);         // should we set Check Info screen ?
    const [confirmReset, setconfirmReset] = useState(false);   // should we set Reset Confirmation screen ?
    const [newSudokuLoading, setNewSudokuLoading] = useState(0); // should we set Sudoku Loading screen ?

    const [[hours, minutes, seconds], setTime] = useState([0, 0, 0]);  // used for Timer Component 
    const [stopTimer, setStopTimer] = useState(false);  // shall we stop the timer now ?

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
        <Square key={index.toString()} id={index} theme={props.theme} difficulty={final_Difficulty}
         mainRows={rows} mainColumns={columns} squareRows={squareRows} squareColumns={squareColumns} />
    );

    const markTile = (e) => {
        if((e.target.classList.contains('tile')) && (!e.target.classList.contains('initial'))) {
            if(active) { active.classList.remove('active'); }
            setActive(e.target);
            e.target.classList.add('active');

            if(props.options['backlit']) {
                engine.resetHighlightEffect(props);
                engine.applyHighlightEffect(e.target, final_Difficulty, props);
            }
        }
    }

    const appendNumber = (e) => {

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
            engine.switchAvailableDigits(availableDigits_history, availableDigits_history.length - 1, step);

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
                engine.switchAvailableDigits(availableDigits_history, availableDigits_history.length - 1, step);
                
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
            color: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`], // props.difficulty 💡
            easing: 'linear',
        })

        anime({
            targets: e.target,
            duration: 1100,
            background: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`],  // props.difficulty 💡
            easing: 'easeOutSine',
            direction: 'alternate',
        })

    }

    const updateHistory = (e) => {
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
            setStopTimer(true);
            setSudokuSolved(true);
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
        setTimeout(() => { // helpful, because it prevents player for spamming reset button for too much
            setNewSudokuLoading(1);
        }, 350)

    }

    const conditionsPassed = (e) => {
        if(active && !e.target.parentNode.classList.contains('palette') &&  (!(pencilmarks_Enabled && !parseInt(e.target.textContent))) && (!(!parseInt(active.textContent) && !parseInt(e.target.textContent)))) {
            return true;
        } else return false;
    }

    useEffect(() => {
        document.body.style.overflow = 'auto'; // Important for lower-sized devices !
        if(newSudokuLoading !== 0) {
            // 1. Make some cleanups first !
            setActive(0);
            setStep(0);
            setconfirmReset(false);
            setSudokuSolved(false);
            setCurrentStep(0);
            setHistoryTravel(0);
            setTime([0, 0, 0]);
            setStopTimer(false);
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
                difficulty = engine.hideDigits(props);
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
                                setNewSudokuLoading(0);
                                // Create game history
                                const history = engine.createInitialGameHistory();
                                availableDigits = engine.reduceAvailableDigits(history);
                                currentHistory.history = history;
                                if(!game_History.length) {
                                    availableDigits_history.push(availableDigits);
                                    game_History.push(history);
                                }

                                engine.applyInitials(props.theme);
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
    }, [newSudokuLoading])

    // Perform engine operations
    useLayoutEffect(() => {
        setNewSudokuLoading(1);
        return () => {}
    }, []);

    useEffect(() => {
        engine.setInitialClassToChosenTiles(props);
    }, [final_Difficulty])

    useEffect(() => {
        setStopTimer(!stopTimer);
        if(!checkInfo) {
            document.body.style.overflow = 'auto';
        }
    }, [checkInfo])

    useEffect(() => {
        if(pencilmarks_Enabled === true) {
            anime({
                targets: rubber.current,
                duration: 800,
                backgroundColor: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`], // props.difficulty 💡
                easing: 'easeInSine',
                border: `${difficultyColors[props.theme][final_Difficulty]}`,  
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

    useEffect(() => {
        if(step > 0) { // Prevents from initial fire when component is being rendered
            engine.travelInTime(current_step, game_History, activeTiles_History, setActive, final_Difficulty, props);
            availableDigits = engine.switchAvailableDigits(availableDigits_history, current_step, step);
        }
    }, [history_travel])

    return (
        <div className={`sudoku-${props.theme} sudoku-main`} ref={sudoku}>
            <div className={`all all-${props.theme}`} ref={all}>
                <div className="sudoku-title">
                    Sudoku {final_Difficulty}
                </div>
                {props.options['timer'] === true && (
                    <Timer theme={props.theme} finalDifficulty={final_Difficulty} setTime={setTime} hours={hours} minutes={minutes} seconds={seconds} stopTimer={stopTimer} />
                )}
                <div className="game-elems">
                    <Toolbox difficulty={final_Difficulty} theme={props.theme} handlePencilmarks={setPencilMarksEnabled} isEnabled={pencilmarks_Enabled} 
                            changeCurrentStep={setCurrentStep} currentStep={current_step} maxStep={step} travel={history_travel} historyTravel={setHistoryTravel}
                            setCheckInfo={setCheckInfo} setStopTimer={setStopTimer}
                    />
                    <div className="sudoku-map">
                        <div className="sudoku-board" ref={board} onClick={(e) => {markTile(e)}} difficulty={final_Difficulty} theme={props.theme} >
                            {allSquares}
                        </div>
                    </div>
                    <div className="palette">
                        <div className={`numbers-box numbers-${props.theme}-${final_Difficulty}`} ref={numbox} onClick={(e) => { if(conditionsPassed(e)) { appendNumber(e); updateHistory(e); } }}>
                            <div className="option option-1"> 1 </div>
                            <div className="option option-2"> 2 </div>
                            <div className="option option-3"> 3 </div>
                            <div className="option option-4"> 4 </div>
                            <div className="option option-5"> 5 </div>
                            <div className="option option-6"> 6 </div>
                            <div className="option option-7"> 7 </div>
                            <div className="option option-8"> 8 </div>
                            <div className="option option-9"> 9 </div>
                            <div className="option option-0" ref={rubber}>  </div>
                        </div> 
                    </div>
                </div>

                <div className="new-sudoku-box">
                    <div className={`new-sudoku new-sudoku-${props.theme}-${final_Difficulty}`} onClick={() => { if(step <= 0) { resetSudoku() } else { setconfirmReset(true); } } } > New Sudoku </div>
                </div>

                {checkInfo === true && (
                    <Info theme={props.theme} finalDifficulty={final_Difficulty} checkInfo={checkInfo} setCheckInfo={setCheckInfo} setStopTimer={setStopTimer} />
                )}

                {confirmReset === true && (
                    <Reset theme={props.theme} setconfirmReset={setconfirmReset} proceedReset={resetSudoku} />
                )}

                {newSudokuLoading === 1 && (
                    <Loading theme={props.theme} />
                )}

                {sudoku_solved === true && (
                    <Win theme={props.theme} final_difficulty={final_Difficulty} getNewSudoku={resetSudoku} goHome={props.backToLanding} isTimeEnabled={props.options['timer']} time={[hours, minutes, seconds]} />
                )}

            </div>
        </div>
    );
}

export default Sudoku;