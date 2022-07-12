import React, { useEffect, useLayoutEffect, createRef, useRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/info.css';
import '../styles/reset.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faInfo, faCalendar, faStar, faFile, faPersonBooth, faTrophy  } from '@fortawesome/free-solid-svg-icons';

function Info(props) {

    useEffect(() => {
        props.setStopTimer(!props.stopTimer);
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
                            1.0.0 
                        </div>
                    </div>
                </div>

                {/* <div className="no-flex">
                    <div className="title-box">
                        <FontAwesomeIcon icon={faInfo} />
                        <div className="content"> Info about the app: </div>
                        <div className="content"> Current version: v. 1.0.0 </div>
                    </div>
                </div> */}

                <div className={`info-box info-${props.theme} info-box-new-sizing`}>
                    <div className="info-box-grid-content">
                        <FontAwesomeIcon icon={faTrophy} className="info-box-desc-icon" datatype={'trophy'} />
                        <div className="info-box-grid-content-name"> Version: </div>
                        <div className="info-box-grid-content-value"> 1.0.0 </div>
                    </div>
                    <div className="info-box-grid-content">
                        <FontAwesomeIcon icon={faCalendar} className="info-box-desc-icon" datatype={'calendar'} />
                        <div className="info-box-grid-content-name"> Released: </div>
                        <div className="info-box-grid-content-value"> 12/07/22 </div>
                    </div>
                    <div className="info-box-grid-content" datatype="link">
                        <FontAwesomeIcon icon={faStar}  className="info-box-desc-icon" datatype={'star'} />
                        <div className="info-box-grid-content-name"> 
                         <a className="info-link" href='https://github.com/Martimex' target={'_blank'}> Learn about Sudoku  </a>
                        </div>
                        {/* <div className="info-box-grid-content-value"> ? </div> */}
                    </div>
                    <div className="info-box-grid-content" datatype="link">
                        <FontAwesomeIcon icon={faFile} className="info-box-desc-icon" datatype={'file'} />
                        <div className="info-box-grid-content-name"> 
                            <a className="info-link" href="https://github.com/Martimex/sudoku" target={'_blank'}> See documentation </a> 
                        </div>
                        {/* <div className="info-box-grid-content-value"> ! </div> */}
                    </div>
                    {/* <div className="info-box-grid-content">
                        <FontAwesomeIcon icon={faPersonBooth} />
                        <div className="info-box-grid-content-name"> Created by: </div>
                        <div className="info-box-grid-content-value"> ╱╲╱╲  </div>
                    </div> */}

                    <div className="info-box-author">
                        <div className="info-box-author-text"> Created by: </div>
                        <div className="info-box-author-logo"> ╱╲/\╱╲ </div>
                    </div>

                </div>

                <div className={`info-box info-${props.theme} info-box-new-sizing`} datatype="outro">
                    <div className="info-close" onClick={() => {props.setCheckInfo(false);}}> Close </div>
                </div>
            </div>
        </div>
       
    )
}

export default Info;