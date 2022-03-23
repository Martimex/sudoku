import { render } from "@testing-library/react";
import react, { useLayoutEffect, useEffect, useRef, createRef, useState } from "react";
import App from '../App';
import Landing from "../Landing";
import Square from "./Square";
import Palette from "./Palette";
import '../styles/sudoku.css';
import engine from '../addons/engine.js';

const basics = {
    squareRows: 3,
    squareColumns: 3,
    rows: 9,
    columns: 9,
}

function Sudoku(props) {

    const squareRows = 3;
    const squareColumns = 3;
    const rows = 9;
    const columns = 9;

    const [active, setActive] = useState(0);

    const sudoku = useRef(null);
    const all = useRef(null);
    const board = useRef(null);
    const numbox = useRef(null);
    const paletteRef = createRef();
    
    const mainGridStyle = {gridTemplateRows: `repeat(${squareRows}, 7rem)`, gridTemplateColumns: `repeat(${squareColumns}, 7rem)`}

    let renderArray = [];
    
    for(let i=0; i<(squareRows * squareColumns); i++) {
        renderArray.push('');
    }

    const allSquares = renderArray.map((square, index) => 
        <Square key={index.toString()} id={index} mainRows={rows} mainColumns={columns} squareRows={squareRows} squareColumns={squareColumns} />
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
        console.log(e.target.textContent);
        console.log(active);
        active.textContent = e.target.textContent;
    }

    // Perform engine operations
    useEffect(() => {
        engine.setBoard();
        engine.fadeDigits(props);
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


    return (
        <div className="sudoku" ref={sudoku}>
            <div className="all" ref={all}>
                <div className="sudoku-title">
                    Sudoku {props.difficulty} 
                    {engine.version}
                </div>
                <div className="sudoku-map">
                    <div className="sudoku-board" ref={board} onClick={(e) => {markTile(e)}} style={mainGridStyle} difficulty={props.difficulty} theme={props.theme} >
                        {allSquares}
                    </div>
                </div>
                {/* <Palette ref={paletteRef} /> */}
                <div className="numbers-box" ref={numbox} onClick={(e) => { if(active) appendNumber(e)}}>
                    <div className="option option-1"> 1 </div>
                    <div className="option option-2"> 2 </div>
                    <div className="option option-3"> 3 </div>
                    <div className="option option-4"> 4 </div>
                    <div className="option option-5"> 5 </div>
                    <div className="option option-6"> 6 </div>
                    <div className="option option-7"> 7 </div>
                    <div className="option option-8"> 8 </div>
                    <div className="option option-9"> 9 </div>
                    <div className="option option-0">  </div>
                </div> 

            </div>
        </div>
    );
}

export default Sudoku;