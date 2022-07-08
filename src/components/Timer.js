import React, { useEffect, useState, useRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/timer.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';

function Timer(props) {

    const tick = () => {
        if(props.minutes === 59 && props.seconds === 59) {
            props.setTime([props.hours + 1, 0, 0])
        }
        else if(props.seconds === 59) {
            props.setTime([props.hours, props.minutes + 1, 0]);
        }
        else {
            props.setTime([props.hours, props.minutes, props.seconds + 1]);
        }
    }

    useEffect(() => {
        if(!props.stopTimer) {
            const timerId = setInterval(() => tick(), 1000);
            return() => clearInterval(timerId);
        }
    }, [props.seconds])

    /*     setInterval(() => {
        seconds++;
        document.querySelector('.timer-count').textContent = `${minutes}:${seconds}`;
    }, 1000) */

    return (
        <div className="timer-box">
            <FontAwesomeIcon icon={faClock} className={`timer-icon`} />
            <div className="timer-count"> {props.hours}:{(props.minutes < 10 ? '0'+props.minutes : props.minutes)}:{(props.seconds < 10 ? '0'+props.seconds : props.seconds)} </div>
        </div>
    )
}

export default Timer;