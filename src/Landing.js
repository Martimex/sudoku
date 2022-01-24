import react from "react";
import App from './App';
import './styles/landing.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// Landing will get initial values to determine which kind of sudoku (+ user preferences) apply

function Landing() {


    return (

        <div className="layout">
            <div className="content">
                <div className="content-title">
                    <p className="content-title-text"> Sudoku World </p>
                </div>

                <div className="app-text"> Choose a difficulty </div>

                <div className="content-box">
                    <div className="box-difficulty">
                        <div className="difficulty difficulty-easy"> EASY </div>
                        <div className="difficulty difficulty-medium"> MEDIUM </div>
                        <div className="difficulty difficulty-hard"> HARD </div>
                        <div className="difficulty difficulty-master"> AFK </div>
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
                    <div className="box-items"> 
                        <div className="items-icons">
                            <FontAwesomeIcon icon={faSun}  className="icon"></FontAwesomeIcon>
                        </div>
                        <div className="items-icons">
                            <FontAwesomeIcon icon={faMoon} className="icon"></FontAwesomeIcon>
                        </div>
                    </div>
                </div>

                <div className="start">
                    <button className="start-play"> Play </button>
                </div>
            </div>
        </div>
    );

}

export default Landing;