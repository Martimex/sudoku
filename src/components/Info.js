import React, { useEffect } from "react";
import version_info from '../addons/version_info';
import '../styles/info.css';
import '../styles/reset.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faInfo, faCalendar, faStar, faFile, faTrophy  } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'react-redux';
import {
    addExtraView,
} from '../features/appView/appViewSlice.js';
import {
    stopTimer
} from '../features/options/optionsSlice.js';

function Info(props) {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(stopTimer(true));
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
    }, [])

    return (
        <div className="blurred-screen">
            <div className="info-grid-screen" datatype="title">
                <div className={`info-box info-${props.theme} info-box-new-sizing`} datatype="title" >
                    <div className="grid-container">
                        <div className="grid-container-icon-box">
                            <FontAwesomeIcon icon={faInfo} />
                        </div>
                        <div className="grid-container-title"> 
                            App Info 
                        </div>
                        <div className="grid-container-version">  
                            {version_info[version_info.length - 1].name}
                        </div>
                    </div>
                </div>

                <div className={`info-box info-${props.theme} info-box-new-sizing`}>
                    <div className="info-box-grid-content">
                        <FontAwesomeIcon icon={faTrophy} className="info-box-desc-icon" datatype={'trophy'} />
                        <div className="info-box-grid-content-name"> Version: </div>
                        <div className="info-box-grid-content-value"> {version_info[version_info.length - 1].name} </div>
                    </div>
                    <div className="info-box-grid-content">
                        <FontAwesomeIcon icon={faCalendar} className="info-box-desc-icon" datatype={'calendar'} />
                        <div className="info-box-grid-content-name"> Released: </div>
                        <div className="info-box-grid-content-value"> {version_info[version_info.length - 1].release} </div>
                    </div>
                    <div className="info-box-grid-content" datatype="link">
                        <FontAwesomeIcon icon={faStar}  className="info-box-desc-icon" datatype={'star'} />
                        <div className="info-box-grid-content-name"> 
                         <a className="info-link" href='https://github.com/Martimex/sudoku/blob/main/Changelog.md' target={'_blank'} rel="noreferrer"> Check changelog  </a>
                        </div>
                    </div>
                    <div className="info-box-grid-content" datatype="link">
                        <FontAwesomeIcon icon={faFile} className="info-box-desc-icon" datatype={'file'} />
                        <div className="info-box-grid-content-name"> 
                            <a className="info-link" href="https://github.com/Martimex/sudoku/blob/main/README.md" target={'_blank'} rel="noreferrer"> See documentation </a> 
                        </div>
                    </div>
                    <div className="info-box-author">
                        <div className="info-box-author-text"> Created by: </div>
                        <div className="info-box-author-logo">
                            <a className="author-logo-box" href="https://github.com/Martimex" target='_blank' rel="noreferrer">
                                <img className="author-logo" alt="author_logo" src="logo_new.svg" ></img>
                            </a> 
                        </div>
                    </div>

                </div>

                <div className={`info-box info-${props.theme} info-box-new-sizing`} datatype="outro">
                    <div className="info-close" onClick={() => {document.documentElement.requestFullscreen(); dispatch(addExtraView({extraViewName: ''})); dispatch(stopTimer(false)); /* props.setCheckInfo(false); */}}> Close </div>
                </div>
            </div>
        </div>
       
    )
}

export default Info;