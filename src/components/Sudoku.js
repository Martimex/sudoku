import { render } from "@testing-library/react";
import react, { useLayoutEffect, useEffect, useRef } from "react";
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

    const board = useRef(null);
    //const palette = useRef(null);
    
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
            e.target.textContent = 'Q';
        }
    }

    // Perform engine operations
    useEffect(() => {
        engine.setBoard();
        engine.fadeDigits(props);
        // ALWAYS INIT LAST
        board.current.addEventListener('click', interact);
    }, []);


    return (
        <div className="sudoku">
            <div className="sudoku-title">
                Sudoku {props.difficulty} 
                {engine.version}
            </div>
            <div className="sudoku-map">
                <div className="sudoku-board" ref={board} style={mainGridStyle} difficulty={props.difficulty} theme={props.theme} >
                    {allSquares}
                </div>
            </div>
            <Palette /* ref={palette} */ />
        </div>
    );
}

export default Sudoku;