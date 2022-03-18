import React from "react";
import  Sudoku from './Sudoku.js';
import '../styles/palette.css';

function Palette(props) {

    return(
        <div className="palette-box">
            <div className="palette-item"> 1 </div>
            <div className="palette-item"> 2 </div>
            <div className="palette-item"> 3 </div>
            <div className="palette-item"> 4 </div>
            <div className="palette-item"> 5 </div>

            <div className="palette-item"> 6 </div>
            <div className="palette-item"> 7 </div>
            <div className="palette-item"> 8 </div>
            <div className="palette-item"> 9 </div>
            <div className="palette-item"> x </div>
        </div>
    );
}

export default Palette;