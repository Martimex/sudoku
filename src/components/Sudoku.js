import { render } from "@testing-library/react";
import react, { useLayoutEffect, useEffect, useRef, createRef, useState } from "react";
import App from '../App';
import Landing from "../Landing";
import Square from "./Square";
import Palette from "./Palette";
import Toolbox from './Toolbox';
import '../styles/sudoku.css';
import engine from '../addons/engine.js';

import anime from 'animejs/lib/anime.es.js';
import { act } from "react-dom/test-utils";

const basics = {
    squareRows: 3,
    squareColumns: 3,
    rows: 9,
    columns: 9,
}

const currentHistory = {
    history: [],
};

const game_History = [];

const difficultyColors = {
    day: {
        easy: 'hsl(116, 35%, 45%)',
        medium: 'hsl(55, 35%, 45%)',
        hard: 'hsl(12, 35%, 45%)',
        master: 'hsl(182, 35%, 45%)',
    },
    
    night: {
        easy: 'hsl(116, 65%, 45%)',
        medium: 'hsl(55, 65%, 45%)',
        hard: 'hsl(12, 65%, 45%)',
        master: 'hsl(182, 65%, 45%)',
    }

}

function Sudoku(props) {

    // final_Difficulty should be replaced by props.difficulty, once a not-random pick-up Sudoku generating mechanism would be implemented

    const squareRows = 3;
    const squareColumns = 3;
    const rows = 9;
    const columns = 9;

    const [active, setActive] = useState(0);
    const [final_Difficulty, setFinalDifficulty] = useState(null);
    const [pencilmarks_Enabled, setPencilMarksEnabled] = useState(false);
    //const [game_History, setGameHistory] = useState([]);
    const [step, setStep] = useState(0); // determines no of action (would enable to travel in time regarding board progress)
    const [current_step, setCurrentStep] = useState(0); // determines current step no - also the one currently browsed by player
    const [history_travel, setHistoryTravel] = useState(0); // it's only use to trigger stuff properly, it's an artificial state, but dont remove it !

    const sudoku = useRef(null);
    const all = useRef(null);
    const board = useRef(null);
    const numbox = useRef(null);
    const rubber = useRef(null);
    const paletteRef = createRef();
    
    const mainGridStyle = {gridTemplateRows: `repeat(${squareRows}, 7rem)`, gridTemplateColumns: `repeat(${squareColumns}, 7rem)`}

    let renderArray = [];
    
    for(let i=0; i<(squareRows * squareColumns); i++) {
        renderArray.push('');
    }

    const allSquares = renderArray.map((square, index) => 
        <Square key={index.toString()} id={index} theme={props.theme} difficulty={final_Difficulty}
         mainRows={rows} mainColumns={columns} squareRows={squareRows} squareColumns={squareColumns} />
    );

    function interact(e) {
        console.log(e.target.textContent);
        if(!e.target.textContent) {
            e.target.textContent = '';
            /* console.log('Palette TOP | LEFT ');
            console.log(paletteRef.current.offsetTop);
            console.log(paletteRef.current.offsetLeft);
            console.log('---------------------');
            console.log('Click tile TOP | LEFT ');
            console.log(e.target.offsetTop);
            console.log(e.target.offsetLeft); */

            /* PERFORM CALCULATIONS */
            const shadowPalette = paletteRef.current.parentNode;
            shadowPalette.style.display = "block";

            const palette_width = paletteRef.current.offsetWidth;
            const palette_height = paletteRef.current.offsetHeight;

            const target_offset_left = e.target.offsetLeft;
            const target_offset_top = e.target.offsetTop;

            console.log(`W: ${palette_width} |  H: ${palette_height}`);
            console.log(`transfer_L: ${target_offset_left} |  transfer_T: ${target_offset_top}`);

            if((target_offset_left - (palette_width / 2)) < 0) { // if overlaps left
                const diff = ((target_offset_left - (palette_width / 2)) * (-1));
                console.log(diff);
                paletteRef.current.style.cssText = `display: grid; left:${(target_offset_left - (palette_width / 2) + diff)}px; top:${(target_offset_top + (palette_height / 2))}px;`;
            } 
            else if((target_offset_left + (palette_width / 2)) > all.current.offsetWidth) {  // if overlaps right
                const diff = ((target_offset_left + (palette_width / 2)) - all.current.offsetWidth);
                console.log('diff: ', diff);
                paletteRef.current.style.cssText = `display: grid; left:${(target_offset_left - (palette_width / 2) - diff)}px; top:${(target_offset_top + (palette_height / 2))}px;`;
            }
            else {
                paletteRef.current.style.cssText = `display: grid; left:${(e.target.offsetLeft - (paletteRef.current.offsetWidth / 2))}px; top:${(target_offset_top + (palette_height / 2))}px;`;
            }
           
            //paletteRef.current.setAttribute('offsetLeft', e.target.offsetLeft);
        }
    }

    
    const markTile = (e) => {
        if((e.target.classList.contains('tile')) && (!e.target.classList.contains('initial'))) {
            if(active) { active.classList.remove('active'); }
            setActive(e.target);
            e.target.classList.add('active');
        }
    }

    
    const appendNumber = (e) => {

        if(e.target.classList.contains('numbers-box')) {return;}

        console.log(e.target.textContent);
        console.log(active);

        if(!pencilmarks_Enabled) {
            if(active.classList.contains('pencilmark_tile')) {
                active.classList.remove('pencilmark_tile');
                while(active.childNodes.length) {
                    active.childNodes[active.childNodes.length - 1].remove();
                }
            }
            active.textContent = e.target.textContent;

        }
        else {
            console.log(active.childNodes);
            if(active.classList.contains('pencilmark_tile')) {
                for(let ind=0; ind<active.childNodes.length; ind++) {
                    console.log(active.childNodes[ind], e.target.textContent);
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

        anime({
            targets: active,
            duration: 1000,
            color: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`], // props.difficulty
            easing: 'linear',
        })

        anime({
            targets: e.target,
            duration: 1100,
            background: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`], 
            easing: 'easeOutSine',
            direction: 'alternate',
        })


        console.log(pencilmarks_Enabled);
    }

    const updateHistory = (e) => {

        let activeTileOrder = parseInt(active.dataset['order']);
        const activeTile_Row = Math.floor((activeTileOrder - 1) / 9);
        const activeTile_Col = ((activeTileOrder - 1) % 9);

        if(current_step !== step) {
            console.log('PIWO PO 3 ZŁOTE !');
            console.log(game_History, current_step, 'max: ', step);
            game_History.splice(current_step + 1);
            currentHistory.history = game_History[game_History.length - 1];
        }

  
        let currentHistory_copy = JSON.parse(JSON.stringify(currentHistory));

        //console.log(active);
        //console.log(currentHistory.history);

        // Tu też nie ma ochrony przed przejściem z single digit tile -> pencilmark tile    [EDIT: SOLVED]

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
                    //console.log('happens...');
                    currentHistory_copy.history[activeTile_Row][activeTile_Col] = [];
                    currentHistory_copy.history[activeTile_Row][activeTile_Col].push(parseInt(e.target.textContent));
                }

                // If we have multiple elems pencilmark tile, sort'em
                if(typeof(currentHistory_copy.history[activeTile_Row][activeTile_Col]) === 'object') {
                    currentHistory_copy.history[activeTile_Row][activeTile_Col].sort();
                }

            }
            else {
                console.warn('NO PENCILMARK CLASS PROVIDED !');
            }
        }
        else {
            currentHistory_copy.history[activeTile_Row][activeTile_Col] = parseInt(e.target.textContent);
        }

        
        
        game_History.push(currentHistory_copy.history);
        console.log(game_History);

        currentHistory.history = currentHistory_copy.history;

        if(current_step !== step) {
            // If we override history
            setStep(current_step + 1);
            setCurrentStep(current_step + 1);
            
        } else {
            // Normal behaviour
            setStep(step + 1);
            setCurrentStep(current_step + 1);
        }

        //setGameHistory([...prev_State, history_to_update]); -> not working
        //setGameHistory([...game_History, [...history_to_update]])
    }    

    /*     const repaintBoard = () => {
        console.log('WRITING OUT THE HISTORY')
        // Now paint the board based on currentStep value
        console.log(game_History[current_step]);
        console.log(board.current.childNodes);
    } */

    // Perform engine operations
    useEffect(() => {
        engine.setBoard();
        const final_Diff = engine.hideDigits(props);
        //engine.fadeDigits(props);
        //engine.backtrack();
        engine.backtrack();
        setFinalDifficulty(final_Diff);

        // Create game history
        const history = engine.createInitialGameHistory();
        console.log(history);
        currentHistory.history = history;
        game_History.push(history);
        //engine.solveSudoku(); -> we will use it more often when it comes to render a grid with proper difficulty

        // ALWAYS INIT LAST
        //board.current.addEventListener('click', interact);
        //board.current.addEventListener('click', markTile);
        //numbox.current.addEventListener('click', appendNumber);

        return () => {
            //board.current.removeEventListener('click', interact);
            //board.current.removeEventListener('click', markTile);
            //numbox.current.removeEventListener('click', appendNumber);
        }
    }, []);

    useEffect(() => {
        engine.setInitialClassToChosenTiles(props);
    }, [final_Difficulty])

    useEffect(() => {
        console.log('rubber animations')
        if(pencilmarks_Enabled === true) {
            anime({
                targets: rubber.current,
                duration: 800,
                backgroundColor: [`#0000`, `${difficultyColors[props.theme][final_Difficulty]}`], // props.difficulty
                easing: 'easeInSine',
                border: `${difficultyColors[props.theme][final_Difficulty]}`,  
                opacity: .5,
            })
        } else {
            anime({
                targets: rubber.current,
                duration: 800,
                backgroundColor: [`#000`], // props.difficulty
                easing: 'easeOutSine',
                border: 'none',
                opacity: 0,
            })
        }
    }, [pencilmarks_Enabled]);

    useEffect(() => {
        if(step > 0) { // Prevents from initial fire when component is being rendered
            engine.travelInTime(current_step, game_History);
        }
    }, [history_travel])

    return (
        <div className={`sudoku-${props.theme}`} ref={sudoku}>
            <div className={`all all-${props.theme}`} ref={all}>
                <div className="sudoku-title">
                    Sudoku {final_Difficulty} 
                    {/* {engine.version} */}
                </div>
                <Toolbox difficulty={final_Difficulty} theme={props.theme} handlePencilmarks={setPencilMarksEnabled} isEnabled={pencilmarks_Enabled} 
                         changeCurrentStep={setCurrentStep} currentStep={current_step} maxStep={step} travel={history_travel} historyTravel={setHistoryTravel}
                />
                <div className="sudoku-map">
                    <div className="sudoku-board" ref={board} onClick={(e) => {markTile(e)}} style={mainGridStyle} difficulty={final_Difficulty} theme={props.theme} >
                        {allSquares}
                    </div>
                </div>
                {/* <Palette ref={paletteRef} /> */}
                <div className={`numbers-box numbers-${final_Difficulty}`} ref={numbox} onClick={(e) => { if(active && (!(pencilmarks_Enabled && !parseInt(e.target.textContent))) && (!(!parseInt(active.textContent) && !parseInt(e.target.textContent)))) { appendNumber(e); updateHistory(e); } }}>
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
    );
}

// BUGI
// 1. Gdy dajemy Pencilmark na ostatnią kratkę w Sudoku Board, (9 rząd, 9 kolumna) dostajemy błąd:
//    "Uncaught TypeError: Cannot read properties of undefined (reading '8')" -> RESOLVED
// 2. History travel - gdy gracz nadpisuje historię rozgrywki, zmieniając przy tym typ kafelka z "pencilmark" na "single digit" (i vice versa)
//    Nie działa sama kwestia przejścia pomiędzy stanem pencilmark a single digit - po takim stanie podróżowanie w historii powoduje ERROR
export default Sudoku;