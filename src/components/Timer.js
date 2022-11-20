import React, { useEffect } from "react";
import '../styles/timer.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

function Timer({hours, minutes, seconds, setTime}) {

    const timer_isStopped = useSelector(state => state.options.extras['timer'].isStopped);

    const tick = () => {
        //console.log(props)
        if(minutes === 59 && seconds === 59) {
            setTime([hours + 1, 0, 0])
        }
        else if(seconds === 59) {
            setTime([hours, minutes + 1, 0]);
        }
        else {
            setTime([hours, minutes, seconds + 1]);
        }
    }

    useEffect(() => {
        if(!timer_isStopped) {
            const timerId = setInterval(() => tick(), 1000);
            return() => clearInterval(timerId);
        }
    }, [seconds, timer_isStopped])

    return (
        <div className="timer-box">
            <FontAwesomeIcon icon={faClock} className={`timer-icon`} />
            <div className="timer-count"> {hours}:{(minutes < 10 ? '0'+minutes : minutes)}:{(seconds < 10 ? '0'+seconds : seconds)} </div>
        </div>
    )
}

export default Timer;