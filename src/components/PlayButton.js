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

    hoverOnPlayBtn(e, isEntered) {
    if(!e.target.classList.contains('start-play')) return;
        const animatedText = e.target.querySelector('div[datatype="btn-text"]');
        anime({
            targets: animatedText,
            duration: 1700,
            margin: '0 1rem',
            letterSpacing: (isEntered)? ['.25rem'] : ['0rem'],
            scale: (isEntered)? 1.2 : 1.0,
            easing: (isEntered)? 'easeOutExpo' : 'easeOutExpo',
        })
    }

    render() {

        return(
            <div className="start">
                <button className="start-play" onMouseEnter={(e) => this.hoverOnPlayBtn(e, true)} onMouseLeave={(e) => this.hoverOnPlayBtn(e, false)} onClick={this.state.playSudoku}> 
                    <div datatype='btn-text'>Play</div> 
                </button>
            </div>
        );
    }

}

export default PlayButton;