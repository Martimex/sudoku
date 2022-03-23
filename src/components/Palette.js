import React, { useEffect, createRef, useRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/palette.css';

const Palette = React.forwardRef((props, ref) => {

    const shadow = useRef(null);
    console.log(ref);

    useEffect(() => {
        shadow.current.addEventListener('click', hidePalette);

        return () => {
            shadow.current.removeEventListener('click', hidePalette);
        }

    }, [])

    function hidePalette(e) {
        if(e.target.classList.contains('shadow-bg')) {
            shadow.current.style.display= "none";
        } else if(e.target.classList.contains('palette-item')) {
            console.log('Number to append: ', e.target.textContent);
        }
    }

    return(
        <div className="shadow-bg" ref={shadow}>
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
        </div>
    );
})

export default Palette;