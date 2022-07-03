import React from "react";
import Sudoku from './Sudoku';
import '../styles/loading.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import anime from 'animejs/lib/anime.es.js';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: props.theme,
        }
    }

    componentDidMount() {
        anime({
            targets: ['.loading-spinner'],
            duration: 800,
            rotate: [0, 360],
            easing: 'linear',
            loop: true,
        })
    }
    
    componentWillUnmount() {
/*         anime({
            targets: ['.loading-spinner'],
            duration: 650,
            opacity: 0,
            easing: 'linear',
        })   */
    }
    
    render() {
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
}

export default Loading;