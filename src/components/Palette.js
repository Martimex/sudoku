import React, { useEffect, createRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/palette.css';

const Palette = React.forwardRef((props, ref) => {

    return(
        <div className="palette-box" ref={ref}>
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
})

export default Palette;