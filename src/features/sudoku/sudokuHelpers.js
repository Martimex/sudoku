const removeAdjacentPencilmarks = (boardCopyArr, tileRow, tileColumn, digit) => {
    //console.log('here we go');
    const modifiedBoard = [...boardCopyArr];
    //modifiedBoard[tileRow][tileColumn] = digit;
    
    // Focus on removing pencilmarks
    for(let i=0; i<9; i++) {
        // Row
        if(typeof(modifiedBoard[tileRow][i]) === 'object') {
            console.log(modifiedBoard[tileRow][i])
            modifiedBoard[tileRow][i] = (modifiedBoard[tileRow][i].includes(digit))?
                (modifiedBoard[tileRow][i].length === 1) ?
                    ''
                    :
                    modifiedBoard[tileRow][i].filter((el, ind) => el !== digit)
                :
                modifiedBoard[tileRow][i]
        }
        
        // Column
        if(typeof(modifiedBoard[i][tileColumn]) === 'object') {
            modifiedBoard[i][tileColumn] = (modifiedBoard[i][tileColumn].includes(digit))?
                (modifiedBoard[i][tileColumn].length === 1) ?
                    ''
                    :
                    modifiedBoard[i][tileColumn].filter((el, ind) => el !== digit)
                :
                modifiedBoard[i][tileColumn]
        }

        // 3x3 Square
        if(typeof(modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)]) === 'object') {
            modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)] = (modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].includes(digit))?
                (modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].length === 1) ?
                    ''
                    :
                    modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].filter((el, ind) => el !== digit)
                :
                modifiedBoard[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)] 
        }
    }

    return [...modifiedBoard, modifiedBoard[tileRow][tileColumn] = digit];
}


const getRemovedPencilmarks = (board_UNMODIFIED, tileRow, tileColumn, digit) => {
    const removedPencilmarksArr = [];

    // Since we are working here on a safe copy, we can even use splice

    // Focus on removing pencilmarks
    for(let i=0; i<9; i++) {
        // Row
        if(typeof(board_UNMODIFIED[tileRow][i]) === 'object') {
            if(board_UNMODIFIED[tileRow][i].includes(digit))  { 
                removedPencilmarksArr.push({row: parseInt(tileRow), column: i}); 
                (board_UNMODIFIED[tileRow][i].length === 1)? 
                    board_UNMODIFIED[tileRow][i].pop() : board_UNMODIFIED[tileRow][i].filter((el, ind) => el !== digit);
            }
        }
        
        // Column
        if(typeof(board_UNMODIFIED[i][tileColumn]) === 'object') {
            if(board_UNMODIFIED[i][tileColumn].includes(digit)) { 
                removedPencilmarksArr.push({row: i, column: parseInt(tileColumn)}); 
                (board_UNMODIFIED[i][tileColumn].length === 1)?
                    board_UNMODIFIED[i][tileColumn].pop() : board_UNMODIFIED[i][tileColumn].filter((el, ind) => el !== digit);
            }
        }

        // 3x3 Square
        if(typeof(board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)]) === 'object') {
            if(board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].includes(digit)) {
                removedPencilmarksArr.push({row: parseInt((Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)), column: parseInt((Math.floor(tileColumn / 3) * 3) + (i % 3))});
                (board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].length === 1)?
                    board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].pop()
                    :
                    board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(i / 3)][(Math.floor(tileColumn / 3) * 3) + (i % 3)].filter((el, ind) => el !== digit);
            }
        }
    }

    return removedPencilmarksArr;
}


export const helpers = {

    updateNumbers: function(state_boardArr_UNMODIFIED, tileRow, tileColumn, state_numberObj, digit, isPencilmarkOn) {
        // Order here is important !
        if(typeof(state_boardArr_UNMODIFIED[tileRow][tileColumn]) === 'number') { // if the tile already had a digit
            state_numberObj[state_boardArr_UNMODIFIED[tileRow][tileColumn]]  = state_numberObj[state_boardArr_UNMODIFIED[tileRow][tileColumn]] += 1;
        }
        if(isPencilmarkOn) return state_numberObj;
        if(parseInt(digit) && parseInt(digit) !== state_boardArr_UNMODIFIED[tileRow][tileColumn]) { // it should not fire for rubber
            state_numberObj[digit] = state_numberObj[digit] -= 1
        }
        return state_numberObj;
        //return  {...state_numberObj, [`${digit}`]: state_numberObj[digit] -= 1}; // one line declaration ! same as below
    },

    updateBoard: function(state_boardArr, tileRow, tileColumn, digit, isPencilmarkOn) {
        const tile_state = (typeof(state_boardArr[tileRow][tileColumn]) === 'object')? 'pencilmark' : 'normal';
        console.warn(tile_state, state_boardArr);
        if(tile_state === 'normal') {
            return (isPencilmarkOn)?
                [...state_boardArr, state_boardArr[tileRow][tileColumn] = [digit] ] 
                :
                (digit === state_boardArr[tileRow][tileColumn])?
                    [...state_boardArr, state_boardArr[tileRow][tileColumn] = '']
                    :
                    removeAdjacentPencilmarks(state_boardArr, tileRow, tileColumn, digit) /* [...state_boardArr, state_boardArr[tileRow][tileColumn] = digit] */ // + remove adjacent pencilmarks
                    // Almost working: [...state_boardArr, state_boardArr[tileRow][tileColumn] = digit] - it's ok
        } 
        else if(tile_state === 'pencilmark') {
            return (!isPencilmarkOn)?
                removeAdjacentPencilmarks(state_boardArr, tileRow, tileColumn, digit) // + remove adjacent pencilmarks -TO DO...
                :
                (state_boardArr[tileRow][tileColumn].includes(digit)) ?
                    [...state_boardArr, state_boardArr[tileRow][tileColumn] = (state_boardArr[tileRow][tileColumn].length > 1)? state_boardArr[tileRow][tileColumn].filter((el, ind) => el !== digit) : '']
                    :
                    [...state_boardArr, state_boardArr[tileRow][tileColumn].push(digit)/* .sort() */]
        }
        else {
            // This should never happen
            throw new Error('Tile_state has met an unexpected exception');
        }
    },


    // EXTRA DATA FUNCTION

    checkRemovedPencilmarks: function(state_boardArr_UNMODIFIED, tileRow, tileColumn, digit, isPencilmarkOn) {
        // Conditions first 
        // (Boolean digit) prevents from function running when rubber is used

        const tile_state = (typeof(state_boardArr_UNMODIFIED[tileRow][tileColumn]) === 'object')? 'pencilmark' : 'normal';

        if(!((tile_state === 'normal' && !isPencilmarkOn && !(digit === state_boardArr_UNMODIFIED[tileRow][tileColumn] && Boolean(digit))) || (tile_state === 'pencilmark' && !isPencilmarkOn))) return [];
        else {
            console.log('CHECKING FOR REMOVED PENCILMARKS');
            const removedPencilmarks = getRemovedPencilmarks(state_boardArr_UNMODIFIED, tileRow, tileColumn, digit);
            return removedPencilmarks;  // array of objects
        }
    }

}