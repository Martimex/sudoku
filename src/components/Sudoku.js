import { render } from "@testing-library/react";
import react from "react";
import App from '../App';
import Landing from "../Landing";
import Square from "./Square";
import '../styles/sudoku.css';

function Sudoku(props) {

    const squareRows = 3;
    const squareColumns = 3;
    const rows = 9;
    const columns = 9;
    
    const mainGridStyle = {gridTemplateRows: `repeat(${squareRows}, 7rem)`, gridTemplateColumns: `repeat(${squareColumns}, 7rem)`}

    let renderArray = [];
    
    for(let i=0; i<(squareRows * squareColumns); i++) {
        renderArray.push('');
    }

    console.log(renderArray);

    const allSquares = renderArray.map((square, index) => 
        <Square key={index.toString()} id={index} mainRows={rows} mainColumns={columns} squareRows={squareRows} squareColumns={squareColumns} />
    );

    console.log(props);

    return (
        <div className="sudoku">
            <div className="sudoku-title">
                Sudoku {props.difficulty}
            </div>
            <div className="sudoku-map">
                <div className="sudoku-board" style={mainGridStyle}>
                    {allSquares}
                </div>
            </div>
        </div>
    );
}

export default Sudoku;