import React, { useEffect, createRef, useRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/reset.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBackspace } from '@fortawesome/free-solid-svg-icons';


function Reset(props) {


    return (
        <div className="blurred-theme">
            <div className='reset-box'>
                <div className="reset-title">
                    Confirm Reset
                </div>
                <div className="message-box">
                    This Sudoku has been started. Are You sure 
                    to replace it ? All progress will be lost
                </div>
                <div className="choose-box">
                    <div className="choose-button choose-decline" onClick={() => {/* props.setStopTimer(false); */ props.setconfirmReset(false); }}>
                        <FontAwesomeIcon icon={faBackspace} />
                    </div>
                    <div className="choose-button choose-confirm" onClick={() => {props.proceedReset()}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </div> 
                </div>
            </div>
        </div>
    ) 
}

export default Reset;