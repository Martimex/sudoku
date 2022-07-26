import anime from 'animejs/lib/anime.es.js';
import React from "react";
import '../styles/landing.css';

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playSudoku: props.playSudoku,
        }
    }

    componentDidMount() {
        anime({
            targets: '.start',
            duration: 1600,
            opacity: [0, 1],
            easing: 'easeInCubic',
        })
    }


    render() {

        return(
            <div className="start">
                <button className="start-play" onClick={this.state.playSudoku}> Play </button>
            </div>
        );
    }

}

export default PlayButton;