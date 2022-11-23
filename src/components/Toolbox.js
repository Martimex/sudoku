import React, { useEffect, useRef } from "react";
import '../styles/toolbox.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faInfo, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from "react-redux";
import {
    addExtraView
} from '../features/appView/appViewSlice.js';
import {
    togglePencilmarkMode,
    changeCurrentStep,
    updatePlayerAction,
} from '../features/sudoku/sudokuSlice.js';


const tools = {
    info: {
        run: function(target) {

        }
    },
    back: {
        run: function(target) {

        }
    },
    forth: {
        run: function(target) {

        }
    },
    pencil: {
        isActive: false,
        run: function(target, props) {
            this.isActive = !this.isActive;
            if(this.isActive) {
                target.classList.add('pencilmark_on', `animation-box-${props.difficulty}`);
            }
            else {
                target.classList.remove('pencilmark_on', `animation-box-${props.difficulty}`);
            }

        }
    },
}

function Toolbox(props) {

    const dispatch = useDispatch();
    const currentStep = useSelector(state => state.sudoku.currentStep);
    const maxStep = useSelector(state => state.sudoku.step);

    const history_undo = useRef(null);
    const history_redo = useRef(null);

    const fireTool = (target) => {
        tools[target.attributes['data-name'].value].run(target, props); 
    }

    useEffect(() => {
        // Undo btn
        if(currentStep !== 0) { 
            history_undo.current.classList.remove('tool-blocked');
        } 
        else {
            history_undo.current.classList.add('tool-blocked');  
        }

        // Redo btn
        if(currentStep !== maxStep) {
            history_redo.current.classList.remove('tool-blocked');
        }
        else {
            history_redo.current.classList.add('tool-blocked');
        }
    }, [currentStep])

    return (
        <div className="tool-box-all">
            <div className="tool-box" onClick={(e) => {  if(e.target.classList.contains('tool'))  { fireTool(e.target) } } }>
                <div className={`tool tool-${props.difficulty}`} data-name={'info'} onClick={() =>  dispatch(addExtraView({extraViewName: 'info'})) } > 
                    <FontAwesomeIcon icon={faInfo} className="tool-icon"></FontAwesomeIcon>
                </div>
                <div className={`tool tool-${props.difficulty} tool-blocked`} data-name={'back'} ref={history_undo} onClick={() => { if(maxStep !== 0 && currentStep !== 0) { dispatch(updatePlayerAction({action_type: 'back'})); dispatch(changeCurrentStep({value: -1}));  } } } > 
                    <FontAwesomeIcon icon={faUndo} className="tool-icon"></FontAwesomeIcon>
                </div>
                <div className={`tool tool-${props.difficulty} tool-blocked`} data-name={'forth'} ref={history_redo} onClick={() => { if(maxStep !== 0 && currentStep !== maxStep) { dispatch(updatePlayerAction({action_type: 'forth'})); dispatch(changeCurrentStep({value: 1}));  } } } > 
                    <FontAwesomeIcon icon={faRedo} className="tool-icon"></FontAwesomeIcon>
                </div>
                <div className={`tool tool-${props.difficulty}`} data-name={'pencil'} onClick={() => { dispatch(togglePencilmarkMode()); } } >   
                    <FontAwesomeIcon icon={faPen} className="tool-icon"></FontAwesomeIcon>
                </div>
            </div>
        </div>
    )
}

export {Toolbox, tools};