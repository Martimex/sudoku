import React, { useEffect } from "react";
import Sudoku from './Sudoku';
import '../styles/loading.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import anime from 'animejs/lib/anime.es.js';

function Loading(props) {

    useEffect(() => {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
        document.body.style.overflow = 'hidden';

        anime({
            targets: ['.loading-spinner'],
            duration: 800,
            rotate: [0, 360],
            easing: 'linear',
            loop: true,
        })
    })

    return(
        <div className="loading">
            <div className="loading-content">
                <div className="spinner-div">
                    <FontAwesomeIcon icon={faSpinner} className="loading-spinner" ></FontAwesomeIcon>
                </div>
                <div className="loading-text"> Loading... </div>
            </div>
        </div>
    )

}

export default Loading;