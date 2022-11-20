import React, { useEffect, useRef } from "react";
import '../styles/reset.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBackspace } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'react-redux';
import {
    addExtraView
} from '../features/appView/appViewSlice.js';
import {
    RESET_STATE 
} from '../features/sudoku/sudokuSlice.js';

function Reset(props) {

    const dispatch = useDispatch();
    const theme_ref = useRef(null);

    useEffect(() => {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
        document.body.style.overflow = 'hidden';
    })

    return (
        <div className="blurred-theme" ref={theme_ref}>
            <div className='reset-box'>
                <div className="reset-title">
                    Confirm Reset
                </div>
                <div className="message-box">
                    This Sudoku has been started. Are You sure 
                    to replace it ? All progress will be lost
                </div>
                <div className="choose-box">
                    <div className="choose-button choose-decline" onClick={() => {document.body.style.overflow = 'auto'; dispatch(addExtraView({extraViewName: ''}));/* props.setconfirmReset(false); */ }}>
                        <FontAwesomeIcon icon={faBackspace} />
                    </div>
                    <div className="choose-button choose-confirm" onClick={() => { props.proceedReset()}}>
                        <FontAwesomeIcon icon={faCheck} />
                    </div> 
                </div>
            </div>
        </div>
    ) 
}

export default Reset;