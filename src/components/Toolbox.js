import React, { useEffect, createRef, useRef } from "react";
import  Sudoku from './Sudoku.js';
import '../styles/toolbox.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faInfo, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';

const tools = {
    info: {
        run: function(target) {
            console.log('running...')
        }
    },
    back: {
        run: function(target) {
            console.log('go back in game history [-1]')
            //console.log(target);
        }
    },
    forth: {
        run: function(target) {
            console.log('go forth in game history [+1]')
        }
    },
    pencil: {
        isActive: false,
        run: function(target) {
            this.isActive = !this.isActive;
            //console.log(target);
            if(this.isActive) {
                //console.log('PENCILMARKS ACTIVATED');
                target.classList.add('pencilmark_on', 'animation-box');
                //console.log(target.classList);
            }
            else {
                //console.log('Pencilmark mode: off');
                target.classList.remove('pencilmark_on', 'animation-box');
            }

        }
    },
}

function Toolbox(props) {

    const fireTool = (target) => {
        tools[target.attributes['data_name'].value].run(target);
    }

    console.log(props);

    return (
        <div className="tool-box" onClick={(e) => {  if(e.target.classList.contains('tool'))  { fireTool(e.target) } } }>
            <div className={`tool tool-${props.difficulty}`} data_name={'info'} onClick={() => console.log(props.history)} > 
                <FontAwesomeIcon icon={faInfo} className="tool-icon"></FontAwesomeIcon>
                {/* <div className="desc"> Info </div> */}
            </div>
            <div className={`tool tool-${props.difficulty}`} data_name={'back'} onClick={() => { if(props.maxStep !== 0 && props.currentStep !== 0) { props.changeCurrentStep(props.currentStep - 1); props.historyTravel(props.travel - 1) } } } > 
                <FontAwesomeIcon icon={faUndo} className="tool-icon"></FontAwesomeIcon>
                {/* <div className="desc"> Undo </div> */}
            </div>
            <div className={`tool tool-${props.difficulty}`} data_name={'forth'} onClick={() => { if(props.maxStep !== 0 && props.currentStep !== props.maxStep) { props.changeCurrentStep(props.currentStep + 1); props.historyTravel(props.travel + 1) } } } > 
                <FontAwesomeIcon icon={faRedo} className="tool-icon"></FontAwesomeIcon>
                {/* <div className="desc"> Redo </div> */}
            </div>
            <div className={`tool tool-${props.difficulty}`} data_name={'pencil'} onClick={() => props.handlePencilmarks(!props.isEnabled) } >   
                <FontAwesomeIcon icon={faPen} className="tool-icon"></FontAwesomeIcon>
            </div>
        </div>
    )
}

export default Toolbox;