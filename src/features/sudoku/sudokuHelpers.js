const removeAdjacentPencilmarks = (boardCopyArr, tileRow, tileColumn, digit) => {

    const modifiedBoard = [...boardCopyArr];
    
    // Focus on removing pencilmarks
    for(let i=0; i<9; i++) {
        // Row
        if(typeof(modifiedBoard[tileRow][i]) === 'object') {
            //console.log(modifiedBoard[tileRow][i])
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
    },

    updateBoard: function(state_boardArr, tileRow, tileColumn, digit, isPencilmarkOn) {
        const tile_state = (typeof(state_boardArr[tileRow][tileColumn]) === 'object')? 'pencilmark' : 'normal';
        if(tile_state === 'normal') {
            return (isPencilmarkOn)?
                [...state_boardArr, state_boardArr[tileRow][tileColumn] = [digit] ] 
                :
                (digit === state_boardArr[tileRow][tileColumn])?
                    [...state_boardArr, state_boardArr[tileRow][tileColumn] = '']
                    :
                    removeAdjacentPencilmarks(state_boardArr, tileRow, tileColumn, digit)
        } 
        else if(tile_state === 'pencilmark') {
            return (!isPencilmarkOn)?
                removeAdjacentPencilmarks(state_boardArr, tileRow, tileColumn, digit)
                :
                (state_boardArr[tileRow][tileColumn].includes(digit)) ?
                    [...state_boardArr, state_boardArr[tileRow][tileColumn] = (state_boardArr[tileRow][tileColumn].length > 1)? state_boardArr[tileRow][tileColumn].filter((el, ind) => el !== digit) : '']
                    :
                    [...state_boardArr, state_boardArr[tileRow][tileColumn].push(digit)]
        }
        else {
            // This should never happen
            throw new Error('Tile_state has met an unexpected exception');
        }
    },


    // EXTRA DATA FUNCTION

    checkRemovedPencilmarks: function(state_boardArr_UNMODIFIED, tileRow, tileColumn, digit, isPencilmarkOn) {
        // (Boolean digit) prevents from function running when rubber is used

        const tile_state = (typeof(state_boardArr_UNMODIFIED[tileRow][tileColumn]) === 'object')? 'pencilmark' : 'normal';

        if(!((tile_state === 'normal' && !isPencilmarkOn && !(digit === state_boardArr_UNMODIFIED[tileRow][tileColumn] && Boolean(digit))) || (tile_state === 'pencilmark' && !isPencilmarkOn))) return [];
        else {
            const removedPencilmarks = getRemovedPencilmarks(state_boardArr_UNMODIFIED, tileRow, tileColumn, digit);
            return removedPencilmarks;  // array of objects
        }
    },

    checkDigitConflicts: function(state_boardArr_UNMODIFIED, tileRow, tileColumn, digitConflicts, digit, isPencilmarkOn) {

        //console.log(state_boardArr_UNMODIFIED[tileRow][tileColumn], parseInt(digit));
        if(typeof(state_boardArr_UNMODIFIED[tileRow][tileColumn]) !== 'number' && (!parseInt(digit) || isPencilmarkOn)) {
           // console.warn('neither old nor new value is a digit');
            return digitConflicts;
        }

        // if old value is a digit - check if we can remove any digit that is causing conflict
        if(typeof(state_boardArr_UNMODIFIED[tileRow][tileColumn]) === 'number') {
            // to do...
            // Now check if we have some conflicts for a digit that we removed / replaced
            if(digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`].length) {
                //console.warn('Check if we can help !');

                for(let conflict_no = 0; conflict_no < digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`].length; conflict_no++) {
                    // Usuwamy każde wystąpienie tej cyfry z każdego konfliktu. 
                    // Jeśli po usunięciu, któryś konflikt nie posiada CREATORA, lub konfilkt nie posiada żadnych MEMBERS, możemy go usunąć (RESOLVED)
                    //console.log(digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].creator, parseInt(tileRow), '  ', parseInt(tileColumn));
                    
                    // Try to remove creator
                    if((digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].creator.row === parseInt(tileRow)) &&
                        (digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].creator.column === parseInt(tileColumn))) {
                            //console.warn(' WE ARE REMOVING CONFLICT CREATOR ~!');
                        digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].creator = null;
                    }

                    // Else if => because we are sure that conflict CREATOR cannot be conflict MEMBER at the same time
                    // We want to check if modified tile is a MEMBER of this conflict - if so, we can remove it from Members arr and BREAK the loop ASAP.
                    else if(digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members.length) {
                        for(let no=0; no<digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members.length; no++) {
                            if(digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members[no].row === parseInt(tileRow) && 
                                digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members[no].column === parseInt(tileColumn)) {

                                    digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members.splice(no, 1);
                                    break;
                            }
                        }
                    }
 
                }

                // Now we can remove outdated conflicts !
                for(let conflict_no = 0; conflict_no < digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`].length; conflict_no++) {
                    if(!digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].creator ||
                        !digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`][conflict_no].members.length) {

                            digitConflicts[`${state_boardArr_UNMODIFIED[tileRow][tileColumn]}`].splice(conflict_no, 1);
                            conflict_no = conflict_no - 1;
                    } 
                }
            }
        }

        // if new value is a digit - check if it involves new conflict
        if(parseInt(digit) && !isPencilmarkOn && (parseInt(state_boardArr_UNMODIFIED[tileRow][tileColumn]) !== parseInt(digit))) {
            // If player uses same digit twice = rubber, so this SHOULD NOT happen 
            //console.log('new value is non-pencilmark digit and we dont accept rubber effect');
            //digitConflicts[`1`].push(152);
            const conflict = getPossibleConflict(state_boardArr_UNMODIFIED, tileRow, tileColumn, digit); // will return an array of conflicted digit tile cords or else an empty array
            //console.log(conflict);

            // Now we are sure that we have correct piece of data from conflict variable - let's now modify a copy of  digitConflicts
            if(conflict.length) {

                // First push the conflict CREATOR
                digitConflicts[`${digit}`].push({creator: {row: parseInt(tileRow), column: parseInt(tileColumn)}, members: []});

                // Now push conflict MEMBERS
                for(let conflict_member_no = 0; conflict_member_no < conflict.length; conflict_member_no++) {
                    digitConflicts[`${digit}`][digitConflicts[`${digit}`].length - 1].members.push({row: conflict[conflict_member_no].row, column: conflict[conflict_member_no].column})
                }
            } 
        }

        // if both - do above commands
        return digitConflicts;

        function getPossibleConflict(board_UNMODIFIED, tileRow, tileColumn, digit) {
            const conflictArr = [];

            // Focus on removing pencilmarks
            for(let i=0; i<9; i++) {
                // Row
                if(typeof(parseInt(board_UNMODIFIED[tileRow][i])) === 'number' && (i !== parseInt(tileColumn))) {
                    if(parseInt(board_UNMODIFIED[tileRow][i]) === parseInt(digit) && !Array.isArray(board_UNMODIFIED[tileRow][i])) { 
                        conflictArr.push({row: parseInt(tileRow), column: i});
                    }
                }
                
                // Column
                if(typeof(parseInt(board_UNMODIFIED[i][tileColumn])) === 'number' && (i !== parseInt(tileRow))) {
                    if(parseInt(board_UNMODIFIED[i][tileColumn]) === parseInt(digit) && !Array.isArray(board_UNMODIFIED[i][tileColumn])) { 
                        conflictArr.push({row: i, column: parseInt(tileColumn)});
                    }
                }

            }

            for(let j=0; j<9; j++) {
                // 3x3 Square
                if(typeof(parseInt(board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(j / 3)][(Math.floor(tileColumn / 3) * 3) + (j % 3)])) === 'number' 
                    && ((Math.floor(tileRow / 3) * 3) + Math.floor(j / 3) !== parseInt(tileRow)  || (Math.floor(tileColumn / 3) * 3) + (j % 3) !== parseInt(tileColumn)))  {
                        if(parseInt(board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(j / 3)][(Math.floor(tileColumn / 3) * 3) + (j % 3)]) === parseInt(digit) 
                            && !Array.isArray(board_UNMODIFIED[(Math.floor(tileRow / 3) * 3) + Math.floor(j / 3)][(Math.floor(tileColumn / 3) * 3) + (j % 3)]))
                        {
                            // Lastly, before pushing, check if tile in this array is NOT already inside the conflictArr
                            const isNewElDuplicate = checkNewElDuplicate(conflictArr, parseInt((Math.floor(tileRow / 3) * 3) + Math.floor(j / 3)), parseInt((Math.floor(tileColumn / 3) * 3) + (j % 3)));
                            if(!isNewElDuplicate) {
                                conflictArr.push({row: parseInt((Math.floor(tileRow / 3) * 3) + Math.floor(j / 3)), column: parseInt((Math.floor(tileColumn / 3) * 3) + (j % 3))});
                            }
                        }
                }
            }

            return conflictArr;

            function checkNewElDuplicate(conflictArr, sqRow, sqCol) {
                if(!conflictArr.length) return false;
                for(let no=0; no<conflictArr.length; no++) {
                    //console.log(`${conflictArr[no].row} vs ${sqRow} :: `, `${conflictArr[no].column} === ${sqCol}`)
                    if(conflictArr[no].row === sqRow && conflictArr[no].column === sqCol) return true;
                }
                return false;
            }
        }

    }

}