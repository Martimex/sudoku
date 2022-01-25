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
    backgroundColor: ['#000', '#ddd'],
    color: ['#ddd', '#000'],
}

function Landing() {

    const [difficulty, setDifficulty] = useState(null); // string
    const [timer, setTimer] = useState(false);
    const [counter, setCounter] = useState(false);
    const [theme, setTheme] = useState('night');

    const easyRef = useRef(null);
    const mediumRef = useRef(null);
    const hardRef = useRef(null);
    const masterRef = useRef(null);

    const themesBoxRef = useRef(null);

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
        const newTheme = themesBoxRef.current.querySelector(`[data-theme=${theme}]`);
        const allModes = themesBoxRef.current.childNodes;
        const modesArr = [...allModes];

        for(let i=0; i<allModes.length; i++) {
            if(allModes[i] === newTheme) { modesArr.splice(i, 1); changeThemes(newTheme, modesArr);}
        }

    }, [theme])

    function changeThemes(newTheme, modesArr) {
        anime({
            targets: modesArr,
            duration: 900,
            easing: 'easeInSine',
            backgroundColor: themeObject.backgroundColor[0],
            color: themeObject.color[0],
        })

        anime({
            targets: newTheme,
            duration: 900,
            easing: 'easeInSine',
            backgroundColor: themeObject.backgroundColor[1],
            color: themeObject.color[1],
        })
    }


    return (

        <div className="layout">
            <div className="content">
                <div className="content-title">
                    <p className="content-title-text"> Sudoku World </p>
                </div>

                <div className="app-text"> Choose a difficulty </div>

                <div className="content-box">
                    <div className="box-difficulty">
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
                            <label htmlFor="choose"> </label>
                        </div>
                        <span className="items-text"> Add timer </span>
                    </div>
                    <div className="box-items">
                        <div className="items-vis">
                            <input className="item-option" type="checkbox" value="false" id="choose2"/>
                            <label htmlFor="choose2"> </label>
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
                    <div className="start">
                        <button className="start-play"> Play </button>
                    </div>
                )}

            </div>
        </div>
    );

}

export default Landing;