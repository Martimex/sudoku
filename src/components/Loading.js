import React, { useEffect } from "react";
import '../styles/loading.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import anime from 'animejs/lib/anime.es.js';
import { useSelector } from "react-redux";

function Loading(props) {

    const theme = useSelector(state => state.options.theme);

    useEffect(() => {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
        document.body.style.overflow = 'hidden';

        anime({
            targets: ['.loading-spinner'],
            duration: 1100,
            rotate: [0, 360],
            easing: 'linear',
            loop: true,
        })
    })

    return(
        <div className="loading" data-theme={`${theme}`} >
            <div className="loading-content">
                <div className="spinner-div">
                    <FontAwesomeIcon icon={faSpinner} className="loading-spinner"  data-theme={`${theme}`} ></FontAwesomeIcon>
                </div>
                <div className="loading-text" data-theme={`${theme}`}> Loading... </div>
            </div>
        </div>
    )

}

export default Loading;