import React, { useEffect } from "react";
import '../styles/win.css';
import '../styles/reset.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';

import { RESET_STATE } from '../features/sudoku/sudokuSlice.js';
import { RESET_EXTRAS } from "../features/options/optionsSlice";
import { useDispatch, useSelector } from 'react-redux';

function Win(props) {

    const dispatch = useDispatch();
    const isTimeEnabled = useSelector(state => state.options.extras[`timer`].isEnabled);

    useEffect(() => {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
    })

    return(
        <div className="blurred-screen" >
            <div className={`win-screen win-${props.final_difficulty}`}>
                <div className={`screen-title screen-title-${props.final_difficulty}`} >
                    Sudoku completed
                </div>

                <div className={`screen-description screen-description-${props.final_difficulty}`} >
                    Congratulations! You've just solved Sudoku {props.final_difficulty}!
                    {isTimeEnabled === true && (
                        <div className="time-summary"> 
                            <div className="time-text"> Solving time:  </div>
                            <div className="time-value">
                                {props.time[0]}:{(props.time[1] < 10 ? '0'+props.time[1] : props.time[1])}:{(props.time[2] < 10 ? '0'+props.time[2] : props.time[2])}
                            </div>
                        </div>
                    )}
                </div>

                <div className="choose-box">
                    <div className={`choose-button win-icon win-icon-${props.final_difficulty}`} onClick={() => {dispatch(RESET_STATE()); dispatch(RESET_EXTRAS()); document.body.style.overflow = 'auto'; props.goHome()}} > 
                        <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className={`choose-button win-icon win-icon-${props.final_difficulty}`} onClick={() => {props.getNewSudoku()}}> 
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Win;