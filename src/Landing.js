import React, {useEffect, useRef} from "react";
import './styles/landing.css';
import PlayButton from './components/PlayButton.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// import redux stuff
import {useSelector, useDispatch} from 'react-redux';
import {
    toggleExtras,
    switchTheme,
    switchDifficulty
} from './features/options/optionsSlice.js';
import {
    changeView
} from './features/appView/appViewSlice.js';

import anime from 'animejs/lib/anime.es.js';

// Landing will get initial values to determine which kind of sudoku (+ user preferences) applies

const visualObject = {
    // First array value refers to "initial values", second one to "new value"
    borderRadius: ['0%', '15%'],
    color_active: {
        easy: ['hsl(144, 57%, 53%)'],
        medium: ['hsl(55, 57%, 53%)'],
        hard: ['hsl(12, 57%, 53%)'],
        master: ['hsl(248, 57%, 53%)'],
    }, 
    color_inactive: ['#333', '#ddd'],
    fontWeight: ['500', '700'],
    scale: [['100%', '100%'], ['100%', '110%']],
}

const themeObject = {

    backgroundColor: {
        day: '#eee',
        night: '#000',   
    },
    
    btnBgColor: {
        day: '#000',
        night: '#eee',
    },

    color: {
        day: '#000',
        night: '#eee',
    },

    btnColor: {
        day: '#eee',
        night: '#000',
    },

    borderColor: {
        day: '#000',
        night: '#eee',
    },

    difficultyBoxesColor: {
        day: '#ddd',
        night: '#333',
    },

    difficultyActiveBoxColor: {
        easy: ['hsl(144, 57%, 53%)'],
        medium: ['hsl(55, 57%, 53%)'],
        hard: ['hsl(12, 57%, 53%)'],
        master: ['hsl(248, 57%, 53%)'],
    }
}

function Landing() {

    const dispatch = useDispatch();
    const theme = useSelector(state => state.options.theme);
    const difficulty = useSelector(state => state.options.difficulty);

    const layoutRef = useRef(null);

    const easyRef = useRef(null);
    const mediumRef = useRef(null);
    const hardRef = useRef(null);
    const masterRef = useRef(null);

    const themesBoxRef = useRef(null);

    function changeVisuals(refEl, value) {

        anime({
            targets: refEl,
            duration: 600,
            easing: 'easeInOutSine',
            borderRadius: visualObject.borderRadius[value],
            color: (value === 1)? visualObject.color_active[`${difficulty}`] : (theme === 'night') ? visualObject.color_inactive[0] : visualObject.color_inactive[1],
            fontWeight: visualObject.fontWeight[value],
            scale: visualObject.scale[value],
        })
    }

    useEffect(() => {
        // Remove active styling classes from ALL difficulty tiles
        const difficultyBoxes = layoutRef.current.querySelectorAll('.difficulty');
        for(let difficulty_box_no = 0; difficulty_box_no < difficultyBoxes.length; difficulty_box_no++) {
            difficultyBoxes[difficulty_box_no].classList.remove('chosen_difficulty');
            if(difficultyBoxes[difficulty_box_no].classList.contains(`${difficulty}`)) {
                difficultyBoxes[difficulty_box_no].classList.add('chosen_difficulty');
                changeVisuals(difficultyBoxes[difficulty_box_no], 1);
            } else {
                changeVisuals(difficultyBoxes[difficulty_box_no], 0);
            }
        
        }

    }, [difficulty]);

    useEffect(() => {
        const newTheme = themesBoxRef.current.querySelector(`[data-theme=${theme}]`);

        const allContentBoxes = layoutRef.current.querySelectorAll('.content-box');
        const allInputs = layoutRef.current.querySelectorAll('.items-vis');
        const allLabels = layoutRef.current.querySelectorAll('.label-item');
        const playButton = layoutRef.current.querySelectorAll('.start-play');

        const difficultyBoxes = layoutRef.current.querySelectorAll('.difficulty');
        const inactiveBoxes = [...difficultyBoxes].filter((box) => {return !box.classList.contains('chosen_difficulty') } )
        const allModes = themesBoxRef.current.childNodes;
        const modesArr = [...allModes];

        for(let i=0; i<allModes.length; i++) {
            if(allModes[i] === newTheme) { modesArr.splice(i, 1); changeThemes(newTheme, modesArr, theme, difficulty, allContentBoxes, allInputs, allLabels, playButton, inactiveBoxes);}
        }

    }, [theme])

    function changeThemes(newTheme, modesArr, theme, difficulty, allContentBoxes, allInputs, allLabels, playButton, inactiveBoxes) {

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

        anime({
            targets: inactiveBoxes,
            duration: 1300,
            easing: 'easeInSine',
            color: themeObject.difficultyBoxesColor[theme],
        })

        anime({
            targets: '.chosen_difficulty',
            duration: 1300,
            easing: 'easeInSine',
            color: themeObject.difficultyActiveBoxColor[difficulty],
        })

    }


    return (

        <div className="layout" ref={layoutRef} >
            <div className="content">
                <div className="content-title">
                    <p className="content-title-text font-effect-neon"> Sudoku World </p>
                </div>

                <div className="app-section-main">
                

                    <div className="app-section-box" data-type="difficulty">
                        <div className="app-text"> Try to get Sudoku </div>

                        <div className="content-box">
                            <div className="box-difficulty">
                                <div data-difficulty="easy" className="difficulty difficulty-easy easy" ref={easyRef} onClick={(e) => {dispatch(switchDifficulty({difficulty_name: e.target.dataset['difficulty']}))}}> EASY </div>
                                <div data-difficulty="medium" className="difficulty difficulty-medium medium" ref={mediumRef} onClick={(e) => {dispatch(switchDifficulty({difficulty_name: e.target.dataset['difficulty']}))}}> MEDIUM </div>
                                <div data-difficulty="hard" className="difficulty difficulty-hard hard" ref={hardRef} onClick={(e) => {dispatch(switchDifficulty({difficulty_name: e.target.dataset['difficulty']}))}}> HARD </div>
                                <div data-difficulty="master" className="difficulty difficulty-master master" ref={masterRef} onClick={(e) => {dispatch(switchDifficulty({difficulty_name: e.target.dataset['difficulty']}))}}> INSANE </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="app-section-box" data-type="options">
                        <div className="app-text"> Options  </div>

                        <div className="content-box" data-type="content-options">
                            <div className="box-items">
                                <div className="items-vis">
                                    <input className="item-option" type="checkbox" value="false"  id="choose"/>
                                    <label htmlFor="choose" className="label-item" onClick={() => {dispatch(toggleExtras({name: 'timer'}))}}> </label>
                                </div>
                                <span className="items-text"> Add Timer </span>
                            </div>
                            <div className="box-items">
                                <div className="items-vis">
                                    <input className="item-option" type="checkbox" value="true" id="choose2"/>
                                    <label htmlFor="choose2" className="label-item" onClick={() => {dispatch(toggleExtras({name: 'backlit'}))}}> </label>
                                </div>
                                <span className="items-text"> Tile backlit </span>
                            </div>
                        </div>
                    </div>

                    <div className="app-section-box" data-type="theme">
                        <div className="app-text">  Select theme </div>
                        
                        <div className="content-box">
                            <div className="box-items" ref={themesBoxRef}> 
                                <div className="items-icons" data-theme="day" onClick={(e) => {dispatch(switchTheme({theme_name: e.target.dataset['theme']}))}} >
                                    <FontAwesomeIcon icon={faSun}  className="icon"></FontAwesomeIcon>
                                </div>
                                <div className="items-icons" data-theme="night" onClick={(e) => {dispatch(switchTheme({theme_name: e.target.dataset['theme']}))}} >
                                    <FontAwesomeIcon icon={faMoon} className="icon"></FontAwesomeIcon>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {difficulty && (
                    <PlayButton playSudoku={() => dispatch(changeView({newViewName: 'sudoku'}))} />
                )}

            </div>
        </div>
    );

}

export default Landing;