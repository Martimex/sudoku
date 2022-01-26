import React, {useState, useEffect, useRef} from "react";
import App from './App';
import './styles/landing.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import anime from 'animejs/lib/anime.es.js';

// Landing will get initial values to determine which kind of sudoku (+ user preferences) apply

const visualObject = {
    // First array value refers to "initial values", second one to "new value"
    //borderStyle: ['none', 'none none double double'],
    borderRadius: ['0%', '15%'],
    color: ['#333', '#ddd'],
    fontWeight: ['500', '700'],
    scale: [['100%', '100%'], ['100%', '110%']],
}

const themeObject = {

    backgroundColor: {
        day: '#ccc',
        night: '#000',   
    },
    
    btnBgColor: {
        day: '#000',
        night: '#ddd',
    },

    color: {
        day: '#000',
        night: '#ddd',
    },

    btnColor: {
        day: '#ddd',
        night: '#000',
    },

    borderColor: {
        day: '#000',
        night: '#ddd',
    }
}

function Landing() {

    const [difficulty, setDifficulty] = useState(null); // string
    const [timer, setTimer] = useState(false);
    const [counter, setCounter] = useState(false);
    const [theme, setTheme] = useState('night');

    const layoutRef = useRef(null);

    const easyRef = useRef(null);
    const mediumRef = useRef(null);
    const hardRef = useRef(null);
    const masterRef = useRef(null);

    const themesBoxRef = useRef(null);

    const buttonMainRef = useRef(null);

    function changeVisuals(refEl, value) {
        //for(let prop in visualObject) {
        //    refEl.style[`${prop}`] = visualObject[`${prop}`][value];
        //}

        anime({
            targets: refEl,
            duration: 600,
            easing: 'easeInOutSine',
            borderRadius: visualObject.borderRadius[value],
            color: visualObject.color[value],
            fontWeight: visualObject.fontWeight[value],
            scale: visualObject.scale[value],
        })
    }

    useEffect(() => {
        let arr = [easyRef, mediumRef, hardRef, masterRef];
        for(let i=0; i<arr.length; i++) {
            let shouldUpdate = 0;
            if(arr[i].current.classList[arr[i].current.classList.length - 1] === difficulty) {shouldUpdate++}
            changeVisuals(arr[i].current, shouldUpdate);
        }

    }, [difficulty]);

    useEffect(() => {
        // Start from here
        const newTheme = themesBoxRef.current.querySelector(`[data-theme=${theme}]`);

        const allContentBoxes = layoutRef.current.querySelectorAll('.content-box');
        const allInputs = layoutRef.current.querySelectorAll('.items-vis');
        const allLabels = layoutRef.current.querySelectorAll('.label-item');
        const playButton = layoutRef.current.querySelectorAll('.start-play');

        const allModes = themesBoxRef.current.childNodes;
        const modesArr = [...allModes];

        for(let i=0; i<allModes.length; i++) {
            if(allModes[i] === newTheme) { modesArr.splice(i, 1); changeThemes(newTheme, modesArr, theme, allContentBoxes, allInputs, allLabels, playButton);}
        }

    }, [theme])

    function changeThemes(newTheme, modesArr, theme, allContentBoxes, allInputs, allLabels, playButton) {

        anime({
            targets: [modesArr, layoutRef.current, allContentBoxes, allInputs, allLabels],
            duration: 1300,
            easing: 'easeInSine',
            backgroundColor: themeObject.backgroundColor[theme],
            color: themeObject.color[theme],
            borderColor: themeObject.borderColor[theme],
        })

        anime({
            targets: [newTheme, playButton],
            duration: 1300,
            easing: 'easeInSine',
            backgroundColor: themeObject.btnBgColor[theme],
            color: themeObject.btnColor[theme],
        })


    }

    function shouldButtonAppear(event) {
        if((!difficulty) && (event.target.classList.contains('difficulty'))) {
            // THIS IS NOT WORKING
            anime({
                targets: buttonMainRef.current,
                duration: 2200,
                opacity: 0,
                easing: 'easeInCubic',
            })
        }
    }


    return (

        <div className="layout" ref={layoutRef} >
            <div className="content">
                <div className="content-title">
                    <p className="content-title-text"> Sudoku World </p>
                </div>

                <div className="app-text"> Choose a difficulty </div>

                <div className="content-box">
                    <div className="box-difficulty" onClick={(event) => {shouldButtonAppear(event)}}>
                        <div className="difficulty difficulty-easy easy" ref={easyRef} onClick={() => {setDifficulty('easy')}}> EASY </div>
                        <div className="difficulty difficulty-medium medium" ref={mediumRef} onClick={() => {setDifficulty('medium')}}> MEDIUM </div>
                        <div className="difficulty difficulty-hard hard" ref={hardRef} onClick={() => {setDifficulty('hard')}}> HARD </div>
                        <div className="difficulty difficulty-master master" ref={masterRef} onClick={() => {setDifficulty('master')}}> KOREA </div>
                    </div>
                </div>

                <div className="app-text"> Options  </div>

                <div className="content-box">
                    <div className="box-items">
                        <div className="items-vis">
                            <input className="item-option" type="checkbox" value="false"  id="choose"/>
                            <label htmlFor="choose" className="label-item" onClick={() => setTimer(!timer)}> </label>
                        </div>
                        <span className="items-text"> Add timer </span>
                    </div>
                    <div className="box-items">
                        <div className="items-vis">
                            <input className="item-option" type="checkbox" value="false" id="choose2"/>
                            <label htmlFor="choose2" className="label-item" onClick={() => setCounter(!counter)}> </label>
                        </div>
                        <span className="items-text"> Add counter </span>
                    </div>
                </div>

                <div className="app-text">  Select theme </div>
                
                <div className="content-box">
                    <div className="box-items" ref={themesBoxRef}> 
                        <div className="items-icons" data-theme="day" onClick={() => {setTheme('day')}} >
                            <FontAwesomeIcon icon={faSun}  className="icon"></FontAwesomeIcon>
                        </div>
                        <div className="items-icons" data-theme="night" onClick={() => {setTheme('night')}} >
                            <FontAwesomeIcon icon={faMoon} className="icon"></FontAwesomeIcon>
                        </div>
                    </div>
                </div>

                {difficulty && (
                    <div className="start" ref={buttonMainRef}>
                        <button className="start-play"> Play </button>
                    </div>
                )}

            </div>
        </div>
    );

}

export default Landing;