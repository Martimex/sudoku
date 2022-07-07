import  Sudoku from '../components/Sudoku.js';
import Square from '../components/Square.js';
import Tile from '../components/Tile.js';
import anime from 'animejs/lib/anime.es.js';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';

/*
    IMPORTANT REBUILD DEFINITIONS:
    ☢️ - this line is harmful. Replace textContent manipulations for currentBoard workarounds (board state inside array) and finally,
          when everything is done, just textContent initials on the board - EDIT: MOSTLY SOLVED, FOR NOW IT'S FINE
*/

const rules = {
    easy:  {
        initialNumbers: {
            min: 30,
            max: 32,
        },
        renderingTrials: 55, 
        bestMethodsAllowed: [0, 1],
        conditions: {
            square_min_fill: 2, // The least amount of initial digits that a square can have
            max_squares_min_filled: 2, // How much squares can be minimally filled ?
            //
            digit_shown_min: 2,  // The least amount each digit can be shown on the board
            max_digits_min_shown: 3, // How much digits with least amount can be ?
        },
    },
    medium: {
        initialNumbers: {
            min: 27,
            max: 29,
        },
        renderingTrials: 55, // was 70
        bestMethodsAllowed: [2, 3],
        conditions: {
            square_min_fill: 1, // The least amount of initial digits that a square can have
            max_squares_min_filled: 2, // How much squares can be minimally filled ?
            //
            digit_shown_min: 2, // The least amount each digit can be shown on the board
            max_digits_min_shown: 4, // How much digits with least amount can be ?
        },
    },
    hard: {
        initialNumbers: {
            min: 24,
            max: 26,
        },
        renderingTrials: 55, // was 85
        bestMethodsAllowed: [4, 5],
        conditions: {
            square_min_fill: 0, // The least amount of initial digits that a square can have
            max_squares_min_filled: 1, // How much squares can be minimally filled ?
            //
            digit_shown_min: 1, // The least amount each digit can be shown on the board
            max_digits_min_shown: 2, // How much digits with least amount can be ?
        },
    },
    master: {
        initialNumbers: {
            min: 25, // was 21
            max: 26, // was 23
        },
        renderingTrials: 55,  // was 100
        bestMethodsAllowed: [6, 7, null],
        conditions: {
            square_min_fill: 0, // The least amount of initial digits that a square can have
            max_squares_min_filled: 3, // How much squares can be minimally filled ?
            //
            digit_shown_min: 1, // The least amount each digit can be shown on the board
            max_digits_min_shown: 4, // How much digits with least amount can be ?

        },
    },
}

const initial_board = [];
const success_board = [];

const store = {
    sudoku_easy: [],
    sudoku_medium: [],
    sudoku_hard: [],
    sudoku_master: [],
}

const engine = {

    version: '1.0.0',
    squareRows: 3,
    squareColumns: 3,
    rows: 9,
    columns: 9,

    colors: {
        highlight: {
            easy: 'hsla(116, 40%, 30%, .4)',
            medium: 'hsla(55, 40%, 30%, .4)',
            hard: 'hsla(12, 40%, 30%, .4)',
            master: 'hsla(182, 40%, 30%, .4)',
        }
    },

    orderTiles: function(arrToOrder) {
        const compareArr = [];
        for(let x=0; x<arrToOrder.length; x++) {
            compare(arrToOrder[x], compareArr);
        }

        return compareArr;

        function compare(item, compareArr) {
            compareArr.unshift(item);
            if(compare.length > 1) {
                for(let y=1; y<compareArr.length; y++) {
                    if(parseInt(item.dataset.order) > parseInt(compareArr[y].dataset.order)) {
                        let z = compareArr[y];
                        compareArr[y] = compareArr[y-1];
                        compareArr[y-1] = z;
                    }
                }
            } else {
                return compareArr;
            }
        }
    },

    con: function(ordered) {
        for(let i=0; i<ordered.length; i++) {
            console.log(ordered[i].dataset.order);
        }
    },

    checkRowCompatibility: function(numbers_array, thisEl, ordered) {
        const squareRows = 3; const squareColumns = 3;
        const rowNo = (Math.floor(thisEl.dataset.order / (squareColumns * squareRows)));
        for(let i=0; i<(squareColumns * squareRows); i++) {
            if(numbers_array.includes(parseInt(ordered[(rowNo * (squareColumns * squareRows)) + i]))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(ordered[(rowNo * (squareColumns * squareRows)) + i].textContent)); 
                // Above line is not an issue, since checkRowCompatibil1ty is NOT USED !
                numbers_array.splice(index, 1);
            }
        }
    },

    checkColumnCompatibility: function(numbers_array, success_board, row_no, col_no) {  // Works perfectly
        for(let c=0; c<9; c++) {
            if(numbers_array.includes(parseInt(success_board[c][col_no]))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(success_board[c][col_no]));
                numbers_array.splice(index, 1);
            }
        }
    },

    checkSquareCompatibility: function(numbers_array, success_board, row_no, col_no) {  // Works fine
        const box_row_start = (Math.floor(row_no / 3)) * 3;
        const box_col_start = (Math.floor(col_no / 3)) * 3; 

        for(let box_row_no = 0; box_row_no < 3; box_row_no++) {
            for(let box_col_no = 0; box_col_no < 3; box_col_no++) {
                if(numbers_array.includes(parseInt(success_board[box_row_start + box_row_no][box_col_start + box_col_no]))) {
                    const index = numbers_array.indexOf(parseInt(success_board[box_row_start + box_row_no][box_col_start + box_col_no]));
                    numbers_array.splice(index, 1);
                }
            }
        }
    },

    applyRow: function(currRow, success_board, possibilitiesObj) {
        let usedDigits = [];
        let usedTiles = [];

        for(let currColumn= 0; currColumn<this.columns; currColumn++) { // current tile no. in current row

            let lowestArrLength = 10;
            let dangerZoneDigits = [];
    
            // What's the lowest array length ?
            for(let key in possibilitiesObj) {
                if((possibilitiesObj[key].length < lowestArrLength) && (!usedDigits.includes(parseInt(key)))) {
                    lowestArrLength = possibilitiesObj[key].length;
                }
            }

            // How many keys have the lowest array length ?
            for(let key in possibilitiesObj) {
                //console.warn(key);
                if((possibilitiesObj[key].length === lowestArrLength) && (!usedDigits.includes(parseInt(key)))) {
                    dangerZoneDigits.push(key);
                }
            }

            let rand_digit = Math.floor(Math.random() * dangerZoneDigits.length); // pick the array index (choose a digit)
            let rand_tile = Math.floor(Math.random() * possibilitiesObj[dangerZoneDigits[rand_digit]].length);

            usedTiles.push(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile]);
            usedDigits.push(dangerZoneDigits[rand_digit]);

            if(!success_board[currRow][parseInt(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile] - 1)] && 
                typeof(success_board[currRow][parseInt(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile] - 1)]) !== 'string') 
            { return false; }

            success_board[currRow][parseInt(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile] - 1)] = dangerZoneDigits[rand_digit];

            for(let key in possibilitiesObj) {
                if(possibilitiesObj[key].includes(parseInt(usedTiles[usedTiles.length - 1]))) {
                    let index = possibilitiesObj[key].indexOf(parseInt(usedTiles[usedTiles.length - 1]));
                    possibilitiesObj[key].splice(index, 1);
                }
            }
            // 1
            delete possibilitiesObj[parseInt(usedDigits[usedDigits.length - 1])];
        }

        return true;
    },

    setBoard: function() {
       // console.error('SETBOARD COMPLETED')


        //return new Promise((resolve, reject) => {
           /*  const allTiles = document.querySelectorAll('.tile');
            const allTilesArray = [...allTiles];
            const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property */
            if(success_board.length) {
                while(success_board.length) success_board.pop();
            }

            for(let success_board_row = 0; success_board_row < 9; success_board_row++) {
                success_board.push([]);
                for(let success_board_tile_in_row = 0; success_board_tile_in_row < 9; success_board_tile_in_row++) {
                    success_board[success_board_row].push('');
                }
            } 

            //console.log(ordered);
            for(let currRow=0; currRow<9; currRow++) {  // current row
                let possibilitiesObj = {  // key means digit to use; arr of values refers to which row tile no. that digit could be assigned
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                    8: [],
                    9: [],
                }

                for(let currTile_inRow = 0; currTile_inRow <this.columns; currTile_inRow++) { 
                    let allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    this.checkColumnCompatibility(allDigits, success_board, currRow, currTile_inRow);
                    this.checkSquareCompatibility(allDigits, success_board, currRow, currTile_inRow);
                    for(let digit of allDigits) {
                        possibilitiesObj[digit].push(currTile_inRow + 1);
                    }
                }

                const isSuccess = this.applyRow(currRow, success_board, possibilitiesObj);

                if(!isSuccess) {
                    for(let row_to_undo = 0; row_to_undo <= 1; row_to_undo++) {
                        for(let tile_in_row = 0; tile_in_row < 9; tile_in_row++) {
                            success_board[currRow - row_to_undo][tile_in_row] = '';
                        }
                    }
                    currRow = currRow - 2;
                }

            }

          //  resolve();
        //})
    },

    createInitialGameHistory: function() {
        const initialBoard = [];
        
        for(let sudoku_row = 0; sudoku_row < 9; sudoku_row++) {
            initialBoard.push([]);
            for(let sudoku_tile_in_row = 0; sudoku_tile_in_row < 9; sudoku_tile_in_row++) {
                (parseInt(initial_board[sudoku_row][sudoku_tile_in_row])) ?
                    initialBoard[initialBoard.length - 1].push(initial_board[sudoku_row][sudoku_tile_in_row])
                    :
                    initialBoard[initialBoard.length - 1].push('');
            }
        }

        return initialBoard;
    },

    gatherTilesData: function(allTiles) {
        const arr = [];

        for(let a=0; a<this.rows; a++) {
            arr.push([]);
        }

        for(let b=0; b<allTiles.length; b++) {
            arr[Math.floor(b / this.rows)].push(allTiles[b]);
        }
        return arr;
    },

    hideDigits: function({difficulty, theme, options}) {

        //console.time();
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);
        console.log(ordered);
        //return new Promise((resolve, reject) => {
            if(initial_board.length) {
                while(initial_board.length) initial_board.pop();
            }

            for(let initial_board_row = 0; initial_board_row < 9; initial_board_row++) {
                initial_board.push([]);
                for(let initial_board_tile_in_row = 0; initial_board_tile_in_row < 9; initial_board_tile_in_row++) {
                    initial_board[initial_board_row].push(success_board[initial_board_row][initial_board_tile_in_row]);
                }
            } 

            console.log(difficulty, theme, options);
            console.log(rules[difficulty]);

            /*const allTiles = document.querySelectorAll('.tile');
            const allTilesArray = [...allTiles];

            const ordered = this.orderTiles(allTilesArray); */

            const randInitial = Math.floor(Math.random() * ((rules[difficulty].initialNumbers.max - rules[difficulty].initialNumbers.min) + 1)) + rules[difficulty].initialNumbers.min;

            //console.log(ordered);

            // Remove counterparts
                // 1. First randomize, whether the middle tile in middle square should be hidden or not
                const randHide = Math.floor(Math.random() * 2);
                const initialCounterPartsRemove = 18;
                console.log(randHide);
                if(randHide) {initial_board[4][4] = ''; } //  + invoke score checking function

                let randomElemsToHide = [];
                for(let i=0; i<40; i++) {
                    randomElemsToHide.push(i);
                }

                for(let c=0; c<initialCounterPartsRemove; c++) {
                    let ind = Math.floor(Math.random() * randomElemsToHide.length);
                    let rand = randomElemsToHide[ind];
                    let rand_row = Math.floor(rand / 9);
                    let rand_col = rand % 9; 

                    let partDigit = [...initial_board[rand_row][rand_col]];
                    let counterPartDigit = [...initial_board[8 - rand_row][8 - rand_col]];

                    // let partDigit = ordered[rand].textContent;  // 
                    // let counterPartDigit = ordered[counterPart].textContent;  // 

                    initial_board[rand_row][rand_col] = '';  
                    initial_board[8 - rand_row][8 - rand_col] = ''; 

                    let isStillUnique = this.backtrack();
                    //const hardestMethodNo = this.solveSudoku(); -> uncomment when rebuilding
                    console.log('UNIQUE SUDOKU ?', isStillUnique);
                    if((isStillUnique) /* && (rules[difficulty]['bestMethodsAllowed'].includes(hardestMethodNo)) -> uncomment when rebuilding */) {
                        randomElemsToHide.splice(ind, 1);
                        //console.warn('UNIQUE :D');
                    } else {
                        c = c - 1;
                        initial_board[rand_row][rand_col] = partDigit[0];
                        initial_board[8 - rand_row][8 - rand_col] = counterPartDigit[0];
                    }  


                }

                //. To this point Sudoku can be 100% solved with only Single Candidate and Single Position (36 - 37 digits already removed)
            


            let substr = 2;
            let multiRemove_start = 81 - ((initialCounterPartsRemove * 2) + randHide);
            console.log(multiRemove_start, randHide);
            let multiRemove_stop = 34;
            let i;
            console.log(multiRemove_stop);

            let remainTiles = [];
            for(let board_row = 0; board_row < 9; board_row++) {
                for(let tile_in_row = 0; tile_in_row < 9; tile_in_row++) {
                    if(parseInt(initial_board[board_row][tile_in_row])) {
                        remainTiles.push([board_row, tile_in_row]);
                    }
                }
            }

            console.log(initial_board);

            for(i=multiRemove_start; i>multiRemove_stop - randHide; i = i - substr) {

                let temp = [];
                let tempDigit = [];

                for(let x=0; x<substr; x++) {
                    let rand = Math.floor(Math.random() * remainTiles.length);
                    //temp.push([]);
                    console.log(x);
                    console.log(remainTiles);
                    temp.push([remainTiles[rand][0], remainTiles[rand][1]]); // Get tile cords
                    tempDigit.push(initial_board[remainTiles[rand][0]][remainTiles[rand][1]]);
                    initial_board[remainTiles[rand][0]][remainTiles[rand][1]] = '';
                    remainTiles.splice(rand, 1);
                }

                let isStillUnique = this.backtrack();
                console.log('HAS SUDOKU JUST ONE SOLUTION ?', isStillUnique);

                if(!isStillUnique) {
                    for(let x=0; x<temp.length; x++) {
                        initial_board[temp[x][0]][temp[x][1]] = tempDigit[x];
                        remainTiles.push([temp[x][0], temp[x][1]]);
                    }
                    i = i + substr;
                }
            } 

            /* let j = {j: 0 + randHide};
            ordered.forEach(el => {
                return j.j++;
            })

            console.log('our iterator is: ', i, '  tiles uncover count is: ', j.j); */

            /* const ordered_copy = [...ordered];
            const randomized_ordered_copy = [];
            const elAndDigit = [];
            
            for(let initial_no = 0; initial_no<ordered_copy.length;) {
                let rand = Math.floor(Math.random() * ordered_copy.length);
                randomized_ordered_copy.push(ordered_copy[rand]);
                ordered_copy.splice(rand, 1);
            }

            const trials_used = {
                used: 0,
            } */
            console.time();
            const setUp = this.singleRemoval(initial_board, remainTiles, randInitial, i, randHide,  rules[difficulty]['renderingTrials'], 0); 
            console.timeEnd();
            // START OFF FROM HERE!

            // Paint Sudoku with initials
            for(let sudoku_row = 0; sudoku_row < 9; sudoku_row++) {
                for(let sudoku_tile_in_row = 0; sudoku_tile_in_row<9; sudoku_tile_in_row++) {
                    if(parseInt(initial_board[sudoku_row][sudoku_tile_in_row])) {
                        ordered[(sudoku_row * 9) + sudoku_tile_in_row].textContent = initial_board[sudoku_row][sudoku_tile_in_row];
                    } else {
                        ordered[(sudoku_row * 9) + sudoku_tile_in_row].textContent = '';
                    }
                }
            }
            //console.timeEnd();

            console.time();
            let isUnique = this.backtrack();
            const hardestMethodNo = this.solveSudoku();
            console.log('Are Sudoku preparations made nicely: ', setUp);
            console.log('Hardest method no is... ', hardestMethodNo);
            console.warn('isSudokuUnique? ', isUnique, success_board);
           
           
            console.timeEnd();


            this.applyInitials(theme);


            let difficulty_name;

            for(let key in rules) {
                if(rules[key]['bestMethodsAllowed'].includes(hardestMethodNo)) {
                    difficulty_name = key;
                }
            }

           // resolve(difficulty_name);
        //})
        return difficulty_name;
    },

    setInitialClassToChosenTiles: function({theme}) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];

        allTilesArray.forEach(tile => {
            if(tile.textContent) {  //  Not activated, so it wont be a problem
                //console.log('add!');
                tile.classList.add(`initial`, `initial-${theme}`);
            }
        })
    },

    applyInitials: function(theme) {
        console.log('Fading...');
        //console.log(ordered);
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        for(let sudoku_row = 0; sudoku_row < 9; sudoku_row++) {
            for(let sudoku_tile_in_row = 0; sudoku_tile_in_row < 9; sudoku_tile_in_row++) {
                if(parseInt(initial_board[sudoku_row][sudoku_tile_in_row])) {
                    ordered[(sudoku_row * 9) + sudoku_tile_in_row].textContent = initial_board[sudoku_row][sudoku_tile_in_row];
                    ordered[(sudoku_row * 9) + sudoku_tile_in_row].classList.add('initial', `initial-${theme}`);
                } else {
                    ordered[(sudoku_row * 9) + sudoku_tile_in_row].textContent = '';
                }
            }
        }
    },

    singleRemoval: function(initial_board, remainTiles, randInitial, singleRemove_start, randHide, trials, trials_used) {
        // RECURSIVE WAY (STILL NOT GREAT)


        /* for(let x=index; x<randomized_ordered_copy.length; x++) {
            if(isFinished) {return true; }
            trials_used['used'] = trials_used['used'] + 1 || 1;
            console.log('used ', trials_used['used'], ' trials, out of ', trials);

            if(trials_used['used'] >= trials) {
                isFinished = true;
            }

            elAndDigit.push([randomized_ordered_copy[x], randomized_ordered_copy[x].textContent]);
            randomized_ordered_copy[x].textContent = '';
            let isStillUnique = this.backtrack();
            //randomized_ordered_copy.splice(x, 1);

            if(isStillUnique) {
                //randomized_ordered_copy.splice(index, 0, elAndDigit[elAndDigit.length - 1][0])
                this.singleRemoval(randomized_ordered_copy, elAndDigit, trials, trials_used, index + 1); // + 2 because of splicing new elem
            }

            else {
                // Sudoku is not unique
                //randomized_ordered_copy.splice(x, 0, elAndDigit[elAndDigit.length - 1][0])
                randomized_ordered_copy[x].textContent = elAndDigit[elAndDigit.length - 1][1];
                elAndDigit.pop();

                if(x === randomized_ordered_copy.length - 1) {
                    elAndDigit[elAndDigit.length - 1][0].textContent = elAndDigit[elAndDigit.length - 1][1];
                    //randomized_ordered_copy.splice(0, 0, elAndDigit[elAndDigit.length - 1][0]);
                    elAndDigit.pop();

                    this.singleRemoval(randomized_ordered_copy, elAndDigit, trials, trials_used, index - 1); 
                }
            }
        }

        return false; */
        // ITERATIVE APPROACH

        //let orderedCopy = [...ordered];
        let remainTilesCopy = [...remainTiles];
        let elAndDigit = [];
        let f = remainTilesCopy;
        console.log(f);

        const time_stop = 2000;
        const measure_start = Date.now();

        for(let x=singleRemove_start; x>randInitial + randHide; x--) {
            if(trials_used >= trials) {return; }
            trials_used++;
            let rand = Math.floor(Math.random() * remainTilesCopy.length);
            elAndDigit.push([remainTilesCopy[rand][0], remainTilesCopy[rand][1], initial_board[remainTilesCopy[rand][0]][remainTilesCopy[rand][1]]]); 

            initial_board[elAndDigit[elAndDigit.length -1][0]][elAndDigit[elAndDigit.length -1][1]] = '';

            let isStillUnique = this.backtrack();

            if(isStillUnique) { // it's unique Sudoku
                remainTiles.splice(rand, 1);
                remainTilesCopy = [...remainTiles];
            } else { // not unique
                initial_board[elAndDigit[elAndDigit.length -1][0]][elAndDigit[elAndDigit.length -1][1]] = elAndDigit[elAndDigit.length -1][2];
                remainTilesCopy.splice(rand, 1);
                x = x + 1;
                console.log(remainTilesCopy.length);
                if(remainTilesCopy.length <= (remainTiles.length / 2)) { // WE WANT TO SAVE TIME FOR RENDERING, THATS WHY IT LOOKS LIKE THAT
                    //console.log(`CANNOT REMOVE MORE - ${x} from ${randInitial + randHide} remain`);
                    return;
                }
            }

            let measure_stop = Date.now();
            if(measure_stop - measure_start > time_stop) { console.warn('Process terminated - too much time ! ', measure_stop - measure_start); return; }

            elAndDigit.pop(); 
            
        }

        //console.log(`DONE SUCCESSFULLY! with ${randInitial + randHide}`)

    },

    solveSudoku: function() {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
        //
        // Our array of methods
        const methodsArr = [singleCandidate, singlePosition, candidateLines, doublePairs,  nakedSubset, hiddenSubset, xWings, swordFish];

        /* const dimensionObject = {
            row: [

            ],

            column: [

            ],

            square: [

            ],
        } */

        let grid = [];

        ordered.map((el, index) => { 
            if(index % 9 === 0 ) {
                grid.push([]);
            }
            el.textContent ? grid[grid.length -1].push(el.textContent) : grid[grid.length -1].push([]);  // ☢️  ☢️
        })

        
        console.log(grid);
        fillGrid(grid);
        //fillDimensionObject(dimensionObject, grid); // too much time consuming, remove it later on

        function fillDimensionObject(dimensionObject, grid) {
            for( let r=0; r<9; r++) {
                dimensionObject.row.push([]);
                dimensionObject.column.push([]);
                dimensionObject.square.push([]);

                for(let iir=0; iir<9; iir++) {
                    // For row
                    if(typeof(grid[r][iir]) === 'object') {dimensionObject.row[dimensionObject.row.length - 1].push(grid[r][iir])} // push elems
                    else {dimensionObject.row[dimensionObject.row.length - 1].push(parseInt(grid[r][iir]))}

                    // For column
                    if(typeof(grid[iir][r]) === 'object') {dimensionObject.column[dimensionObject.column.length - 1].push(grid[iir][r])} // push elems
                    else {dimensionObject.column[dimensionObject.column.length - 1].push(parseInt(grid[iir][r]))}

                    // For square - test if that works
                    let sq_r_compressed = Math.floor(r / 3); // 0 to 2
                    let sq_r_rest = r % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(iir / 3); // 0 to 2
                    let sq_c_rest = iir % 3; // 0 to 2

                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if(typeof(grid[sq_r][sq_c]) === 'object') {dimensionObject.square[dimensionObject.square.length - 1].push(grid[sq_r][sq_c])} // push elems
                    else {dimensionObject.square[dimensionObject.square.length - 1].push(parseInt(grid[sq_r][sq_c]))}
                }
            }
            console.log(dimensionObject);
        }

        function updateDimensionObject(dimensionObject, grid) {
            for( let r=0; r<9; r++) {
                for(let iir=0; iir<9; iir++) {
                    // For row
                    if(typeof(grid[r][iir]) === 'object') { // Modify only what's not certain - arrays
                        console.log(dimensionObject.row[r][iir], grid[r][iir])
                        dimensionObject.row[r][iir] = grid[r][iir]
                        if(dimensionObject.row[r][iir].length === 1) {
                            dimensionObject.row[r][iir].splice(0, 1, grid[r][iir]);
                        }
                    } 

                    // For column
                    if(typeof(grid[iir][r]) === 'object') { // Modify only what's not certain - arrays
                        console.log(dimensionObject.column[r][iir], grid[iir][r])
                        dimensionObject.column[r][iir] = grid[iir][r]
                        if(dimensionObject.column[r][iir].length === 1) {
                            dimensionObject.column[r][iir].splice(0, 1, grid[iir][r]);
                        }
                    } 

                    // For square - test if that works
                    let sq_r_compressed = Math.floor(r / 3); // 0 to 2
                    let sq_r_rest = r % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(iir / 3); // 0 to 2
                    let sq_c_rest = iir % 3; // 0 to 2

                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if(typeof(grid[sq_r][sq_c]) === 'object') { // Modify only what's not certain - arrays
                        console.log(dimensionObject.square[r][iir], grid[sq_r][sq_c]);
                        dimensionObject.square[r][iir] = grid[sq_r][sq_c]
                        if(dimensionObject.square[r][iir].length === 1) {
                            //dimensionObject[r][iir] = null;
                            dimensionObject.square[r][iir].splice(0, 1, grid[sq_r][sq_c]);
                        }
                    } 
                }
            }
        }

        function fillGrid(grid) {
            // Fill grid initially
            for(let row=0; row<9; row++) {
                for(let index_in_row=0;  index_in_row<9; index_in_row++) {
                    if((!grid[row][index_in_row].length) && (typeof(grid[row][index_in_row]) === 'object')) { // It's not initial
                        for(let num=1; num<=9; num++) {
                            const canBeMarked = testCandidate(grid, {row, index_in_row}, num);
                            if(canBeMarked) grid[row][index_in_row].push(num);
                        }
                    }
                }
            }
        }

        function updateGrid(grid) {
            for(let row=0; row<9; row++) {
                for(let index_in_row=0; index_in_row<9; index_in_row++) {
                    if(typeof(grid[row][index_in_row]) === 'object') {;
                        for(let index_in_Arr = 0; index_in_Arr<grid[row][index_in_row].length; index_in_Arr = index_in_Arr) {
                            const canOptionBeKept = testOrdered(ordered, {row, index_in_row}, grid[row][index_in_row][index_in_Arr]);
                            if(!canOptionBeKept) {
                                grid[row][index_in_row].splice(index_in_Arr, 1); 
                            } else {
                                index_in_Arr++;
                            }
                        }
                    }
                }
            }
        }

        function getSquares() {
            const squareArr = [];
            for(let r=0; r<9; r++) {
                let sq_r_compressed = Math.floor(r/3);
                let sq_r_rest = r % 3;
                squareArr.push([]);
                for(let iir=0; iir<3; iir++) {
                    squareArr[squareArr.length - 1].push([]);
                    for(let c=0; c<3; c++) {
                        let sq_r = (sq_r_compressed * 3) + iir;
                        let sq_c = (sq_r_rest * 3) + c;
                        squareArr[r][iir].push(grid[sq_r][sq_c]);
                    }
                }
            }
            return squareArr;
        }

        function checkBelonging(num, grid, allSquares, squareNo) {
            let cordArr = [];

            for(let square_row=0; square_row<3; square_row++) {
                for(let square_col=0; square_col<3; square_col++) {
                    if(typeof(allSquares[squareNo][square_row][square_col]) === 'object') {
                        if(allSquares[squareNo][square_row][square_col].includes(num)) {
                            cordArr.push([square_row, square_col]);
                        }
                    }
                }
            }
            const isOnlyInRowOrCol = testOnlyInRowOrCol(cordArr);
            if(!isOnlyInRowOrCol) {return false;}
            if(isOnlyInRowOrCol[0] === 'row') {
                let didHelp = false;
                const gridRow = (Math.floor(squareNo / 3) * 3) + isOnlyInRowOrCol[1]; // 0 to 8
                for(let iir=0; iir<9; iir++) {
                    if((typeof(grid[gridRow][iir]) === 'object') && (squareNo % 3 !== Math.floor(iir/3))) {
                        if((grid[gridRow][iir].length > 1) && (grid[gridRow][iir].includes(num))) {
                            let index = grid[gridRow][iir].indexOf(num);
                            grid[gridRow][iir].splice(index, 1);
                            //console.warn(`Row checker has detected that number ${num} will not be in grid[${gridRow}][${iir}]`);
                            didHelp = true;
                        }
                    }
                }
                return didHelp;
            }
            else if(isOnlyInRowOrCol[0] === 'column') {
                let didHelp = false;
                const gridCol = (Math.floor(squareNo % 3) * 3) + isOnlyInRowOrCol[1];
                for(let iic=0; iic<9; iic++) {
                    if((typeof(grid[iic][gridCol]) === 'object') && (Math.floor(squareNo / 3) !== Math.floor(iic / 3))) {
                        if((grid[iic][gridCol].length > 1) && (grid[iic][gridCol].includes(num))) {
                            let index = grid[iic][gridCol].indexOf(num);
                            grid[iic][gridCol].splice(index, 1);
                            //console.warn(`Column checker has detected that number ${num} will not be in grid[${iic}][${gridCol}]`);
                            didHelp = true;
                        }
                    }
                }
                return didHelp;
            }

            ///
            function testOnlyInRowOrCol(cordArr) {
                let x_isUnique = true;
                let y_isUnique = true;
                for(let digitCord = 1; digitCord<cordArr.length; digitCord++) {
                    if(cordArr[0][0] !== cordArr[digitCord][0]) {x_isUnique = false;}
                    if(cordArr[0][1] !== cordArr[digitCord][1]) {y_isUnique = false;}
                    if((!x_isUnique) && (!y_isUnique)) {return false;}
                }
                if(x_isUnique) {return ['row', cordArr[0][0]];}
                else {return ['column', cordArr[0][1]];}
            }
        }


        function singleCandidate() {
            let helpedSolving = null;
            // Single candidate checker !
            const x = [...grid];
            console.log(x);
            for(let r=0; r<9; r++) {
                for(let iir=0; iir<9; iir++) {
                    if((grid[r][iir].length <= 1) && (typeof(grid[r][iir]) !== 'string')) { 
                        //ordered[(r * 9) + iir].style.color = 'tomato';
                        ordered[(r * 9) + iir].textContent = grid[r][iir][0];  // ☢️
                        grid[r][iir] = grid[r][iir][0];
                        helpedSolving = true;
                    }
                }
            }
            return helpedSolving;
        }

        // Single position checker
        function singlePosition() {
            let helpedSolving = null;
            // 1. Row & column
            // Create column, row, square object
            const dimensionObject = {
                row: [

                ],

                column: [

                ],

                square: [

                ],
            }

            for(let r=0; r<9; r++) {
                dimensionObject.row.push([]);
                dimensionObject.column.push([]);
                dimensionObject.square.push([]);

                for(let iir=0; iir<9; iir++) {
                    // For row
                    if(typeof(grid[r][iir]) === 'object') {dimensionObject.row[dimensionObject.row.length - 1].push(...grid[r][iir])} // Extract array and only push elems
                    else {dimensionObject.row[dimensionObject.row.length - 1].push(parseInt(grid[r][iir]))}

                    // For column
                    if(typeof(grid[iir][r]) === 'object') {dimensionObject.column[dimensionObject.column.length - 1].push(...grid[iir][r])} // Extract array and only push elems
                    else {dimensionObject.column[dimensionObject.column.length - 1].push(parseInt(grid[iir][r]))}

                    // For square - test if that works
                    let sq_r_compressed = Math.floor(r / 3); // 0 to 2
                    let sq_r_rest = r % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(iir / 3); // 0 to 2
                    let sq_c_rest = iir % 3; // 0 to 2

                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if(typeof(grid[sq_r][sq_c]) === 'object') {dimensionObject.square[dimensionObject.square.length - 1].push(...grid[sq_r][sq_c])} // Extract array and only push elems
                    else {dimensionObject.square[dimensionObject.square.length - 1].push(parseInt(grid[sq_r][sq_c]))}
                }

                let singPos_Row = occuredOnce(dimensionObject.row[dimensionObject.row.length - 1], dimensionObject.row[dimensionObject.row.length - 1].length, 'r');
                let singPos_Col = occuredOnce(dimensionObject.column[dimensionObject.column.length - 1], dimensionObject.column[dimensionObject.column.length - 1].length, 'c');
                let singPos_Sqr = occuredOnce(dimensionObject.square[dimensionObject.square.length - 1], dimensionObject.square[dimensionObject.square.length - 1].length, 's');

                for(let iir=0; iir<9; iir++) {
                    let sq_r_compressed = Math.floor(r / 3); // 0 to 2
                    let sq_r_rest = r % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(iir / 3); // 0 to 2
                    let sq_c_rest = iir % 3; // 0 to 2

                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if((typeof(grid[r][iir]) === 'object') && (singPos_Row.length > 0)) {
                        //console.log(singPos_Row);
                        let isUpd = applyOnePosition(grid, r, iir, singPos_Row, 'r');
                        if(isUpd) {helpedSolving = true};
                        //console.log('upd  --- ', upd)
                        //grid[r][iir] = upd;
                    }
                    if((typeof(grid[iir][r]) === 'object') && (singPos_Col.length > 0)) {
                        //console.log(singPos_Col);
                        let isUpd = applyOnePosition(grid, iir, r, singPos_Col, 'c');
                        if(isUpd) {helpedSolving = true};
                        //console.log('upd  --- ', upd)
                        //grid[iir][r] = upd;
                    }
                    if((typeof(grid[sq_r][sq_c]) === 'object') && (singPos_Sqr.length > 0)) {
                        //console.log(singPos_Sqr);
                        let isUpd = applyOnePosition(grid, sq_r, sq_c, singPos_Sqr, 's');
                        if(isUpd) {helpedSolving = true};
                        //console.log('upd  --- ', upd)
                        //grid[sq_r][sq_c] = upd;
                    }
                }
            }

            //console.log(dimensionObject);
            console.log(helpedSolving);
            return helpedSolving;
        }

        function candidateLines()  {
            let helpedSolving = null;
            const allSquares = getSquares();
            //console.log(allSquares); Checked: Works correctly
            for(let squareNo=0; squareNo<9; squareNo++) {
                let exceptionDigits = new Set();
                let digitsToCheck = new Set();
                for(let rowNo=0; rowNo<3; rowNo++) {
                    for(let columnNo=0; columnNo<3; columnNo++) {
                        if(typeof(allSquares[squareNo][rowNo][columnNo]) === 'object') {
                            if(allSquares[squareNo][rowNo][columnNo].length === 1) {
                                exceptionDigits.add(allSquares[squareNo][rowNo][columnNo][0]);
                            } else {
                                digitsToCheck.add(...allSquares[squareNo][rowNo][columnNo]);
                            }
                        }
                    }
                }
                //console.log('digitsToCheck  ', digitsToCheck);
                //console.log('exceptionDigits  ', exceptionDigits);
                for(let num = 1; num <= 9; num++) { // Verify if that cant be improved (time-wise)
                    if((digitsToCheck.has(num)) && (!exceptionDigits.has(num))) {
                        //console.log('we are checking num-', num);
                        const isBelonging = checkBelonging(num, grid, allSquares, squareNo);
                        if(isBelonging) {
                            helpedSolving = true;
                        }
                    }
                }
            }
            return helpedSolving;
        }

        function doublePairs() { // it also includes multiple lines technique (so it's 2 in 1, cool ! )
            // Rzędy i kolumny możemy bezpiecznie pobierać z grida, a kwadraty ze specjalnej funkcji getSquares()
            let helpedSolving = null;
            const allSquares = getSquares();
            //console.log(allSquares);
            for(let square_in_line=0; square_in_line < 3; square_in_line++) {

                // Set, z którego pobierzemy wszystkie liczby
                let square_in_line_row_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let square_in_line_col_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let square_in_line_row_set = new Set();
                let square_in_line_col_set = new Set();

                // Create 2 pointers that changes their position over every iteration
                /*  let pointer1 = tile_in_line;
                let pointer2 = (tile_in_line + 1) % 3;
                let not_detected = (tile_in_line + 2) %3;  */

                /*    p1   p2    nd        nd   p1    p2       p2    nd    p1
                    ////  ////  ////     ////  ////  ////     ////  ////  //// 
                    /  /  /  /  /  / ->  /  /  /  /  /  /  -> /  /  /  /  /  /
                    ////  ////  ////     ////  ////  ////     ////  ////  ////
                */




                for(let in_line = 0; in_line<3; in_line++) {
                    for(let il=0; il<allSquares[(square_in_line * 3) + in_line].length; il++) {
                        for(let el=0; el<allSquares[(square_in_line * 3) + in_line][il].length; el++) {
                            if(typeof(allSquares[(square_in_line * 3) + in_line][il][el]) !== 'object') {
                                square_in_line_row_set.add(parseInt(allSquares[(square_in_line * 3) + in_line][il][el]));
                            }
                            if(typeof(allSquares[(in_line * 3) + square_in_line][il][el]) !== 'object') {
                                square_in_line_col_set.add(parseInt(allSquares[(in_line * 3) + square_in_line][il][el]));
                            }
                        }
                    }
                }


                // Pobierasz rząd / kolumnę z pointer1 i pointer2 i sprawdzasz, czy występuje jako opcja w trzech
                // kwadratach, przez które przechodzi. Jeśli tak to szukaj kwadratu, w którego kratkach (wewnątrz linii
                // not_detected) ona nie występuje. Jeśli taki kwadrat jest, to dla jego pozostałych linii można wykluczyć
                // z opcji sprawdzaną cyfrę

                for(let el of square_in_line_row_set) {
                    if(square_in_line_row_nums.includes(el)) {
                        let index = square_in_line_row_nums.indexOf(el);
                        square_in_line_row_nums.splice(index, 1);
                    }
                }

                for(let el of square_in_line_col_set) {
                    if(square_in_line_col_nums.includes(el)) {
                        let index = square_in_line_col_nums.indexOf(el);
                        square_in_line_col_nums.splice(index, 1);
                    }
                }

               /*  console.log('sq_row', square_in_line_row_set);
                console.log('sq_col', square_in_line_col_set);

                console.log('nums_row', square_in_line_row_nums);
                console.log('nums_col', square_in_line_col_nums); */

                for(let x=0; x<square_in_line_row_nums.length; x++) {
                   const didHelp =  lookForDoublePairs(grid, allSquares, square_in_line_row_nums[x], square_in_line, 'row');
                   if(didHelp) { helpedSolving = true;}
                }
                for(let y=0; y<square_in_line_col_nums.length; y++) {
                    const didHelp = lookForDoublePairs(grid, allSquares, square_in_line_col_nums[y], square_in_line, 'column');
                    if(didHelp) { helpedSolving = true;}
                }
            }
            return helpedSolving;
        }

        function nakedSubset(isHidden) {
            // Has to be applied for rows, columns and squares || we are looking for pair, triples, quads
            let helpedSolving = null;
            const allSquares = getSquares();

            if(isHidden) {console.log('%c ITS HIDDEN SUBSET...', 'background: #ff8c00; color: black;'); }
            else {console.log('%c ITS NAKED SUBSET...', 'background: #abe; color: black;');}

            const nakedSubset_size = [2, 3]; // We only work for double / tripple subsets + CHANGE IT LATER TO: [2, 3] !!
           
            const dimensionObj = {
                row: {
                    2: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [], // for testNakedSubset
                    },
                    3: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [],  
                    },
                },
                column: {
                    2: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [],
                    },
                    3: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [],
                    },
                },
                square: {
                    2: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [],
                    },
                    3: {
                        dimArr: [],
                        uniqueOptionsAsNaked_dim: [],
                    },
                },
            }

            //console.error(Object.keys(dimensionObj)[1]);
            //console.error(Object.keys(dimensionObj).length);
            

            for(let subset_iter=0; subset_iter<nakedSubset_size.length; subset_iter++) { // Dla wybranej długości subsetu
                for(let dimension_no=0; dimension_no<Object.keys(dimensionObj).length;  dimension_no++) { // Dla wybranego dimension (rząd / kolumna / kwadrat)
                    for(let dimension_item=0; dimension_item<9; dimension_item++) { // Dla zawartości wspomnianego dimension (linia - row, col || box - square)
                        dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]].dimArr.push([]);
                        dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]].uniqueOptionsAsNaked_dim.push([]);
                        let isHelpful = testNakedSubset(grid, allSquares, Object.keys(dimensionObj)[dimension_no], dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]], nakedSubset_size[subset_iter], dimension_no, dimension_item, isHidden);
                        if(isHelpful) {helpedSolving = true;}
                    }
                }
            }

            // Najpierw zastosujmy podział na row, column, square, a PÓŹNIEJ wrzucaj do pętli 9 wywołań (jako kolejne rzędy / kolumny / kwadraty)
            // Więc najpierw zastosujmy obiekt, po których kluczach będziemy iterować (NAJPIERW DIMENSION, POTEM ITER)
            // Dzięki temu skrócimy też kod i będzie wyglądał bardziej logicznie

            return helpedSolving;
        }

        function hiddenSubset() {
            // Has to be applied for rows, columns and squares || we are looking for pair, triples, quads
            let helpedSolving = null;
            const x = nakedSubset('hidden');

            if(x) {helpedSolving = true;}

            /* const allSquares = getSquares();
            console.log('%c When no other method helps...', 'background: #ff8c00; color: black;')

            const hiddenSubset_size = [2, 3];
            
            const dimensionObj = {
                row: {
                    2: {
                        dimArr: [],
                    },
                    3: {
                        dimArr: [],
                    },
                },
                column: {
                    2: {
                        dimArr: [],
                    },
                    3: {
                        dimArr: [],
                    },
                },
                square: {
                    2: {
                        dimArr: [],
                    },
                    3: {
                        dimArr: [],
                    },
                },
            }

            for(let subset_iter=0; subset_iter<hiddenSubset_size.length; subset_iter++) { // Dla wybranej długości subsetu
                for(let dimension_no=0; dimension_no<Object.keys(dimensionObj).length; dimension_no++) { // Dla rzędu/ kolumny / kwadratu
                    for(let dimension_item=0; dimension_item<9; dimension_item++) { // Dla zawartości wspomnianego dimension (linia - row, col || box - square)
                        dimensionObj[Object.keys(dimensionObj)[dimension_no]][hiddenSubset_size[subset_iter]].dimArr.push([]);
                        //dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]].uniqueOptionsAsNaked_dim.push([]);
                        let isHelpful = testHiddenSubset(grid, Object.keys(dimensionObj)[dimension_no], dimensionObj[Object.keys(dimensionObj)[dimension_no]][hiddenSubset_size[subset_iter]], hiddenSubset_size[subset_iter], dimension_no, dimension_item);
                        if(isHelpful) {helpedSolving = true;}
                    }
                }
            } */

            return helpedSolving;
        }

        function xWings(isSwordfish) {
            let helpedSolving = null;
            
            if(isSwordfish) {
                console.log(`%c Welcome to Swordfish !`, 'background: hsla(12, 60%, 50%); color: #000;');
            } else {
                console.log(`%c xWings needed...`, 'background: hsla(55, 60%, 65%, 50%); color: hsl(166, 70%, 70%);');
            }

            const dimensionObj = {
                row: {
                    numsTwiceInDim: [],
                    numsTwiceInDim_Indexes: [],
                },

                column: {
                    numsTwiceInDim: [],
                    numsTwiceInDim_Indexes: [],
                },
            }

            const detectedDimensions = ['row', 'column'];
            // Fill dimensionObj with values 

            for(let currentDimension_no = 0; currentDimension_no < detectedDimensions.length; currentDimension_no++) {
                // For each dimension (row , column)
                for(let currentLine_no = 0; currentLine_no < 9; currentLine_no++) {
                    // For each line in chosen dimension (line in row, line in column)
                    const twiceInDimNums = {

                    }               
                    for(let tileInLine_no = 0; tileInLine_no < 9; tileInLine_no ++) {
                        // For each tile in line ( tile in line ... in row, tile in line ... in column)
                        if(detectedDimensions[currentDimension_no] === 'row') {
                            if(typeof(grid[currentLine_no][tileInLine_no]) === 'object') {
                                // We can surmise it's length is two or more
                                //dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim'][currentLine_no].push([...grid[currentLine_no][tileInLine_no]]);
                                if(grid[currentLine_no][tileInLine_no].length > 1) {
                                    //twiceInDimNums[grid[currentLine_no][tileInLine_no]] = [];
                                    for(let no = 0; no<grid[currentLine_no][tileInLine_no].length; no++) {
                                        if(!twiceInDimNums.hasOwnProperty(grid[currentLine_no][tileInLine_no][no])) {
                                            twiceInDimNums[grid[currentLine_no][tileInLine_no][no]] = [tileInLine_no];
                                        } else {
                                            twiceInDimNums[grid[currentLine_no][tileInLine_no][no]].push(tileInLine_no);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            // detectedDimensions[currentDimension_no] === 'column'
                            if(typeof(grid[tileInLine_no][currentLine_no]) === 'object') {
                                // We can surmise it's length is two or more
                                if(grid[tileInLine_no][currentLine_no].length > 1) {
                                    //twiceInDimNums[grid[tileInLine_no][currentLine_no]] = [];
                                    for(let no = 0; no<grid[tileInLine_no][currentLine_no].length; no++) {
                                        if(!twiceInDimNums.hasOwnProperty(grid[tileInLine_no][currentLine_no][no])) {
                                            twiceInDimNums[grid[tileInLine_no][currentLine_no][no]] = [tileInLine_no];
                                        } else {
                                            twiceInDimNums[grid[tileInLine_no][currentLine_no][no]].push(tileInLine_no);
                                        }
                                    }
                                }
                            }
                            /* if(typeof(grid[tileInLine_no][currentLine_no]) === 'object') {
                                dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim'][currentLine_no].push([...grid[tileInLine_no][currentLine_no]]);
                            } else {
                                dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim'][currentLine_no].push([]);
                            } */

                        }
                    }
                    //console.log(twiceInDimNums);

                    dimensionObj[detectedDimensions[currentDimension_no]].numsTwiceInDim.push([]);
                    dimensionObj[detectedDimensions[currentDimension_no]].numsTwiceInDim_Indexes.push([]);

                    for(let num in twiceInDimNums) {
                        if(twiceInDimNums[num].length === 2) {
                            //console.log('num is present exactly twice in this line');
                            dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim'][currentLine_no].push(parseInt(num));
                            dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim_Indexes'][currentLine_no].push(twiceInDimNums[num]);
                        }
                    }
                }

                let testIfHelps = checkForXWingsOrSwordfish(grid, dimensionObj, detectedDimensions[currentDimension_no], isSwordfish);
                if(testIfHelps) {helpedSolving = true;}
            }

            console.log(dimensionObj);

            // Now we got initial (necessary) data items covered in dimension Obj
            // Therefore we can init helper - solver function (it will happen exaclty twice: for row, and for column)

            /* 
                RULES:
                - DIMENSIONS: ROW && COLUMN || 
                - 
            */



            return helpedSolving;
        }

        function swordFish() {
            let helpedSolving = null;
            const s = xWings('swordfish');

            if(s) { helpedSolving = true; }

            return helpedSolving;
        }


        // while kończy się, kiedy nasza ostatnia najtrudniejsza metoda zwróci false - wtedy już nie można bardziej rozwiązać sudoku zaimplementowanymi obecnie metodami
        // REMOVE AFTER DEV HIDDEN SUBSET:
        /* grid = [
            [5, 2, 8, 6, [1, 3, 7], [1, 3, 7], [1, 7], 4, 9],
            [1, 3, 6, 4, 9, [7, 8], [7, 8], 2, 5],
            [7, 9, 4, 2, [1, 8], 5, 6, 3, [1, 8]],
            [[3, 4, 6, 9], [5, 6, 8], [3, 5], 1, [3, 4, 7], [3, 7], 2, [5, 9], [4, 7, 8]],
            [[4, 9], [1, 5], 7, 8, 2, 6, 3, [5, 9], [1, 4]],
            [[4, 3], [1, 8], 2, 5, [3, 4, 7], 9, [1, 8], 6, [4, 7]],
            [2, 4, [1, 5], 3, [1, 5, 8], [1, 8], 9, 7, 6],
            [8, [5, 6], 9, 7, [5, 6], 2, 4, 1, 3],
            [[3, 6], 7, [1, 3], 9, [1, 6], 4, 5, 8, 2],
        ] WORKED ! */
        
        /* grid = [
            [3, 7, [2,5,6], 4, [2,5,6], 8, 1, [2,5,6,9], [2, 9]],
            [[1,2,6], [5,6,8], [1,2,5,6,8], 9, [2,5,6], 3, 7, [2,5,6], 4],
            [9, 4, [2,5,6], 1, [2,5,6,7], [2,5,6,7], [5,6], 8, 3],
            [4, 2, [1,7], [3,7,8], [1,3,6,7,8,9], [1,6,7], [3,8], [1,7,9], 5],
            [[1,6,7], [3,6,9], [1,3,6,7], 5, [2,8], 4, [2,8], [1,7,9], [7,9]],
            [8, [5,9], [1,5,7], [3,7], [1,2,3,7,9], [1,2,7], [2,3], 4, 6],
            [[2,7], 1, [2,3,7,8], [3,7,8], 4, 9, [5,6], [5,6], [7,8]],
            [5, [3,8], 9, 6, [1,3,7,8], [1,7], 4, [2,7], [2,7,8]],
            [[6,7], [6,8], 4, 2, [5,7,8], [5,7], 9, 3, 1],
        ] WORKS, BUT UPDATE GRID NEEDS TO BE REMOVED, JUST BECAUSE FOR TESTING PURPOSES WE ARE NOT DEALING WITH SUDOKU PAINTINGS, WHICH
          UPDATE GRID FUNCTION ACTUALLY DOES, AND AT THE VERY END, IT THROWS ERROR, ONCE THE NEW METHOD FIND NEW DIGIT */

        /* grid = [
            [2, [3,6], [3,5,6], [5,8], 4, [3,5,6,9], 1, [8,9], 7],
            [9, [3,6,7], [1,3,5,6,7], [1,7], [5,6,8], [1,3,5,6], 2, 4, [3,8]],
            [8, 4, [1,3,7], 2, [3,7], [1,3,9], 5, 6, [3,9]],
            [7, 1, 2, 4, 9, 8, 3, 5, 6],
            [6, [3,8], [3,8], [1,7], [2,5], [1,2,5], 4, [7,9], [1,9]],
            [5, 9, 4, 6, [3,7], [1,3], [7,8], 2, [1,8]],
            [4, 5, [6,8], 3, [6,8], 7, 9, 1, 2],
            [1, [2,6,7,8], [6,7,8], 9, [2,6,8], 4, [6,7,8], 3, 5],
            [3, [2,6,7,8], 9, [5,8], 1, [2,5,6], [6,7,8], [7,8], 4],
        ] WE DIDN'T GET NOTICED BY CONSOLE MESSAGE, BUT IT WORKS AS EXPECTED */

        /* grid = [
            [8, [2,5], 1, [2,7], [3,5], 6, [3,7], 9, 4],
            [3, [2,5], [4,6], [2,4,7], [1,5], 9, [1,6,7], 8, [1,2,7] ],
            [9, 7, [4,6], [2,4], 8, [1,3], 5, [2,6], [1,2,3]],
            [5, 4, 7, [8,9], 6, 2, [1,8], 3, [1,9]],
            [6, 3, 2, [8,9], [1,4], [1,4], [7,8], 5, [7,9]],
            [1, 9, 8, 3, 7, 5, 2, 4, 6],
            [[4,7], 8, 3, 6, 2, [4,7], 9, 1, 5],
            [[4,7], 6, 5, 1, 9, 8, [3,4,7], [2,7], [2,3,7]],
            [2, 1, 9, 5, [3,4], [3,4,7], [4,6,7], [6,7], 8],
        ] IT WORKS, BUT INSTEAD OF THREE DOUBLE HIDDEN SUBSET THE REMOVAL, THE HIDDEN NORMAL SUBSET DOES, SO WE DO NOT KNOW THE
        EXACT BEHAVIOUR OF THREE DOUBLE HIDDEN SUBSET - IT EITHER WOULD NEVER BE USEFUL OR ONLY USEFUL FOR VERY RARE, SPECIFIC CASES*/

        /* grid = [
            [9, [6,8], [2,4], [2,4], 5, 1, 7, 3, [6,8]],
            [1, [4,6], 7, 3, 9, 8, 2, [4,6], 5],
            [5, [3,4,8], [2,3,4], [2,4], 7, 6, [4,8], 9, 1],
            [8, 1, [6,9], 7, 2, 4, 3, 5, [6,9]],
            [2, [3,4], [3,4,9], 1, 6, 5, [4,8,9], [4,8], 7],
            [[4,6], 7, 5, 9, 8, 3, [4,6], 1, 2],
            [[4,6], 2, 1, 5, 3, 7, [4,6,8,9], [4,6,8], [4,6,8,9]],
            [7, 5, 8, 6, 4, 9, 1, 2, 3],
            [3, 9, [4,6], 8, 1, 2, 5, 7, [4,6]],
        ]  //UNCOMMENT FOR TESTING PURPOSES - IT NEEDS SOME DEEPER CHECKINGS - edit: Works cool as for x-wings ! */

       /*  grid = [
            [7, [2,5], 3, 8, [1,5], 6, [1,2,4], 9, [2,4]],
            [6, 1, 4, 9, 2, 3, 7, [5,8], [5,8]],
            [9, 8, [2,5], [1,5], 7, 4, [1,2], 6, 3],
            [[2,5], 3, [6,8], [1,6], [1,4,8], [8,9], [2,4,5,8], 7, [2,4,5,8,9]],
            [1, 7, 9, 2, [4,8], 5, 6, 3, [4,8]],
            [[2,5], 4, [6,8], [6,7], 3, [7,8,9], [2,5,8], 1, [2,5,8,9]],
            [8, [2,5], 1, [4,5,7], 9, [2,7], 3, [2,4,5], 6],
            [3, 9, 7, [4,5], 6, [2,8], [2,4,5,8], [2,4,5,8], 1],
            [4, 6, [2,5], 3, [5,8], 1, 9, [2,5,8], 7],
        ] // if you comment all methods besides x-wings, it's actually finding the right number ! */

        /* grid = [
            [1, 9, 5, 3, 6, 7, 2, 4, 8],
            [[2,4], 7, 8, [1,2,4], 5, [1,4], 3, 6, 9],
            [3, [2,4], 6, [2,4], 9, 8, 1, 5, 7],
            [[2,6], [1,2,6], 3, 7, 8, [1,4], 5, 9, [2,4]],
            [7, [1,2], 9, [1,4], [2,3], 5, [4,8], [3,8], 6],
            [5, 8, 4, 9, [2,3], 6, 7, 1, [2,3]],
            [8, 3, 2, 5, 4, 9, 6, 7, 1],
            [9, [4,6], 7, [6,8], 1, 3, [4,8], 2, 5],
            [[4,6], 5, 1, [6,8], 7, 2, 9, [3,8], [3,4]],
        ] // for Swordfish - IT WORKS PERFECTLY FINE ! */

        /* grid = [
            [5, 6, 3, [1,2,4,7], [4,7], [1,2], 9, 8, [1,4]],
            [1, 8, 4, 9, 5, 3, 2, 6, 7],
            [[2,9], [2,9], 7, [1,4], 6, 8, [1,5], [4,5], 3],
            [[2,7,9], [1,2,5,7,9], [1,2], 6, [1,9], [2,5], 4, 3, 8],
            [4, [1,5], 6, 8, 3, 7, [1,5], 9, 2],
            [3, [1,2,5,9], 8, [2,5], [1,9], 4, 6, 7, [1, 5]],
            [6, 4, [1,5], 3, 8, [1,5], 7, 2, 9],
            [8, [1,7], 9, [1,7], 2, 6, 3, [4,5], [4,5]],
            [[2,7], 3, [2,5], [4,5,7], [4,7], 9, 8, 1, 6],
        ] // For Swordfish - Perfect ! It gathered all 3 unnecessary numbers ! */

        let currMethodNo = 0;
        let bestMethod = 0;
        while(currMethodNo < methodsArr.length) {
            let doesItHelp = methodsArr[currMethodNo]();
            if(doesItHelp) {
                /* if(currMethodNo === 2) {console.warn(':)')} */
                console.log('back to method first'); 
                const y = [...grid];
                console.log(y);
                if(currMethodNo > bestMethod) {
                    bestMethod = currMethodNo;
                }
                currMethodNo = 0; 
                updateGrid(grid); 
            }
            else if(!doesItHelp) {
                currMethodNo++;
                console.log('need harder method');
            }
            //updateGrid(grid);
            //updateDimensionObject(grid, dimensionObject);
        }
        const isGridFullyFilled = testGridFullyFilled(grid); 
        if(!isGridFullyFilled) {
            bestMethod = null;
        }

        function testGridFullyFilled(grid) {
            //console.log(grid);
            for(let row = 0; row<9; row++) {
                for(let col = 0; col<9; col++) {
                    if(typeof(grid[row][col]) === 'object') {
                        return false;
                    }
                }
            }
            return true;
        }

/*         function testHiddenSubset(grid, dimensionObj_dim, dimensionObj_dim_subset_l,  hiddenSubset_l, dimension_no, dimension_item) {
            console.log(';;;;;;;;;;');

            
            for(let dimension_item_tile=0; dimension_item_tile<9; dimension_item_tile++) { // Czyli dla każdego kafelka w linii / boxie
                dimensionObj_dim_subset_l.dimArr[dimension_item].push([]);
                if(dimensionObj_dim === 'row') {
                    if(typeof(grid[dimension_item][dimension_item_tile]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[dimension_item][dimension_item_tile]);
                    }
                }
                else if(dimensionObj_dim === 'column') {
                    if(typeof(grid[dimension_item_tile][dimension_item]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[dimension_item_tile][dimension_item]);
                    }
                }
                else { // dimensionObj_dim === 'square'
                    let sq_r_compressed = Math.floor(dimension_item / 3); // 0 to 2
                    let sq_r_rest = dimension_item % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(dimension_item_tile / 3); // 0 to 2
                    let sq_c_rest = dimension_item_tile % 3; // 0 to 2
    
                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if(typeof(grid[sq_r][sq_c]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[sq_r][sq_c]);
                    }
                }
            }
            
            console.log(dimensionObj_dim_subset_l.dimArr[dimension_item]); // options for all tiles in current line / box
            // Gather all numbers from current line / box and how much times they happen
            const allNumsAsOptions = {};

            for(let tileNo = 0; tileNo <dimensionObj_dim_subset_l.dimArr[dimension_item].length; tileNo++) {
                for(let option_index = 0; option_index <dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo].length; option_index++) {
                    allNumsAsOptions[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]] = (allNumsAsOptions[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]]+1) || 1;
                }
            }

            console.log(allNumsAsOptions); // hiddenSubset_l - current length of subset we look for  (tripples / doubles)
            const digitsToCheck = [];

            for(let key in allNumsAsOptions) {
                if(allNumsAsOptions[key] === hiddenSubset_l) {
                    digitsToCheck.push(parseInt(key));
                } 
                else if(allNumsAsOptions[key] < hiddenSubset_l) {
                    digitsToCheck.push(key);
                }
            }

            console.log(digitsToCheck);

        } */

        function checkForXWingsOrSwordfish(grid, dimensionObj, currentDim, isSwordfish) {
            let isHelpful = null;
            let pointersCount = 2;
            if(isSwordfish) {
                pointersCount = 3;
                //console.warn('its Swordfish');
            }

            if(!isSwordfish) {
                // Below loop is for X-wings only (it has to be conditional separated)
                for(let pointer_static_pos = 0; pointer_static_pos < (9 - (pointersCount - 1)); pointer_static_pos++) {
                    for(let pointer_dynamic_pos = pointer_static_pos + 1; pointer_dynamic_pos < (9 - (pointersCount - 2)); pointer_dynamic_pos++) {
                        for(let allPointerDoubles = 0; allPointerDoubles< dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos].length; allPointerDoubles++) {
                            if(dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos].includes(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles])) {
                                let staticInd = dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos].indexOf(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles]);
                                let sameIndexCount = 0;
                                for(let indexNoToCompare = 0; indexNoToCompare<dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][allPointerDoubles].length; indexNoToCompare++) {
                                    // It's always of length 2
                                    if(dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd].includes(dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][allPointerDoubles][indexNoToCompare])) {
                                        sameIndexCount++;
                                    }
                                }

                                if(sameIndexCount === dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][allPointerDoubles].length) {
                                    // X-wing applies ! Check counterpart dimension for the digit found as an X-wing and remove those
                                    let pointersIndexes_arr = [pointer_static_pos, pointer_dynamic_pos]; // for swordfish, this var would have 3 elems - all pointer indexes


                                    let didHelp = checkCounterpartRemoval(currentDim, pointersIndexes_arr, dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos][staticInd], dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd], pointersCount);
                                    if(didHelp) {isHelpful = true;}
                                    // Do tej funkcji jako argumentów potrzebujemy:
                                    // Dimension - czy to rząd, czy kolumna
                                    // Nr indeksów wszystkich wskaźników, tworzących X-wing (2 wskaźniki) lub swordfish (3 wskaźniki)
                                    // Cyfrę, dla której znaleźliśmy x-wings / swordfish
                                    // Indeksy wystąpienia tej cyfry we wskaźnikach
                                }
                            }
                        }
                    }
                }
            } 
            
            else {
                // For Swordfish method
                for(let pointer_static_pos = 0; pointer_static_pos < (9 - (pointersCount - 1)); pointer_static_pos++) {
                    for(let pointer_dynamic_pos = pointer_static_pos + 1; pointer_dynamic_pos < (9 - (pointersCount - 2)); pointer_dynamic_pos++) {
                        for(let pointer_conditional_pos = pointer_dynamic_pos + 1; pointer_conditional_pos < (9 - (pointersCount - 3)); pointer_conditional_pos++) {
                            for(let allPointerDoubles = 0; allPointerDoubles< dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos].length; allPointerDoubles++) {
                                if(dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos].includes(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles])) {
                                    let staticInd = dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos].indexOf(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles]);
                                    let sameIndexCount = 0;
                                    for(let indexNoToCompare = 0; indexNoToCompare<dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][allPointerDoubles].length; indexNoToCompare++) {
                                        // It's always of length 2
                                        if(dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd].includes(dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][allPointerDoubles][indexNoToCompare])) {
                                            sameIndexCount++;
                                        }
                                    }

                                    if(sameIndexCount === 1) {
                                        // Pobierz unikalne indeksy wskaźników static i dynamic, dla których występuje ta cyfra - i sprawdź
                                        // czy wskaźnik conditional zawiera je wszystkie
                                        let dynamicInd = dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos].indexOf(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles]);
                                        let conditionalInd = dimensionObj[currentDim]['numsTwiceInDim'][pointer_conditional_pos].indexOf(dimensionObj[currentDim]['numsTwiceInDim'][pointer_dynamic_pos][allPointerDoubles]);

                                        if((dynamicInd >= 0) && (conditionalInd >= 0)) {  
                                            // If we don't have elem, indexOf() method would return -1 as a response
                                            let conditionalPointerIndexes = dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_conditional_pos][conditionalInd];
                                            
                                            let noDuplicatesDynamicArr = dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][dynamicInd].filter((el, index) => {
                                                if(!dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd].includes(el)) {return true;}
                                            })
                                            let noDuplicatesStaticArr = dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd].filter((el, index) => {
                                                if(!dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][dynamicInd].includes(el)) {return true;}
                                            })

                                            let staticAndDynamicUniqueIndexes = [...noDuplicatesDynamicArr, ...noDuplicatesStaticArr]
                                            
                                            //console.log(staticAndDynamicUniqueIndexes, 'versus: ', conditionalPointerIndexes);

                                            let sameCount = 0;

                                            for(let ind=0; ind<staticAndDynamicUniqueIndexes.length; ind++) {
                                                // NOTE: staticAndDynamicUniqueIndexes and conditionalPointerIndexes has 100% same length !
                                                if(conditionalPointerIndexes.includes(staticAndDynamicUniqueIndexes[ind])) {
                                                    sameCount++;
                                                }
                                            }

                                            if(sameCount === staticAndDynamicUniqueIndexes.length) {
                                                // Create an array of only unique indexes, and invoke proper function afterwards !
                                                let staticAndDynamicIndexes = dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_static_pos][staticInd].concat(dimensionObj[currentDim]['numsTwiceInDim_Indexes'][pointer_dynamic_pos][dynamicInd]);
                                                let pointersUniqueIndexes_set = new Set(staticAndDynamicIndexes);
                                                let pointersUniqueIndexes_array = Array.from(pointersUniqueIndexes_set);
                                                console.log(pointersUniqueIndexes_array);
                                                //console.error('SwordFish can possibly HELP !');

                                                let pointersIndexes_arr = [pointer_static_pos, pointer_dynamic_pos, pointer_conditional_pos];

                                                let didHelp = checkCounterpartRemoval(currentDim, pointersIndexes_arr, dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos][staticInd], pointersUniqueIndexes_array, pointersCount, isSwordfish);
                                               
                                                if(didHelp) {isHelpful = true;}
                                                // Do tej funkcji jako argumentów potrzebujemy:
                                                // Dimension - czy to rząd, czy kolumna
                                                // Nr indeksów wszystkich wskaźników, tworzących X-wing (2 wskaźniki) lub swordfish (3 wskaźniki)
                                                // Cyfrę, dla której znaleźliśmy x-wings / swordfish
                                                // Indeksy wystąpienia tej cyfry we wskaźnikach
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            return isHelpful;
        }

        function checkCounterpartRemoval(currentDim, pointersIndexes_arr, digit, digitIndexes_arr, pointersCount, isSwordfish) {
            let isHelpful = false;
            //console.log(`current dim is: `, currentDim, ' pointers indexes are: ', pointersIndexes_arr, ' digit is: ', digit, ' and digit indexes are: ', digitIndexes_arr);
            // Now let's finish things off with potential removals
            

            if(currentDim === 'row') {
                //const counterPartDim = 'column';
                for(let pointer_no_counterpart = 0; pointer_no_counterpart <  pointersCount; pointer_no_counterpart++) {
                    // For each pointer counterpart
                    for(let tile_in_counterpart = 0; tile_in_counterpart < 9; tile_in_counterpart++) {
                        // For each tile in chosen counterpart
                        // Jeżeli sprawdzany kafelek posiada tą cyfrę jako opcję i nie jest ona częścią x-wings
                        if(typeof(grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]]) === 'object') {
                            if((grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].includes(digit)) && (!pointersIndexes_arr.includes(tile_in_counterpart))) {
                                let index = grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].indexOf(digit);
                                grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].splice(index, 1);
                                if(!isSwordfish) { console.error('X-wing is theeere in row and removed number: ', digit, ` from grid[${tile_in_counterpart}][${digitIndexes_arr[pointer_no_counterpart]}]`);}
                                else { console.error('SWORDFISH HELPS in row and removed number: ', digit, ` from grid[${tile_in_counterpart}][${digitIndexes_arr[pointer_no_counterpart]}]`);}
                                isHelpful = true;
                            }
                        }
                    }
                    /* for(let pointers_index_no = 0; pointers_index_no < pointersIndexes_arr.length; pointers_index_no++) {
                        // For pointers indexes

                    } */
                }
            } else {
                // if currentDim === 'column'
                for(let pointer_no_counterpart = 0; pointer_no_counterpart < pointersCount; pointer_no_counterpart++) {
                    for(let tile_in_counterpart = 0; tile_in_counterpart < 9; tile_in_counterpart++) {
                        if(typeof(grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart]) === 'object') {
                            if((grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].includes(digit)) && (!pointersIndexes_arr.includes(tile_in_counterpart))) {
                                let index = grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].indexOf(digit);
                                grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].splice(index, 1);
                                if(!isSwordfish) {console.error(`X-wing is theeere in column and removed number `, digit, ` from grid[${digitIndexes_arr[pointer_no_counterpart]}][${tile_in_counterpart}]`);}
                                else {console.error(`SWORDFISH HELPS in column and removed number `, digit, ` from grid[${digitIndexes_arr[pointer_no_counterpart]}][${tile_in_counterpart}]`);}
                                isHelpful = true;
                            }
                        }
                    }
                }
            }

            return isHelpful;
        }
        
        function testNakedSubset(grid, allSquares, dimensionObj_dim, dimensionObj_dim_subset_l,  nakedSubset_l, dimension_no, dimension_item, isHidden) {
            //console.log(dimensionObj_dim);
            let didHelp = false;
            //console.log(allSquares);

            for(let dimension_item_tile=0; dimension_item_tile<9; dimension_item_tile++) { // Czyli dla każdego kafelka w linii / boxie
                //console.log(dimensionObj_dim_subset_l.dimArr);
                dimensionObj_dim_subset_l.dimArr[dimension_item].push([]);
                if(dimensionObj_dim === 'row') {
                    if(typeof(grid[dimension_item][dimension_item_tile]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[dimension_item][dimension_item_tile]);
                    }
                }
                else if(dimensionObj_dim === 'column') {
                    if(typeof(grid[dimension_item_tile][dimension_item]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[dimension_item_tile][dimension_item]);
                    }
                }
                else { // dimensionObj_dim === 'square'
                    let sq_r_compressed = Math.floor(dimension_item / 3); // 0 to 2
                    let sq_r_rest = dimension_item % 3; // 0 to 2
                    let sq_c_compressed = Math.floor(dimension_item_tile / 3); // 0 to 2
                    let sq_c_rest = dimension_item_tile % 3; // 0 to 2
    
                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                    let sq_c = (sq_r_rest * 3) + sq_c_rest;

                    if(typeof(grid[sq_r][sq_c]) === 'object') {
                        dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_item_tile].push(...grid[sq_r][sq_c]);
                    }
                }
               /*  rowArr.push([]); colArr.push([]); squareArr.push([]);
               
                // row Arr
                if(typeof(grid[row][iir]) === 'object') {
                    rowArr[rowArr.length - 1].push(...grid[row][iir]);
                }
                // col Arr
                if(typeof(grid[iir][row]) === 'object') {
                    colArr[colArr.length - 1].push(...grid[iir][row]);
                }
                // square Arr
                if(typeof(grid[sq_r][sq_c]) === 'object') {
                    squareArr[squareArr.length - 1].push(...grid[sq_r][sq_c]);
                }

                console.log(rowArr, colArr, squareArr); */
            }


            // We have all necessary options gathered in arrays, so now look for naked subsets 'double'
            /* let nakedDoubles_row = rowArr.filter((el, index) => {
                if(el.length === 2) {el.sort(function(a, b) {return a - b}); return el; }
            })
            let nakedDoubles_col = colArr.filter((el, index) => {
                if(el.length === 2) {el.sort(function(a, b) {return a - b}); return el; }
            })
            let nakedDoubles_square = squareArr.filter((el, index) => {
                if(el.length === 2) {el.sort(function(a, b) {return a - b}); return el; }
            })

            console.log(nakedDoubles_row, nakedDoubles_col, nakedDoubles_square); */

            // We have all necessary options gathered in arrays, so now look for naked subsets 'double'
            //let nakedSubset_size = [2, 3]; // We only work for double / tripple subsets
            /*let uniqueOptionsAsNaked_row = [];
            let uniqueOptionsAsNaked_col = [];
            let uniqueOptionsAsNaked_square = []; */

            let numsObj = {};

            if(isHidden) {
                for(let tileNo = 0; tileNo <dimensionObj_dim_subset_l.dimArr[dimension_item].length; tileNo++) {
                    for(let option_index = 0; option_index < dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo].length; option_index++) {
                        numsObj[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]] = (numsObj[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]]+1) || 1;
                    }
                } 
            }
            
            //console.log(numsObj);

            if(isHidden) { // Change it back to (isHidden) only !
                // add there numsObj !
                //WORK ON THIS FUNCTION AND DON'T WORRY ABOUT ERRORS CAUSED - IF THIS PART IS NOT FULLY FINISHED, THEN ERRORS WILL OCCUR
                // modify checkIfUnique function or create new one, since we'll need different approach for hidden subset (comparing to naked one)
                const allHiddenSubset_Digits = checkIfHiddenUnique(dimensionObj_dim_subset_l.dimArr[dimension_item], nakedSubset_l, numsObj);
                //console.log(allHiddenSubset_Digits); // tablica tablic, w której znajdują się wszystkie elementy własnego subsetu

                // Na podstawie allSubsetsHidden modyfikujemy grid
                for(let hiddenSubsetsfound = 0; hiddenSubsetsfound<allHiddenSubset_Digits.length; hiddenSubsetsfound++) {
                    // Dla każdego znalezionego hidden subsetu i jego 2 / 3 unikalnych cyfr (to zazwyczaj tylko 1 taki subset)
                    for(let tile_in_dimension = 0; tile_in_dimension < 9; tile_in_dimension++) {
                        let uniquesInTile = 0;
                        for(let uniqueDigit = 0; uniqueDigit<allHiddenSubset_Digits[hiddenSubsetsfound].length; uniqueDigit++) {
                            if(dimensionObj_dim_subset_l.dimArr[dimension_item][tile_in_dimension].includes(allHiddenSubset_Digits[hiddenSubsetsfound][uniqueDigit])) {
                                uniquesInTile++;
                            }
                        }
                        if(uniquesInTile === allHiddenSubset_Digits[hiddenSubsetsfound].length) {
                            // Perfect, we found a subset elem
                            const options_updated = [];
                            options_updated.push(...allHiddenSubset_Digits[hiddenSubsetsfound]);

                            let sq_r_compressed = Math.floor(dimension_item / 3); // 0 to 2
                            let sq_r_rest = dimension_item % 3; // 0 to 2
                            let sq_c_compressed = Math.floor(tile_in_dimension / 3); // 0 to 2
                            let sq_c_rest = tile_in_dimension % 3; // 0 to 2
                
                            let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                            let sq_c = (sq_r_rest * 3) + sq_c_rest;
                            // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                            if((dimensionObj_dim === 'row') && (typeof(grid[dimension_item][tile_in_dimension]) === 'object')) {
                                if((grid[dimension_item][tile_in_dimension].length > 1) && (grid[dimension_item][tile_in_dimension].length !== options_updated.length)) {
                                    let cp = [...grid[dimension_item][tile_in_dimension]]
                                    grid[dimension_item][tile_in_dimension] = options_updated;
                                    console.error(`HIDDEN tripple NORMAL subset =ROW= modifies nums ${cp} and grid[${dimension_item}][${tile_in_dimension}] is now: `, options_updated);
                                    //console.error(`ROW:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                    didHelp = true;
                                }
                            } else if((dimensionObj_dim === 'column') && (typeof(grid[tile_in_dimension][dimension_item]) === 'object'))  {
                                if((grid[tile_in_dimension][dimension_item].length > 1) && (grid[tile_in_dimension][dimension_item].length !== options_updated.length)) {
                                    let cp = [...grid[tile_in_dimension][dimension_item]];
                                    grid[tile_in_dimension][dimension_item] = options_updated;
                                    console.error(`HIDDEN tripple NORMAL subset =COLUMN= modifies nums ${cp} and grid[${dimension_item}][${tile_in_dimension}] is now: `, options_updated);
                                    //console.error(`COLUMN:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                    didHelp = true;
                                }
                            } else if((dimensionObj_dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                if((grid[sq_r][sq_c].length > 1) && (grid[sq_r][sq_c].length !== options_updated.length)) {
                                    let cp = [...grid[sq_r][sq_c]];
                                    grid[sq_r][sq_c] = options_updated;
                                    console.error(`HIDDEN tripple NORMAL subset =SQUARE= modifies nums ${cp} and grid[${sq_r}][${sq_c}] is now: `, options_updated);
                                    //console.error(`SQUARE:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                    didHelp = true;
                                }
                            }
                        }
                    }
                }
                
            }

            else {
                //for(let subset_iter = 0; subset_iter< nakedSubset_size.length; subset_iter++) {
                for(let no=0; no<9; no++) { // dla każdego elementu w danym dimension (9 el w linii / boxie)
                    // Test for each row || column || square
                    //console.log(dimensionObj_dim_subset_l.dimArr[dimension_item]);
                    //console.log(dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item]); // empty array when we invoke checkIfUnique
                    if(dimensionObj_dim_subset_l.dimArr[dimension_item][no].length === nakedSubset_l) {
                        const isUniqueTileOptions = checkIfUnique(dimensionObj_dim_subset_l.dimArr[dimension_item], dimensionObj_dim_subset_l.dimArr[dimension_item][no], dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item], nakedSubset_l);
                        //                                        wszystkie elementy linii / boxa                 , sprawdzany el. pod kątem subsetu(na 100% ma dobry length),  cały zestaw znalezionych subsetów                           , obecna długość subsetu
                        if(isUniqueTileOptions) {
                            dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item].push(dimensionObj_dim_subset_l.dimArr[dimension_item][no]);
                            //console.log( dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item])
                        }
                    }  
                }


                for(let found_subsets = 0; found_subsets < dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item].length;  found_subsets++) {
                    // For every unique subset found (example is: [2, 4]) TEN SUBSET MUSI WYSTĄPIĆ 2 LUB 3 RAZY !!!
                    let same_subset = 0;
                    for(let tile_no = 0; tile_no < 9; tile_no++) {
                        let same_digit = 0;
                        if(dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets].length === dimensionObj_dim_subset_l.dimArr[dimension_item][tile_no].length) {
                            for(let n=0; n<nakedSubset_l;  n++) {
                                if(dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets][n] === dimensionObj_dim_subset_l.dimArr[dimension_item][tile_no][n]) {
                                    same_digit++;
                                    if(nakedSubset_l === same_digit) { // Jeśli mamy taki sam subset, który porównujemy z unikalną wersją (uniqueOptionsAsNaked_dim)
                                        same_subset++;
                                    }
                                    if(nakedSubset_l < same_subset) {console.error('CANT GO IN')}
                                    if(nakedSubset_l === same_subset) { // Jeśli ilość znalezionych (takich samych) subsetów jest równa ich długości (funkcja prawdopodobnie pomoże nam)
                                        same_subset++; // WE HAVE TO ENSURE THAT IT HAPPENS JUST ONCE !!!
                                        // It means we found legit subset pair / tripple ! So function *probably* help + just remove subset numbers
                                        // from other (non-subset pair/tripple) tiles (if those exists - that's why *probably*).
                                        //console.log('All subsets for dim ', dimensionObj_dim, '  no  ', dimension_item , " : ", dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item]);
                                        const didItRemoved = removeSubsetDigits(grid, dimensionObj_dim_subset_l.dimArr[dimension_item], dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets], dimension_item, tile_no, dimensionObj_dim);
                                        //                                      grid, cały rz/kol/kw obecnie badany - jako linia / box   cały subset, który ma swój odpowiednik(/i), np: [2, 4]                   nr rz/kol/kw 0 do 8 | nr kafelka,  | "rząd" / "kol" / "kw"
                                        if(didItRemoved) {didHelp = true;}
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            /* // Test for each column
            if(colArr[no].length === nakedSubset_size[subset_iter]) {
                const isUniqueTileOptions_col = checkIfUnique(colArr, colArr[no], uniqueOptionsAsNaked_col, nakedSubset_size[no]);
                if(isUniqueTileOptions_col) {
                    uniqueOptionsAsNaked_col.push(colArr[no]);
                }
            }
            // Test for each square
            if(squareArr[no].length === nakedSubset_size[subset_iter]) {
                const isUniqueTileOptions_square = checkIfUnique(squareArr, squareArr[no], uniqueOptionsAsNaked_square, nakedSubset_size[no]);
                if(isUniqueTileOptions_square) {
                    uniqueOptionsAsNaked_square.push(squareArr[no]);
                }
            } */
            
            // Teraz w uniqueOptionsAsNaked_... mamy tylko unikalne wartości o określonej długości, np. [2, 4] - bez duplikatów.
            // Sprawdźmy teraz czy dla całego row odszukamy więcej niż 1 wystąpienie. Jeśli znajdziem

            // For row || column || square
           

            // Now we can focus on subset methods that are length specific :
            // 1) Incomplete tripple subset -> {3, 6} {3, 6, 9} {3, 6, 9} || {2, 7} {2, 8} {2, 7, 8}
            // 2) Three double subsets -> {4, 9} {2, 4} {2, 9}

            // 1)
            //console.log(dimensionObj_dim_subset_l.dimArr[dimension_item]);
            if(nakedSubset_l === 3) {
                let isIncompleteTrippleSubset = checkIncompleteTrippleSubset(grid, dimensionObj_dim_subset_l.dimArr[dimension_item], dimension_item, dimensionObj_dim, isHidden);
                if(isIncompleteTrippleSubset) {didHelp = true;}
            }


            // 2)
            if(nakedSubset_l === 2) {
                let isThreeDoubleSubset = checkThreeDoubleSubsets(grid, dimensionObj_dim_subset_l.dimArr[dimension_item], dimension_item, dimensionObj_dim, isHidden);
                if(isThreeDoubleSubset) {didHelp = true; }
            }

            function checkThreeDoubleSubsets(grid, thisDimOptions, dim_no, dim, isHidden) {
                //if(isHidden) return;
                // isHidden - check if we are looking for hidden subsets. If so, in this case we don't care about subsets lengths anymore,
                //            since some numbers might 'hide' actual subset digits


                let didHelp = false;

                let doubleInDimArr;
                let indexArr = [];
                const numsObj = {};

                for(let doubleNo = 0; doubleNo <thisDimOptions.length; doubleNo++) {
                    for(let doubleNo_index = 0; doubleNo_index <thisDimOptions[doubleNo].length; doubleNo_index++) {
                        numsObj[thisDimOptions[doubleNo][doubleNo_index]] = (numsObj[thisDimOptions[doubleNo][doubleNo_index]]+1) || 1;
                    }
                }

                if(isHidden) {
                    doubleInDimArr = thisDimOptions.filter((val, index) => {
                        let uniquesCount = 0;
                        for(let val_ind = 0; val_ind < val.length; val_ind++) {
                            if(numsObj[val[val_ind]] === 2) {
                                uniquesCount++;
                            }
                        }
                        if(uniquesCount === 2) { 
                            indexArr.push(index);
                            return true; 
                        }
                    })
                } else {
                    doubleInDimArr = thisDimOptions.filter((val, index) => {
                        if(thisDimOptions[index].length === 2) return true;
                    })
                }
            
                //console.log(isHidden, doubleInDimArr);

                if(doubleInDimArr.length < 3) { return false;}


                // Remove double subsets remains - which is {2, 4} and {2, 4} for example - they are not necessary
                for(let checked_double_no = 0; checked_double_no<doubleInDimArr.length; checked_double_no++) {
                    // Get first double elem
                    for(let compared_double_no = checked_double_no + 1; compared_double_no < doubleInDimArr.length; compared_double_no++) {
                        // Get second double elem (for comparison purposes)
                        const areExactDuplicates = checkExactDuplicates(doubleInDimArr[checked_double_no], doubleInDimArr[compared_double_no]);

                        if(areExactDuplicates) {
                            // Remove those duplicates (splice order is important here!)
                            // Firstly start with an elem with higher index (compared one), that go for a checked el
                            doubleInDimArr.splice(compared_double_no, 1);
                            doubleInDimArr.splice(checked_double_no, 1);

                            if(isHidden) { 
                                indexArr.splice(compared_double_no, 1); 
                                indexArr.splice(checked_double_no, 1);
                            }

                            // Finally set checkeddoubleno index properly
                            compared_double_no = doubleInDimArr.length; // finish checking - it cannot happen more than once for doubles !
                            checked_double_no--;

                            //console.log(`%c get rid of double subset exact dupliactes`, 'background: white; color: black;');
                        }

                        function checkExactDuplicates(checked_el, compared_el) {
                            if(!compared_el) {return false;}
                            let areExact = false;
                            if((checked_el.length === 2) && (compared_el.length === 2)) {
                                areExact = true;
                                for(let index = 0; index < 2; index++) {
                                    // Compare indexes of those elems and check if those are not exast same duplicates
                                    //console.log(checked_el[index], compared_el[index])
                                    if(parseInt(checked_el[index]) !== parseInt(compared_el[index])) {
                                        areExact = false;
                                    }
                                }
                            }
                            
                            return areExact;
                        }
                    }
                }

                //console.log('DoubleDim is now: ', doubleInDimArr);

                if(doubleInDimArr.length < 3) { return false;}

                // So now we have all double subset which are 100% not duplicative, and we have 3 or more of them

                // 1. Gather  all numbers from remaining doubles
                const doubleNums = {};

                for(let doubleNo = 0; doubleNo <doubleInDimArr.length; doubleNo++) {
                    for(let doubleNo_index = 0; doubleNo_index < doubleInDimArr[doubleNo].length; doubleNo_index++) {
                        doubleNums[doubleInDimArr[doubleNo][doubleNo_index]] = (doubleNums[doubleInDimArr[doubleNo][doubleNo_index]]+1) || 1;
                    }
                }
                
                //console.log(doubleNums);

                // 2. Remove doubles, which has num / nums that exists more or less than exactly 2 times && then check for 3 or above length
                // (only for naked subset) - hidden has its own version
                if(isHidden) {
                    for(let double_el = 0; double_el<doubleInDimArr.length; double_el++) {
                        let twiceInDim = 0;
                        for(let digit_as_option = 0; digit_as_option<doubleInDimArr[double_el].length; digit_as_option++) {
                            if(doubleNums[doubleInDimArr[double_el][digit_as_option]] === 2) {
                                twiceInDim++;
                            }
                        }
                        if(twiceInDim !== 2) {
                            //console.warn('REMOVED AND PREVENT')
                            doubleInDimArr.splice(double_el, 1);
                            indexArr.splice(double_el, 1);
                            double_el--;
                        }
                    }
                }
                else {
                    for(let key in doubleNums) {
                        if(doubleNums[key] !== 2) {
                            //console.log(doubleNums[key], '  but thats illegal');
                            for(let doubleNo = 0 ; doubleNo < doubleInDimArr.length; doubleNo++) {
                                if(doubleInDimArr[doubleNo].includes(parseInt(key))) {
                                    doubleInDimArr.splice(doubleNo, 1);
                                    doubleNo--;
                                }
                            }
                        }
                    }
                }    

                const copy = [...doubleInDimArr];
                console.log(isHidden, copy);
                //console.log('OBJ: ',doubleNums,  '  ||  Before: ', copy, '  -  After: ', doubleInDimArr);
                //(doubleInDimArr.length === 3)? console.log('WE GOT A THREE DOUBLE') : console.log('not enough, length is just ', doubleInDimArr.length)

                if(doubleInDimArr.length === 3) {
                    let uniqueDigits;

                    if(isHidden) {
                        uniqueDigits = new Set();
                        for(let doubleInDimArr_ind = 0; doubleInDimArr_ind < doubleInDimArr.length; doubleInDimArr_ind++) {
                            for(let digit = 0; digit < doubleInDimArr[doubleInDimArr_ind].length; digit++) {
                                if(doubleNums[doubleInDimArr[doubleInDimArr_ind][digit]] === 2) {
                                    uniqueDigits.add(doubleInDimArr[doubleInDimArr_ind][digit]);
                                }
                            }
                        }
                        console.log(doubleNums)
                        console.log(uniqueDigits, uniqueDigits.size);
                        if(uniqueDigits.size !== 3) { console.error('Saved from HIDDEN crashing - set: ', uniqueDigits); return false; } // In some specific cases set get a length of 4 - this line prevents from errors

                    } else {
                        uniqueDigits = new Set([].concat(...doubleInDimArr));
                        if(uniqueDigits.size !== 3) { console.error('Saved from crashing - set: ', uniqueDigits); return false; } // In some specific cases set get a length of 4 - this line prevents from errors
                    }
                   
                    //console.log(uniqueDigits);
                    // Yay, we have found three double subset ! Now just check if it helps removing anything
                    if(isHidden) {
                        // CAN THROW ERRORS, SO DON'T LET IT GO (FOR NOW) !
                        // Three HIDDEN doubles CAN THROW ERRORS, BEWARE OF THAT
                        if(!isHidden) {
                            for(let indexArr_no=0; indexArr_no<indexArr.length; indexArr_no++) {
                                let dimension_tile = indexArr[indexArr_no];
                                // Now let's just update grid with what we've found there
                                let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                let sq_r_rest = dim_no % 3; // 0 to 2
                                let sq_c_compressed = Math.floor(dimension_tile / 3); // 0 to 2
                                let sq_c_rest = dimension_tile % 3; // 0 to 2
                    
                                let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                                if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                    const isHiddenSubset = checkHiddenSubset(grid[dim_no][dimension_tile], uniqueDigits);
                                    if(isHiddenSubset) {
                                        grid[dim_no][dimension_tile] = isHiddenSubset;
                                        //console.log('unique Digits: ', uniqueDigits);
                                        console.error(`Three HIDDEN doubles =ROW= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dim_no][dimension_tile]);
                                        didHelp = true;
                                    }
                                } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                    const isHiddenSubset = checkHiddenSubset(grid[dimension_tile][dim_no], uniqueDigits);
                                    if(isHiddenSubset) {
                                        grid[dimension_tile][dim_no] = isHiddenSubset;
                                        //console.log('unique Digits: ', uniqueDigits);
                                        console.error(`Three HIDDEN doubles =COLUMN= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dimension_tile][dim_no]);
                                        didHelp = true;
                                    }
                                } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                    const isHiddenSubset = checkHiddenSubset(grid[sq_r][sq_c], uniqueDigits);
                                    if(isHiddenSubset) {
                                        grid[sq_r][sq_c] = isHiddenSubset;
                                        //console.log('unique Digits: ', uniqueDigits);
                                        console.error(`Three HIDDEN doubles subset =SQUARE= removes nums and grid [${sq_r}][${sq_c}] is now: `, grid[sq_r][sq_c]);
                                        didHelp = true;
                                    }
                                }
                            }
                        }
                    }

                    else{
                        for(let dimension_tile=0; dimension_tile<9; dimension_tile++) {
                            // Now let's just update grid with what we've found there
                            let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                            let sq_r_rest = dim_no % 3; // 0 to 2
                            let sq_c_compressed = Math.floor(dimension_tile / 3); // 0 to 2
                            let sq_c_rest = dimension_tile % 3; // 0 to 2
                
                            let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                            let sq_c = (sq_r_rest * 3) + sq_c_rest;
                            // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                            if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                const isNotaSubset = checkNotASubset(grid[dim_no][dimension_tile], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[dim_no][dimension_tile] = isNotaSubset;
                                    console.log('unique Digits: ', uniqueDigits);
                                    //console.error(`Three doubles =ROW= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dim_no][dimension_tile]);
                                    didHelp = true;
                                }
                            } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                const isNotaSubset = checkNotASubset(grid[dimension_tile][dim_no], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[dimension_tile][dim_no] = isNotaSubset;
                                    console.log('unique Digits: ', uniqueDigits);
                                    //console.error(`Three doubles =COLUMN= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dimension_tile][dim_no]);
                                    didHelp = true;
                                }
                            } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                const isNotaSubset = checkNotASubset(grid[sq_r][sq_c], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[sq_r][sq_c] = isNotaSubset;
                                    console.log('unique Digits: ', uniqueDigits);
                                    //console.error(`Three doubles subset =SQUARE= removes nums and grid [${sq_r}][${sq_c}] is now: `, grid[sq_r][sq_c]);
                                    didHelp = true;
                                }
                            }
                        }
                    }

                }

                function checkHiddenSubset(currTileOptions, numsToKeep) {
                    if(currTileOptions.length < 1) { return false; }
                    let currTileOptions_copy = [...currTileOptions];
                    let didRemove = false;
                    /* let contains = 0;
                    numsToKeep.forEach((num) => {
                        if(currTileOptions_copy.includes(num)) {
                            contains++;
                        }
                    }) */

                    //if(contains === 2) {
                        for(let x=0; x<currTileOptions_copy.length; x++) {
                            if(!numsToKeep.has(currTileOptions_copy[x])) {
                                currTileOptions_copy.splice(x, 1);
                                x--;
                                didRemove = true;
                            }
                        }
                    // }

                    if((didRemove) && (currTileOptions_copy.length > 0)) {
                        return currTileOptions_copy;
                    } else {return false; }
                }

                function checkNotASubset(currTileOptions, numsToRemove) {
                    if(currTileOptions.length < 1) { return false; }
                    let currTileOptions_copy = [...currTileOptions];
                    let didRemove = false;
                    numsToRemove.forEach((num) => {
                        if(currTileOptions_copy.includes(num)) {
                            let index = currTileOptions_copy.indexOf(num);
                            currTileOptions_copy.splice(index, 1);
                            didRemove = true;
                        }
                    })
                    if((didRemove) && (currTileOptions_copy.length > 0)) {
                        return currTileOptions_copy;
                    } else {return false; }
                }

                return didHelp;
            }

            function checkIncompleteTrippleSubset(grid, thisDimOptions, dim_no, dim, isHidden) {
                // isHidden - check if we are looking for hidden subsets. If so, in this case we don't care about subsets lengths anymore,
                //            since some numbers might 'hide' actual subset digits



                let didHelp = false;

                // isHidden?
                //   NO - Pick all tripples from current line / box and keep in trippleInDimArr
                //  YES - Pick all tripples / quads / quints (or higher!) from current line / box and keep in trippleInDimArr

                let trippleInDimArr = thisDimOptions.filter((val, index) => {
                    // We don't actually need this for hidden version
                    if(thisDimOptions[index].length === 3) return true;
                    else {return false;}
                })

                //const xd = [...trippleInDimArr];
                //console.log(thisDimOptions);
                //console.log(xd);


                // If we don't find anything that meets above criteria (-> no tripples || quads / quints found)

                if(trippleInDimArr.length === 0 && (!isHidden)) {return false;}

                let numsObj = {};

                if(isHidden) {
                    for(let tileNo = 0; tileNo <thisDimOptions.length; tileNo++) {
                        for(let option_index = 0; option_index < thisDimOptions[tileNo].length; option_index++) {
                            numsObj[thisDimOptions[tileNo][option_index]] = (numsObj[thisDimOptions[tileNo][option_index]]+1) || 1;
                        }
                    }   
                    
                    //console.log(numsObj);

                    let uniqueNumbers = []; // czyli tablica dla cyfr, których opcje wystąpiły tylko 2 lub 3 razy na cały box / linię
                    for(let key in numsObj) {
                        if(numsObj[key] === 2 || numsObj[key] === 3)  uniqueNumbers.push(parseInt(key));
                    }

                    /* trippleInDimArr = trippleInDimArr.filter((val, index) => {
                        let count = 0;
                        //let uniqueSet = new Set();
                        for(let tripple_no=0; tripple_no<trippleInDimArr[index].length; tripple_no++) {
                            if(uniqueNumbers.includes(trippleInDimArr[index][tripple_no])) { 
                                count++; 
                                //uniqueSet.add(trippleInDimArr[tripple_no]);
                            }
                        }
                        if(count === 3) {return true;}
                        else {return false;} 
                    }) */

                   // console.log(trippleInDimArr)

                   /*  for(let hiddenCandidate_no = 0; hiddenCandidate_no<trippleInDimArr.length; hiddenCandidate_no++) {
                        // For each tile in line / box
                        let hiddenSubset_elems = [];
                        for(let optionsEl = 0; optionsEl < thisDimOptions.length; optionsEl++) {
                            // For each option number in currently checked tile in line / box
                            let sameNumsCount = 0;
                            for(let optionsEl_option = 0; optionsEl_option<thisDimOptions[optionsEl].length; optionsEl_option++) {
                                //console.log(thisDimOptions[optionsEl][optionsEl_option], numsObj[thisDimOptions[optionsEl][optionsEl_option]]);
                                if((trippleInDimArr[hiddenCandidate_no].includes(thisDimOptions[optionsEl][optionsEl_option])) 
                                    && (uniqueNumbers.includes(thisDimOptions[optionsEl][optionsEl_option]))) 
                                {
                                    sameNumsCount++;

                                }
                            }
                            if((sameNumsCount === 2) || (sameNumsCount === 3)) {
                                //console.log(thisDimOptions[optionsEl]);
                                hiddenSubset_elems.push(thisDimOptions[optionsEl])
                            }
                        }
                        
                        console.log('trippleInDimArr: ', trippleInDimArr);
                        const areThreeUniquesInHiddenSubset = testThreeUniquesInHiddenSubset(hiddenSubset_elems);

                        function testThreeUniquesInHiddenSubset(hiddenSubset_elems) {
                            let subsetTilesWithEnoughUniques = 0;
                            if(hiddenSubset_elems.length !== 3) {return false;} 
 
                            for(let el=0; el<hiddenSubset_elems.length; el++) { // For each subset elem (to check)
                                let uniqueDigitInSubset = 0;
                                for(let uniqueNo = 0; uniqueNo < uniqueNumbers.length; uniqueNo++) {
                                    if(hiddenSubset_elems[el].includes(uniqueNumbers[uniqueNo])) {
                                        uniqueDigitInSubset++
                                    }
                                }
                                if((uniqueDigitInSubset === 2) || (uniqueDigitInSubset === 3)) {
                                    subsetTilesWithEnoughUniques++;
                                }   
                            }
                           
                            console.warn('subsetTilesWithEnoughUniques: ', subsetTilesWithEnoughUniques)
                            if(subsetTilesWithEnoughUniques === 3) { return true; }
                            else {return false;}
                        } */

                    let uniqueNumInTilesNo = [];

                    for(let uniqueInd = 0; uniqueInd < uniqueNumbers.length; uniqueInd++) {
                        uniqueNumInTilesNo.push([]);
                        for(let tile_in_dimension = 0; tile_in_dimension < thisDimOptions.length; tile_in_dimension++) {
                            if(thisDimOptions[tile_in_dimension].includes(uniqueNumbers[uniqueInd])) {
                                uniqueNumInTilesNo[uniqueNumInTilesNo.length - 1].push(tile_in_dimension);
                            }
                        }
                    }

                    /* 
                     FOR TEST PURPOSES ONLY
                    uniqueNumbers = [3, 7, 8, 4, 5, 6];
                    uniqueNumInTilesNo = [[0,3,5], [0,3,5], [2,6], [3,5], [6,7], [7,8]];

                    numsObj = {
                        1: 4,
                        3: 3,
                        4: 2,
                        5: 2,
                        6: 2,
                        7: 3,
                        8: 2,
                    } */

                    //console.log(numsObj);

                    let uniqueSubsetDigits = [];
                    for(let uniqueNumbersInd = 0; uniqueNumbersInd < uniqueNumbers.length; uniqueNumbersInd++) {
                        if(uniqueNumbers.length < 3) { return false; }
                        let potentialSubset = [0];
                        for(let cordsToTest = 1; cordsToTest < uniqueNumInTilesNo.length; cordsToTest++) {
                            const thisUniqueNumberCords = uniqueNumInTilesNo[0];
                            let theSameAs_tUNC = 0;
                            //let twoSameUsed = false;
                            for(let cordNo = 0; cordNo < thisUniqueNumberCords.length; cordNo++) {
                               if(uniqueNumInTilesNo[cordsToTest][cordNo] !== undefined) {
                                    //console.log(thisUniqueNumberCords, uniqueNumInTilesNo[cordsToTest][cordNo])
                                    if(thisUniqueNumberCords.includes(uniqueNumInTilesNo[cordsToTest][cordNo])) {
                                        theSameAs_tUNC++;
                                    }
                                }
                            }

                            //console.log(uniqueNumInTilesNo[0] === uniqueNumInTilesNo[1]);
                            //console.log(uniqueNumbers[uniqueNumbersInd], numsObj[uniqueNumbers[uniqueNumbersInd]])
                            if(theSameAs_tUNC === 3) {
                                potentialSubset.push(cordsToTest);
                                //console.log('true');
                            }
                            else if((theSameAs_tUNC === 2) && (uniqueNumInTilesNo[cordsToTest].length === 2)) {
                                potentialSubset.push(cordsToTest);
                                //console.log('true');
                            }
                            //console.log('-----');
                        }
                        //console.error(potentialSubset)
                        if(potentialSubset.length === 3) {
                            uniqueSubsetDigits.push([]);
                            uniqueSubsetDigits[uniqueSubsetDigits.length - 1].push(uniqueNumbers[potentialSubset[0]], uniqueNumbers[potentialSubset[1]], uniqueNumbers[potentialSubset[2]]);
                            // Order here is IMPORTANT !
                            uniqueNumbers.splice(potentialSubset[2], 1); uniqueNumbers.splice(potentialSubset[1], 1); uniqueNumbers.splice(potentialSubset[0], 1);
                            uniqueNumInTilesNo.splice(potentialSubset[2], 1); uniqueNumInTilesNo.splice(potentialSubset[1], 1); uniqueNumInTilesNo.splice(potentialSubset[0], 1);
                            uniqueNumbersInd--;
                        } else {
                            uniqueNumbers.splice(0, 1); uniqueNumInTilesNo.splice(0, 1);
                            uniqueNumbersInd--;
                        }

                        //console.log(uniqueSubsetDigits);
                        if(uniqueSubsetDigits.length > 0) {
                            //console.error('ITS WORKING FINE!')
                            //console.error('LENGTH');
                            for(let foundSubset = 0; foundSubset<uniqueSubsetDigits.length; foundSubset++) {
                                console.log(uniqueSubsetDigits);
                                console.log(thisDimOptions);
                                const uniqueTiles = [];
                                let onlyUniques_confirmed = [];
                                for(let dimension_tile=0; dimension_tile<9; dimension_tile++) {
                                    let uniquesContained = 0;
                                    let onlyUniques = [];
                                    for(let foundSubset_index = 0; foundSubset_index < uniqueSubsetDigits[foundSubset].length; foundSubset_index++) {
                                        if(thisDimOptions[dimension_tile].includes(uniqueSubsetDigits[foundSubset][foundSubset_index])) {
                                            uniquesContained++;
                                            onlyUniques.push(uniqueSubsetDigits[foundSubset][foundSubset_index]);
                                        }
                                    }
                                    if((uniquesContained >= 2) && (thisDimOptions[dimension_tile].length > uniquesContained)) {
                                        uniqueTiles.push(dimension_tile);
                                        onlyUniques_confirmed.push([]);
                                        onlyUniques_confirmed[onlyUniques_confirmed.length - 1].push(...onlyUniques);
                                    }
                                }
    
                                if(uniqueTiles.length > 0) {
                                    //console.error('we got em');
                                    for(let uniqueTile = 0; uniqueTile<uniqueTiles.length; uniqueTile++) {
                                        // Now let's just update grid with what we've found there
                                        let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                        let sq_r_rest = dim_no % 3; // 0 to 2
                                        let sq_c_compressed = Math.floor(uniqueTiles[uniqueTile] / 3); // 0 to 2
                                        let sq_c_rest = uniqueTiles[uniqueTile] % 3; // 0 to 2
                            
                                        let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                        let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                        // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                                        if((dim === 'row') && (typeof(grid[dim_no][uniqueTiles[uniqueTile]]) === 'object')) {
                                            if((grid[dim_no][uniqueTiles[uniqueTile]].length > 1) && (grid[dim_no][uniqueTiles[uniqueTile]].length !== onlyUniques_confirmed[uniqueTile].length)) {
                                                console.warn(`HIDDEN tripple subset =ROW= modifies nums ${grid[dim_no][uniqueTiles[uniqueTile]]} and grid[${dim_no}][${uniqueTiles[uniqueTile]}] is now: `, onlyUniques_confirmed[uniqueTile]);
                                                grid[dim_no][uniqueTiles[uniqueTile]] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        } else if((dim === 'column') && (typeof(grid[uniqueTiles[uniqueTile]][dim_no]) === 'object'))  {
                                            if((grid[uniqueTiles[uniqueTile]][dim_no].length > 1) && (grid[uniqueTiles[uniqueTile]][dim_no].length !== onlyUniques_confirmed[uniqueTile].length)) {
                                                console.warn(`HIDDEN tripple subset =COLUMN= modifies nums ${grid[uniqueTiles[uniqueTile]][dim_no]} and grid[${dim_no}][${uniqueTiles[uniqueTile]}] is now: `, onlyUniques_confirmed[uniqueTile]);
                                                grid[uniqueTiles[uniqueTile]][dim_no] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                            if((grid[sq_r][sq_c].length > 1) && (grid[sq_r][sq_c].length !== onlyUniques_confirmed[uniqueTile])) {
                                                console.warn(`HIDDEN tripple subset =SQUARE= modifies nums ${grid[sq_r][sq_c]} and grid [${sq_r}][${sq_c}] is now: `, onlyUniques_confirmed[uniqueTile]);
                                                grid[sq_r][sq_c] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        }
                                    }
                                }
                    }
                   
                            
                        }
                        //console.warn('MAIN:  ', trippleInDimArr[hiddenCandidate_no], '   SUB: ', hiddenSubset_elems[0], hiddenSubset_elems[1], hiddenSubset_elems[2]);
                        //console.warn('MAIN CONDITIONS ARE MET');
                        // Great, we have found hidden subset. Just check if it would help us
                        // Czyli z tych elementów subsetu, usuń wszystkie wystąpienia cyfr, które w tablicy numsObj występują więcej
                        // niż 3 razy
                        /* for(let dimension_tile =0; dimension_tile<9; dimension_tile++) {
                            const isEqualCopy = checkEqualCopy(thisDimOptions[dimension_tile], hiddenSubset_elems);

                            if(isEqualCopy) {
                                const isRemovalOption = checkRemovalOption(thisDimOptions[dimension_tile], numsObj);
                                if(isRemovalOption) {
                                    // Jeśli tak, to isRemovalOption zawiera już zaktualizowaną wersję kafelka
                                    // Now let's just update grid with what we've found there
                                    let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                    let sq_r_rest = dim_no % 3; // 0 to 2
                                    let sq_c_compressed = Math.floor(dimension_tile / 3); // 0 to 2
                                    let sq_c_rest = dimension_tile % 3; // 0 to 2
                        
                                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                    let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                    // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                                    if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                        if(grid[dim_no][dimension_tile].length > 1) {
                                            let cp = [...grid[dim_no][dimension_tile]]; // only for console.logs purposes
                                            grid[dim_no][dimension_tile] = isRemovalOption;
                                            console.error(`HIDDEN tripple subset =ROW= modifies nums ${cp} and grid[${dim_no}][${dimension_tile}] is now: `, grid[dim_no][dimension_tile]);
                                            didHelp = true;
                                        }
                                    } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                        if(grid[dimension_tile][dim_no].length > 1) {
                                            let cp = [...grid[dimension_tile][dim_no]]; // only for console.logs purposes
                                            grid[dimension_tile][dim_no] = isRemovalOption;
                                            console.error(`HIDDEN tripple subset =COLUMN= modifies nums ${cp} and grid[${dim_no}][${dimension_tile}] is now: `, grid[dimension_tile][dim_no]);
                                            didHelp = true;
                                        }
                                    } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                        if(grid[sq_r][sq_c].length > 1) {
                                            let cp = [...grid[sq_r][sq_c]]; // only for console.logs purposes
                                            grid[sq_r][sq_c] = isRemovalOption;
                                            console.error(`HIDDEN tripple subset =SQUARE= modifies nums ${cp} and grid [${sq_r}][${sq_c}] is now: `, grid[sq_r][sq_c]);
                                            didHelp = true;
                                        }
                                    }
                                }
                            }
                        } */

                        function checkEqualCopy(thisTile, subset_tiles) {
                            // This time we need to check if thisTile belongs to subset_tiles
                            for(let subsetTile_no=0; subsetTile_no<subset_tiles.length; subsetTile_no++) {
                                // For each digit in current subset el
                                let sameNums = 0;
                                for(let option_no= 0; option_no<subset_tiles[subsetTile_no].length; option_no++) {
                                    if(thisTile.includes(subset_tiles[subsetTile_no][option_no])) {
                                        sameNums++;
                                    }
                                }
                                if(sameNums === subset_tiles[subsetTile_no].length) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        function checkRemovalOption(thisTile, numsObj) {
                            const thisTile_updated = [...thisTile];
                            let didRemove = false;
                            for(let option_no = 0; option_no<thisTile_updated.length; option_no++) {
                                if(!uniqueNumbers.includes(thisTile_updated[option_no])) {
                                    thisTile_updated.splice(option_no, 1);
                                    option_no--;
                                    didRemove = true;
                                }
                            }
                            if((didRemove) && (thisTile_updated.length !== thisTile.length) && (thisTile_updated.length > 0)) {return thisTile_updated;}
                            else { return false;}
                        }

                    }
                }

                else {
                    for(let trippleCandidateNo = 0; trippleCandidateNo<trippleInDimArr.length; trippleCandidateNo++) {
                        // For each tile we manage to gather in trippleInDimArr (-> tripples only || quads / quints ...)
    
                        let incompleteTrippleCandidates = [];
    
                        // If hidden - make an exception and push detected quad / quint... as a candidate
                        //if(isHidden) { incompleteTrippleCandidates.push(trippleInDimArr[trippleCandidateNo]); }
                        // There we will push elems that contains the same numbers as currently checked trippleInDimArr tile
                        for(let trippleOptionsEl = 0; trippleOptionsEl<thisDimOptions.length; trippleOptionsEl++) {
                            // For each elem inside current dimension
                            let doesContainsOnlyTheSameNumbers = checkContaisnOnlyTheSameNumbers(trippleInDimArr[trippleCandidateNo], thisDimOptions[trippleOptionsEl]);
                            if(doesContainsOnlyTheSameNumbers) {
                                incompleteTrippleCandidates.push(thisDimOptions[trippleOptionsEl]);
                            }
                        }
    
                        /* let uniqueNums = new Set();
                        for(let i = 0; i<incompleteTrippleCandidates.length; i++) {
                            uniqueNums.add(...incompleteTrippleCandidates[i]);
                        } */
    
                        // Now we have a candidates (of length 2 or 3 to test with current tripple)
                        //console.log(incompleteTrippleCandidates);
                        if((incompleteTrippleCandidates.length === 3) /* && (uniqueNums.size === 3) */) {
                            // Yess, our function helps (probably) !!
    
                            // CONTINUE FROM HERE...
                            //console.log(trippleInDimArr);
                            for(let dimension_tile = 0; dimension_tile<9; dimension_tile++) {
                                // For every tile in current dimension
                                const detectedTileOptions_copy = [...thisDimOptions[dimension_tile]];
                                //console.log(dimensionObj_dim_subset_l.dimArr[dimension_item][dimension_tile])
                                for(let candidate_no = 0; candidate_no<incompleteTrippleCandidates.length; candidate_no++) {
                                    // For each gathered digit from incompleteTrippleCandidates (we know its length equals 3)
                                    if(thisDimOptions[dimension_tile].includes(trippleInDimArr[trippleCandidateNo][candidate_no])) {
                                        // If detected tile has the digit
                                        let index = detectedTileOptions_copy.indexOf(trippleInDimArr[trippleCandidateNo][candidate_no]);
                                        detectedTileOptions_copy.splice(index, 1);
                                    }
                                }
                                // Now check what's the final length of detected tile if we would remove the same digits as gathered
                                // If length === 0 that means we were trying to modify a subset elem, which of course is not allowed
                                if((detectedTileOptions_copy.length > 0) && ((thisDimOptions[dimension_tile]).length !== detectedTileOptions_copy.length)) {
                                    // If it is not a subset tile and our loops has actually removed at least one element
    
                                    //console.log('remaining options, excluding: ',trippleInDimArr[trippleCandidateNo], '  would be: ', detectedTileOptions_copy);
                                    //console.log('all options in tile: ', thisDimOptions[dimension_tile])
                                    console.log('%c Incomplete tripple subset HELPS !', 'background: yellow; color: black; font-weight: 650');
    
                                    // Now let's just update grid with what we've found there
                                    let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                    let sq_r_rest = dim_no % 3; // 0 to 2
                                    let sq_c_compressed = Math.floor(dimension_tile / 3); // 0 to 2
                                    let sq_c_rest = dimension_tile % 3; // 0 to 2
                        
                                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                    let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                    // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                                    if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                        if(grid[dim_no][dimension_tile].length > 1) {
                                            grid[dim_no][dimension_tile] = detectedTileOptions_copy;
                                            //console.error(`Incomplete tripple subset =ROW= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dim_no][dimension_tile]);
                                            didHelp = true;
                                        }
                                    } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                        if(grid[dimension_tile][dim_no].length > 1) {
                                            grid[dimension_tile][dim_no] = detectedTileOptions_copy;
                                            //console.error(`Incomplete tripple subset =COLUMN= removes nums and grid[${dim_no}][${dimension_tile}] is now: `, grid[dimension_tile][dim_no]);
                                            didHelp = true;
                                        }
                                    } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                        if(grid[sq_r][sq_c].length > 1) {
                                            grid[sq_r][sq_c] = detectedTileOptions_copy;
                                            //console.error(`Incomplete tripple subset =SQUARE= removes nums and grid [${sq_r}][${sq_c}] is now: `, grid[sq_r][sq_c]);
                                            didHelp = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                return didHelp;
            }

            function checkContaisnOnlyTheSameNumbers(thisTripple, detectedElem) {
                if((detectedElem.length !== 2) && (detectedElem.length !== 3)) { /*We don't look for quads, so ... */ return false; }
                for(let el_option = 0; el_option < detectedElem.length; el_option++) {
                    if(!thisTripple.includes(detectedElem[el_option])) {
                        return false;
                    }
                }
                return true;
            }

            function checkIfHiddenUnique(ourArr, subset_size, numsObj) {
                // ourArr = allTiles options in current line / box (please don't modify it there - keep it as it is)
                // subset_size = current subset size we take into account (we only work for subset that is two-length or three-length) any length elems 
                // numsObj = object that indicates how many times each digit happens in current tile
                const hiddenSubsetDigits = [];            
                const ourArr_copy = [...ourArr];

                for(let el_no = 0; el_no<ourArr_copy.length; el_no++) {
                    // For each element inside current line / box 
                    let uniquesContained = [];
                    for(let option_no = 0; option_no<ourArr_copy[el_no].length; option_no++) {
                        // For each option digit inside -> check if the given digits happens the same times as subset_size current length
                        if(numsObj[ourArr_copy[el_no][option_no]] === subset_size) {
                            uniquesContained.push(ourArr_copy[el_no][option_no]);
                        }
                    }

                    if(uniquesContained.length === subset_size) {
                        // Czyli jeśli posiadamy 3 cyfry, które występują tylko 3 razy w danej linii / boxie
                        // Teraz szukamy dalej dwóch pozostałych el, które też posiadają te 3 cyfry
                        // Najpierw jednak określimy tablicę, która będzie pushować całe kafelki które są potencjalnymi subsetami
                        let potentialSubsetElems = [ourArr_copy[el_no]];
                        let potentialSubsetElems_indexes = [el_no];

                        for(let el_to_check = el_no+1; el_to_check<ourArr_copy.length; el_to_check++) {
                            let sameUniquesCount = 0;
                            for(let digit=0; digit<uniquesContained.length; digit++) {
                                if(ourArr_copy[el_to_check].includes(uniquesContained[digit])) {
                                    sameUniquesCount++;
                                }
                            }

                            if(sameUniquesCount === subset_size) {
                                potentialSubsetElems.push(ourArr_copy[el_to_check]);
                                potentialSubsetElems_indexes.push(el_to_check);
                            }
                        }

                        if(potentialSubsetElems.length === subset_size) {
                            // Tak, mamy gotowy hidden subset !
                            hiddenSubsetDigits.push([]);
                            hiddenSubsetDigits[hiddenSubsetDigits.length - 1].push(...uniquesContained);
                            // Teraz usuń indeksy znalezionych elementów z KOPII ourArray,
                            // Użyj odwróconej pętli, aby poprawnie splice'ować elementy !
                            for(let index = (potentialSubsetElems_indexes.length - 1); index >= 0; index--) {
                                ourArr_copy.splice(potentialSubsetElems_indexes[index], 1);
                            }
                        }

                    }
                }
                return hiddenSubsetDigits;
            }

            function checkIfUnique(ourArr, el, uOAN, subset_size) {
                // ourArr - wszystkie elementy linii / boxa
                // el - sprawdzany el. pod kątem subsetu(na 100% ma dobry length) 
                // uOAN - cały zestaw znalezionych subsetów
                // subset_size - obecna długość subsetu
                // isHidden - czy robimy checkout dla nakedSubset czy dla hiddenSubset
                if(uOAN.length < 1) {return true; }
                for(let x=0; x<uOAN.length; x++) {
                    for(let y=0; y<subset_size; y++) {
                        if(parseInt(uOAN[x][y]) === parseInt(el[y])) {
                            return false;
                        }
                    }
                }
                return true;  
            }

            function removeSubsetDigits(grid, thisdimension, subset, row, iir, dim) {
                // grid | cały rz/kol/kw obecnie badany - jako linia / box  | cały subset, który ma swój odpowiednik(/i), np: [2, 4] |  nr rz/kol/kw 0 do 8 | nr kafelka,  | "rząd" / "kol" / "kw"
                let didHelp = false;
                //console.warn(' A NEW SUBSET FOR DIM ', dim, '  no  ', row, ' CAME IN: ', subset);
                // Remove subset digits that don't belong to any subset-part tiles, but are available in non-subset tiles
                for(let dig = 0; dig<subset.length; dig++) {
                    // for every digit in subset
                    for(let tile_in_dimension=0; tile_in_dimension<9; tile_in_dimension++) {
                        // Work on now on pls!
                        //console.log(thisdimension[tile_in_dimension].includes(subset[dig]));
                        if(thisdimension[tile_in_dimension].includes(subset[dig])) { // If we own that digit as an option in tile aswell
                            const isNotANakedSubset = checkNotANakedSubset(thisdimension[tile_in_dimension], subset);
                            //                                             obecny kafelek w bad. rz/kol/kw | cały subset, który ma swój odpowiednik(/i), np: [2, 4]

                            if(isNotANakedSubset) {  // Now check if iterated tile does not belong to detected subset !
                                //console.error('ITS  + ', dim)
                                let sq_r_compressed = Math.floor(row / 3); // 0 to 2
                                let sq_r_rest = row % 3; // 0 to 2
                                let sq_c_compressed = Math.floor(tile_in_dimension / 3); // 0 to 2
                                let sq_c_rest = tile_in_dimension % 3; // 0 to 2
                    
                                let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                // Usuń z grida cyfry i zaznacz, że funkcja nam pomogła
                                if((dim === 'row') && (typeof(grid[row][tile_in_dimension]) === 'object')) {
                                    if(grid[row][tile_in_dimension].length > 1) {
                                        let index = grid[row][tile_in_dimension].indexOf(subset[dig]);
                                        grid[row][tile_in_dimension].splice(index, 1);
                                        console.warn(`ROW:: a naked subset and remove ${subset[dig]} from grid[${row}][${tile_in_dimension}]`);
                                        //console.error(`ROW:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                        didHelp = true;
                                    }
                                } else if((dim === 'column') && (typeof(grid[tile_in_dimension][row]) === 'object'))  {
                                    if(grid[tile_in_dimension][row].length > 1) {
                                        let index = grid[tile_in_dimension][row].indexOf(subset[dig]);
                                        grid[tile_in_dimension][row].splice(index, 1);
                                        console.warn(`COLUMN:: a naked subset and remove ${subset[dig]} from grid[${row}][${tile_in_dimension}]`);
                                        //console.error(`COLUMN:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                        didHelp = true;
                                    }
                                } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                    if(grid[sq_r][sq_c].length > 1) {
                                        let index = grid[sq_r][sq_c].indexOf(subset[dig]);
                                        grid[sq_r][sq_c].splice(index, 1);
                                        console.warn(`SQUARE:: a naked subset and remove ${subset[dig]} from grid[${sq_r}][${sq_c}]`);
                                        //console.error(`SQUARE:: iir a naked subset and remove ${subset[dig]} from grid[${row}][${iir}]`);
                                        didHelp = true;
                                    }
                                }

                            }
                        }
                    }

                    function checkNotANakedSubset(testTile, subset) {
                        if(testTile.length !== subset.length) { return true;}
                        testTile.sort();
                        subset.sort();
                        for(let i=0; i<subset.length; i++) {
                            //console.log(testTile[i], testTile);
                            //console.log(subset[i], subset);
                            if(parseInt(testTile[i]) !== parseInt(subset[i])) { return true;}
                        }
                        return false; // given elems have the same digits as a options, so these are definitely subset items
                    }
                }
                return didHelp;
            }

            return didHelp;
            /* for(let elNo = 0; elNo<rowArr.length; ) {
                let areTheSame = checkIfSame(rowArr[elNo], rowArr[elNo + 1]);
                if(areTheSame) {
                    //
                } else {
                    elNo++;
                }
            }

            function checkIfSame(arr1, arr2) {
                for(let i=0; i<arr1.length; i++) {
                    if(arr1[i] !== arr2[i]) { return false; }
                }
                return true;
            } */
            
        }

        //console.log(dimensionObject);
        function lookForDoublePairs(grid, allSquares, digit, line_no, dimension) {
            let didHelp = false;
            for(let tiles_in_line=0; tiles_in_line<3; tiles_in_line++) {
                let isHelpful = checkDoublePairs(grid, allSquares, digit, line_no, dimension, tiles_in_line);
                if(isHelpful) { didHelp = true; }
            }

            return didHelp;
        
            function checkDoublePairs(grid, allSquares, digit, line_no, dimension, tiles_in_line) {
                let didHelp = false;
                let pointer1 = (line_no * 3) + (tiles_in_line % 3);
                let pointer2 = (line_no * 3) + ((tiles_in_line + 1) % 3);
                let noDetect = (line_no * 3) + ((tiles_in_line + 2) % 3);

                
                // Cyfra "digit" z noDetect może wystąpić tylko i wyłącznie w ramach jednego kwadratu
                // Row pattern is: grid[(square_no * 3) + tile_in_square_line][noDetect];
                // Column pattern is: grid[noDetect][(square_no * 3) + tile_in_square_line];
                let digitInSquareNo = [];
                for(let square_no=0; square_no<3; square_no++) {
                    for(let tile_in_square_line=0; tile_in_square_line<3; tile_in_square_line++) {
                        let noDetect_checkedTile = dimension === 'row'? grid[noDetect][(square_no * 3) + tile_in_square_line] : grid[(square_no * 3) + tile_in_square_line][noDetect];
                        if(typeof(noDetect_checkedTile) === 'object') {
                            if(noDetect_checkedTile.includes(digit)) {
                                digitInSquareNo.push(square_no);
                                if(digitInSquareNo.length > 1) {
                                    if(digitInSquareNo[0] !== digitInSquareNo[digitInSquareNo.length - 1]) {
                                        return false; //return false; Wróć na początek pętli
                                    }
                                }
                            }
                        }
                    }
                }
                if(digitInSquareNo.length < 1) { return false;} //return false; Wróć na początek pętli

                // Od tego momentu wiemy już, że noDetect spełnia swoje warunki - musimy sprawdzić, czy pointer1 i pointer2 również spełniają
                // swoje warunki

                // Teraz sprawdź, czy w kwadracie, w którym  nasz noDetect posiada cyfrę, czy w pozostałych liniach w ramach tego kwadratu
                // znajduje się ta liczba. Jeśli nie, to znaczy, że ta funkcja nam nie pomoże, więc MOŻEMY WRÓCIĆ NA POCZĄTEK PĘTLI, jeśli
                // tak, to przechodzimy dalej;

                let isTargetSqaureContainingDigit = false;
                
                for(let targetSquareTile = 0; targetSquareTile < 3; targetSquareTile++) {
                    let pointer1_checkedTile = dimension === 'row'? grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1];
                    let pointer2_checkedTile = dimension === 'row'? grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2];

                    if(typeof(pointer1_checkedTile) === 'object') {
                        if(pointer1_checkedTile.includes(digit)) {
                            isTargetSqaureContainingDigit = true;
                        }
                    }
                    if(typeof(pointer2_checkedTile) === 'object') {
                        if(pointer2_checkedTile.includes(digit)) {
                            isTargetSqaureContainingDigit = true;
                        }
                    }
                }

                if(!isTargetSqaureContainingDigit) { return false; } //return false; Wróć na początek pętli

                // Na koniec sprawdzamy, czy ta cyfra występuje w pozostałych kwadratach dla linii, na które wskazują pointer1 i pointer2.
                // Muszą pojawić się minimum 2 razy dla każdego z tych wskaźników - jedno wystąpienie w pierwszym, a drugie w drugim 
                // kwadracie, w którym noDetect nie posiada cyfry. Jeśli nie, to znaczy, że ta funkcja nam nie pomoże, więc
                // MOŻEMY WRÓCIĆ NA POCZĄTEK PĘTLI, jeśli tak:::

                const remainSquareNo = [0, 1, 2].filter((value) => {
                    return value !== digitInSquareNo[0]; // expected: should always remove 1 elem, so two remains
                })

                let areNonTargetsWithDigit = [false, false, false, false];

                for(let nonTargetSquareCount = 0; nonTargetSquareCount < remainSquareNo.length; nonTargetSquareCount++) { // will go 2 times
                    for(let nonTargetSquareTile = 0; nonTargetSquareTile < 3; nonTargetSquareTile++) {  
                        let pointer1_checkedTile = dimension === 'row'? grid[pointer1][(remainSquareNo[nonTargetSquareCount] * 3) + nonTargetSquareTile] : grid[(remainSquareNo[nonTargetSquareCount] * 3) + nonTargetSquareTile][pointer1];
                        let pointer2_checkedTile = dimension === 'row'? grid[pointer2][(remainSquareNo[nonTargetSquareCount] * 3) + nonTargetSquareTile] : grid[(remainSquareNo[nonTargetSquareCount] * 3) + nonTargetSquareTile][pointer2];

                        if(typeof(pointer1_checkedTile) === 'object') {
                            if(pointer1_checkedTile.includes(digit)) {
                                areNonTargetsWithDigit[(nonTargetSquareCount * 2)] = true;
                            }
                        }
                        if(typeof(pointer2_checkedTile) === 'object') {
                            if(pointer2_checkedTile.includes(digit)) {
                                areNonTargetsWithDigit[(nonTargetSquareCount * 2) + 1] = true;
                            }
                        }

                    }
                }

                const isFinalConditionMet = areNonTargetsWithDigit.some(el => {
                    if(el === true) {return el}; 
                })

                if(!isFinalConditionMet) { return false; } //return false; Wróć na początek pętli


                //::: to z kwadratu, gdzie noDetect posiada cyfry, z linii gdzie wskazują w tym kwadracie wskaźniki, usuwamy wszystkie wystąpienia
                // tej cyfry. Zaznaczamy że funkcja pomogła nam znaleźć rozwiązanie. NIE USUWAMY ŻADNEJ CYFRY Z RZĘDU, GDZIE WSKAZUJE NODETECT.
            
                for(let targetSquareTile = 0; targetSquareTile < 3; targetSquareTile++) {
                    let pointer1_checkedTile = dimension === 'row'? grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1];
                    let pointer2_checkedTile = dimension === 'row'? grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2];

                    if(typeof(pointer1_checkedTile) === 'object') {
                        if(pointer1_checkedTile.includes(digit)) {
                            if(dimension === 'row') {
                                let index = grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile].indexOf(digit);
                                grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile].splice(index, 1);
                                console.warn(dimension, ' helped us find Double Pairs - the digit is: ', digit, ` and the tile cords is: grid[${pointer1}][${(digitInSquareNo[0] * 3) + targetSquareTile}]`);
                            } else {
                                let index = grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1].indexOf(digit);
                                grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1].splice(index, 1);
                                console.warn(dimension, ' helped us find Double Pairs - the digit is: ', digit, ` and the tile cords is: grid[${(digitInSquareNo[0] * 3) + targetSquareTile}][${pointer1}]`);
                            }
                            didHelp = true;
                        }
                    }
                    if(typeof(pointer2_checkedTile) === 'object') {
                        if(pointer2_checkedTile.includes(digit)) {
                           if(dimension === 'row') {
                                let index = grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile].indexOf(digit);
                                grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile].splice(index, 1);
                                console.warn(dimension, ' helped us find Double Pairs - the digit is: ', digit, ` and the tile cords is: grid[${pointer2}][${(digitInSquareNo[0] * 3) + targetSquareTile}]`);
                           } else {
                                let index = grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2].indexOf(digit);
                                grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2].splice(index, 1);
                                console.warn(dimension, ' helped us find Double Pairs - the digit is: ', digit, ` and the tile cords is: grid[${(digitInSquareNo[0] * 3) + targetSquareTile}][${pointer2}]`);
                           }
                           
                           didHelp = true;
                        }
                    }
                }

                return didHelp;
            }
        }




        function testCandidate(grid, {row, index_in_row}, num) {
            for(let k=0; k<grid[row].length; k++) {
                if(num === parseInt(grid[row][k]) && (grid[row][k].length <= 1)) return false; // CHECK ROW || if False = We have this number in a row already
                if(num === parseInt(grid[k][index_in_row]) && (grid[k][index_in_row].length <= 1)) return false; // CHECK COLUMN || if False =  We have this number in a column already
            }
    
            // Check square at last
    
            for(let square_row=0; square_row<3; square_row++) {
                for(let square_column=0; square_column<3; square_column++) {
                    if(num === parseInt(grid[(Math.floor(row / 3) * 3) + square_row][(Math.floor(index_in_row / 3) * 3) + square_column]) && 
                    (grid[(Math.floor(row / 3) * 3) + square_row][(Math.floor(index_in_row / 3) * 3) + square_column].length <= 1)
                    ) return false; // CHECK SQUARE || if False = We have this number in a square already
                }
            }

            return true;
        }

        function testOrdered(ordered, {row, index_in_row}, num) {
            for(let k=0; k<9; k++) {
                if(num === parseInt(ordered[row * 9 + k].textContent) /* ☢️ && (grid[row][k].length <= 1) */) return false; // CHECK ROW || if False = We have this number in a row already
                if(num === parseInt(ordered[k * 9 + index_in_row].textContent) /* ☢️ && (grid[k][index_in_row].length <= 1) */) return false; // CHECK COLUMN || if False =  We have this number in a column already
            }
    
            // Check square at last
    
            for(let square_row=0; square_row<3; square_row++) {
                for(let square_column=0; square_column<3; square_column++) {
                    if(num === parseInt(ordered[(((Math.floor(row / 3) * 3) + square_row) * 9) + (Math.floor(index_in_row / 3) * 3) + square_column].textContent) // ☢️
                    /* &&  (grid[(Math.floor(row / 3) * 3) + square_row][(Math.floor(index_in_row / 3) * 3) + square_column].length <= 1) */
                    ) return false; // CHECK SQUARE || if False = We have this number in a square already
                }
            }

            return true;
        }

        function occuredOnce(arr, length, sign) {
            // Tu jest błąd (?)
            
            let onlyOnce = [];

            arr.sort(function(a, b) { return a - b; });

            /* if(sign === 'r') {console.log('Row: ', arr);}
            else if(sign === 'c') {console.log('Column: ', arr);}
            else {console.log('square: ', arr);} */


            if(arr[0] != arr[1]) {
                onlyOnce.push(arr[0]);
            }

            for(let i= 1; i < length - 1; i++) {
                if(arr[i] !== arr[i + 1] && arr[i] != arr[i - 1]) { onlyOnce.push(arr[i])}
            }

            if(arr[length - 2] != arr[length - 1]) { onlyOnce.push(arr[length - 1])}

            return onlyOnce;
        }

        function applyOnePosition(grid, dim_1, dim_2, singPos, dim) {
            for(let x=0; x<singPos.length; x++) {
                if(grid[dim_1][dim_2].includes(singPos[x])) {
                    //if(dim === 'r') {ordered[(dim_1 * 9) + dim_2].style.color = 'aqua'};
                    //if(dim === 'c') {ordered[(dim_1 * 9) + dim_2].style.color = 'green'};
                    //if(dim === 's') {ordered[(dim_1 * 9) + dim_2].style.color = 'burlywood'};
                    ordered[(dim_1 * 9) + dim_2].textContent = singPos[x];  // ☢️
                    grid[dim_1][dim_2] = singPos[x];
                    return true;
                }
            }
            return false;
        }

        console.log(grid);

       /*  for(let k=0; k<grid[row].length; k++) {
            if(num === parseInt(grid[row][k])) return false; // CHECK ROW || if False = We have this number in a row already
            if(num === parseInt(grid[k][index_in_row])) return false; // CHECK COLUMN || if False =  We have this number in a column already
        }

        // Check square at last

        for(let square_row=0; square_row<3; square_row++) {
            for(let square_column=0; square_column<3; square_column++) {
                if(num === parseInt(grid[(Math.floor(row / 3) * 3) + square_row][(Math.floor(index_in_row / 3) * 3) + square_column])) return false; // CHECK SQUARE || if False = We have this number in a square already
            }
        } */
        return bestMethod;
    },

    fadeDigits: function({difficulty, theme, options}) {
        console.log(difficulty, theme, options);
        console.log(rules[difficulty]);

        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        // const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property

        // Lines inside quote are for TESTING ONLY
            const ordered = this.orderTiles(allTilesArray);
            const b = [];
            ordered.map((el, index) => {
                if(index % 9 === 0) {
                    b.push([]);
                }

                if(el.classList.contains('initial')) {
                    b[b.length - 1].push(el.textContent)  // ☢️
                } else {
                    b[b.length - 1].push(parseInt(el.textContent))  // ☢️
                }
            })

            console.log(b);
        //



        const engine_operations_vars = {
            squares_min_filled: 0,
            digits_min_shown: 0,
            all_digits_shown: [9, 9, 9, 9, 9, 9, 9, 9, 9],
            add: 1,
            substr: 0,
        }
        /*let squares_min_filled = 0;
        let digits_min_shown = 0;

        let all_digits_shown = [9, 9, 9, 9, 9, 9, 9, 9, 9]; // index + 1 refers to the digit name && value is the quanity
        let add = 1;
        let substr = 0;
        */
        const currentBoard = this.gatherTilesData(allTilesArray);
        /* console.log(JSON.parse(JSON.stringify(currentBoard))); */
        //console.log(currentBoard);

        const randInitial = Math.floor(Math.random() * ((rules[difficulty].initialNumbers.max - rules[difficulty].initialNumbers.min) + 1)) + rules[difficulty].initialNumbers.min;
        //console.log(randInitial);

        this.performEngineOperations(engine_operations_vars, currentBoard, randInitial, difficulty);

       // console.log(engine_operations_vars.all_digits_shown);

        //console.log(currentBoard)

        allTilesArray.forEach(tile => {
            console.log('test')
            if(tile.textContent) { console.log('yes'); tile.classList.add(`initial`, `initial-${theme}`); }  // ☢️
        })

        //console.log(currentBoard);
    },

    performEngineOperations: function(eov, currentBoard, randInitial, difficulty) {
        for(let i=(this.rows*this.columns); i>randInitial; i--) {
            /* Perform engine operations */
            if(!currentBoard.length) {console.warn('exhausted elems'); return;}

            let randSquare = Math.floor(Math.random() * currentBoard.length);
            let randTile_inSquare = Math.floor(Math.random() * currentBoard[randSquare].length);

            eov.all_digits_shown[(parseInt(currentBoard[randSquare][randTile_inSquare].textContent) - 1)]--;  // ☢️

            const number_to_keep = parseInt(currentBoard[randSquare][randTile_inSquare].textContent);  // ☢️
            currentBoard[randSquare][randTile_inSquare].textContent = '';   // ☢️
            currentBoard[randSquare].splice(randTile_inSquare, 1);

            if((eov.all_digits_shown[number_to_keep - 1]  - eov.substr) <= rules[difficulty].conditions.digit_shown_min) {
                //console.log('violated ', number_to_keep.toString())
                // Now remove all currentboard items, that has the same number attached, apart from the one we got now
                for(let arr of currentBoard) {
                    arr.forEach((elem, index) => {
                        if((arr[index].textContent === number_to_keep.toString()) /* ☢️ && (arr[index] !== currentBoard[randSquare][randTile_inSquare]) */) {
                            //console.log(arr)
                            arr.splice(index, 1);
                        }
                    })
                }

                eov.digits_min_shown++;

                //console.log(eov.digits_min_shown, rules[difficulty].conditions.max_digits_min_shown);
                //console.log(typeof(eov.digits_min_shown), typeof(rules[difficulty].conditions.max_digits_min_shown));

                if(eov.digits_min_shown === rules[difficulty].conditions.max_digits_min_shown) {
                    eov.substr++;
                    //console.log('prevent');
                    //console.log('txtContent ', number_to_keep.toString())
                    // If we are at limit, and we should increment minimal step by 1 \\ It fires just once
                    for(let x=0; x<eov.all_digits_shown.length; x++) {
                        if((eov.all_digits_shown[x] <= rules[difficulty].conditions.digit_shown_min + 1) && ((x + 1) !== number_to_keep)) {
                            // Usuń taką liczbę z wszystkich tablic currentBoard
                            //console.log((x + 1), ' vs ', number_to_keep)
                            for(let arr of currentBoard) {
                                arr.forEach((elem, index) => {
                                    //console.log(arr[index].textContent);
                                    if(parseInt(arr[index].textContent) === (x + 1)) {  // ☢️
                                       // console.log('REMOVE: ', arr[index].textContent);
                                        arr.splice(index, 1);
                                    }
                                })
                            }
                        }
                    }
                }
            } 

            /* currentBoard[randSquare][randTile_inSquare].textContent = '';
            currentBoard[randSquare].splice(randTile_inSquare, 1); */

            if(currentBoard[randSquare].length < (rules[difficulty].conditions.square_min_fill + eov.add)) {
                currentBoard.splice(randSquare, 1);
                eov.squares_min_filled++;

                if(eov.squares_min_filled === rules[difficulty].conditions.max_squares_min_filled) {
                    eov.add++;
                    for(const [index, arr] of currentBoard.entries()) {
                        if(arr.length < (rules[difficulty].conditions.square_min_fill + eov.add)) {
                            //console.log('rem', index);
                            currentBoard.splice(index, 1);
                        }
                    }
                }
            };
            // === if square has 2 available tiles, dont remove anything more from this square
            
            /*
                conditions: {
                    square_min_fill: 0, // The least amount of initial digits that a square can have
                    max_squares_min_filled: 1, // How much squares can be minimally filled ?
                    //
                    digit_shown_min: 1, // The least amount each digit can be shown on the board
                    max_digits_min_shown: 2, // How much digits with least amount can be ?
                },
            */

            //console.log('remains: ', i, 'options: ', currentBoard);
        }
    },

    backtrack: function (currGridState) {
        //console.log('tracking....');
        //
        let grid;
        let grid2;

        if(!currGridState) {
            grid = [];
            grid2 = [];

            for(let row_no = 0; row_no<9; row_no++) {
                grid.push([]);
                grid2.push([]);
                for(let col_no = 0; col_no<9; col_no++) {
                    parseInt(initial_board[row_no][col_no])  ? grid[grid.length - 1].push(initial_board[row_no][col_no]) : grid[grid.length -1].push(0);
                    parseInt(initial_board[row_no][col_no])  ? grid2[grid2.length -1].push(initial_board[row_no][col_no]) : grid2[grid2.length -1].push(0);
                }
            }
        }
        
        else {
            grid = currGridState;
            grid2 = currGridState;
        }

        function initBackTrack(grid, start_num, end_num) {

            let pos = {
                row: null, 
                index_in_row: null,
            }

            const checkUnassignedTile = engine.findUnassignedTile.bind(); 
            const isUnassigned = checkUnassignedTile(grid, pos);

            if(!isUnassigned) { /* console.log(grid); */ return grid; }

            const checkSafety = engine.testSafety.bind();

            //console.log(pos.row, pos.index_in_row);

            //console.log(start_num, end_num);

            for(let i=start_num; (start_num < end_num) ? i<=end_num : i>=end_num; (start_num < end_num) ? i++ : i--) {
                const isSafe = checkSafety(grid, pos, i);
                
                if(isSafe) {
                    grid[pos.row][pos.index_in_row] = i;

                    if(initBackTrack(grid, start_num, end_num)) { return grid; }

                    grid[pos.row][pos.index_in_row] = 0;
                }
            }

            return false;

            /* TO DO

            1) Stwórz matrycę, która będzie bazowała na zmiennej 'grid', ale zamiast początkowych cyfr (initials) będzie posiadała znak
            'x'. Ta matryca będzie edytowalną wersją 'grid', gdzie bez obaw będziemy mogli zmieniać wartości liczb nie podanych na początku
            (non-initials), a przede wszystkim cofać się w razie gdy nie będzie już możliwych cyfr do wpisania w danej kratce

            2) Stwórz mechanizm cofania się, czyli: "gdy w danej kratce nie pasuje już żadna liczba (num + 1 > 9), wtedy na podstawie matrycy
            cofnij się wstecz o 1 pole, które nie jest znakiem 'x' i stamtąd od tej liczby, którą ta kratka posiada, próbuj zwiększać wartość
            num (już od tej, którą posiada) w dawnej kratce dalej. Ponadto zaznacz, że gdy (index_in_row - 1 < 0) to wtedy ustaw index_in_row na 8,
            a row = row - 1 !"

            3) Możliwe rozwiązania zapisuj w nowo utworzonej tablicy rozwiązań, który w momencie, gdy sudoku zdoła ułożyć sudoku, to wtedy wpisze
            do niej reprezentację mapy z rozwiązaniem (ustawionymi cyframi), a następnie od tego miejsca zacznie backtracking dalej w poszukiwaniu
            dalszych rozwiązań, aż do momentu gdy cała iteracja planszy dobiegnie końca.

            4) Na koniec wyświetl wynik - czy sudoku jest unikalne ??
            
            */
        }

        const opt_1To9 =  initBackTrack(grid, 1, 9);
        const opt_9To1 =  initBackTrack(grid2, 9, 1);

        //console.log(opt_1To9);
        //console.log(opt_9To1);
        
        const isSudokuUnique = this.checkOneSolution(opt_1To9, opt_9To1);

        //console.log('HAS SUDOKU JUST ONE SOLUTION ?', isSudokuUnique);

        console.log(opt_1To9);

        return isSudokuUnique;
        //const isSafe = checkTileSafety()
    },

    checkOneSolution: function(opt_1To9, opt_9To1) {
        for(let r=0; r<9; r++) {
            for(let c=0; c<9; c++) {
                if(opt_1To9[r][c] !== opt_9To1[r][c]) return false;
            }
        }
        return true;
    },

    findUnassignedTile: function(grid, pos) {
        for(let r=0; r<9; r++) {
            for(let iir=0; iir<9; iir++) {
                if(grid[r][iir] === 0) {
                    pos.row = r; 
                    pos.index_in_row = iir;
                    return true;
                }
            }
        }
    },

    testSafety: function(grid, {row, index_in_row}, num) {
        //console.log('testSafety...');
        // Check row & column first
        for(let k=0; k<grid[row].length; k++) {
            if(num === parseInt(grid[row][k])) return false; // CHECK ROW || if False = We have this number in a row already
            if(num === parseInt(grid[k][index_in_row])) return false; // CHECK COLUMN || if False =  We have this number in a column already
        }

        // Check square at last

        for(let square_row=0; square_row<3; square_row++) {
            for(let square_column=0; square_column<3; square_column++) {
                if(num === parseInt(grid[(Math.floor(row / 3) * 3) + square_row][(Math.floor(index_in_row / 3) * 3) + square_column])) return false; // CHECK SQUARE || if False = We have this number in a square already
            }
        }

        return true;
        
    },

    // This one is a Toolbox specific function, which repaints the board whenever player 'travels in time'
    travelInTime: function(current_step, game_history, activeTiles_history, setActive, finalDifficulty, props) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);
        console.log(game_history);
        console.log(current_step);
        //console.log(ordered);


        // KONIECZNE BĘDZIE JESZCZE PRZYGOTOWANIE MECHANIZMU ZABEZPIECZAJĄCEGO, GDY GRACZ PO NADPISANIU HISTORII GRY, ZMIENI NAGLE KAFELEK
        // Z "PENCILMARK TILE" NA "SINGLE DIGIT" TILE, PO CZYM COFNIE SIĘ W CZASIE DO POPRZEDNIEJ TURY -> EDIT: GOTOWE ✔️

        console.log(game_history[current_step])
        for(let tile = 0; tile<ordered.length; tile++) {
            let row = Math.floor(tile / 9); 
            let column = tile%9;

            // Przy używaniu podróży w czasie zmieniaj pozycję wskaźnika "active"
             if(ordered[(row * 9) + column].classList.contains('active')) {   
                ordered[(row * 9) + column].classList.remove('active');
            } 

            if(ordered[(row * 9) + column].classList.contains('pencilmark_tile') && typeof(game_history[current_step][row][column]) === 'object') {
                console.log('Lets deal with array now')
                //console.log(ordered[(row * 9) + column].childNodes, game_history[current_step][row][column])
                
                let orderedPencilmarks = [];
                for(let y=0; y<ordered[(row * 9) + column].childNodes.length; y++) {
                    if(parseInt(ordered[(row * 9) + column].childNodes[y].textContent)) {  // ☢️
                        orderedPencilmarks.push(parseInt(ordered[(row * 9) + column].childNodes[y].textContent));  // ☢️
                    }
                }

                console.log(orderedPencilmarks, game_history[current_step][row][column]);
                if(orderedPencilmarks.length !== game_history[current_step][row][column].length) {
                    let pencilmarkToModify;
                    let longerArray = (orderedPencilmarks.length > game_history[current_step][row][column].length) ? orderedPencilmarks : game_history[current_step][row][column];
                    let shorterArray = (orderedPencilmarks.length > game_history[current_step][row][column].length) ? game_history[current_step][row][column] : orderedPencilmarks;
                    // W pencilmarks tego kafelka nastąpił update. Zidentyfikuj zmianę w tym kafelku
                    longerArray.some((val, ind) => {
                        if(!shorterArray.includes(val)) {
                            pencilmarkToModify = val;
                            return val;
                        }
                    })

                    console.log(pencilmarkToModify);

                    let pencilmark_tile = ordered[(row * 9) + column].querySelector(`.no-${pencilmarkToModify}`);
                    (parseInt(pencilmark_tile.textContent)) ? pencilmark_tile.textContent = '' : pencilmark_tile.textContent = pencilmarkToModify;  // ☢️ ☢️ ☢️
                }
            }

            // When player change tile role from "pencilmark" to "single digit" and vice versa
            else if(ordered[(row * 9) + column].classList.contains('pencilmark_tile') || typeof(game_history[current_step][row][column]) === 'object') {
                console.warn('entering dev state');
                // ... TO DO
                if(ordered[(row * 9) + column].classList.contains('pencilmark_tile')) {
                    // "Pencilmark tile" -> "Single digit tile"
                    console.log("Pencilmark tile -> Single digit tile");
                    ordered[(row * 9) + column].classList.remove('pencilmark_tile');
                    while(ordered[(row * 9) + column].childNodes.length) {
                        ordered[(row * 9) + column].childNodes[ordered[(row * 9) + column].childNodes.length - 1].remove();
                    }
                    // At last append before existent number to the tile
                    ordered[(row * 9) + column].textContent = game_history[current_step][row][column];  // ☢️
                }

                else if(typeof(game_history[current_step][row][column]) === 'object') {
                    // "Single digit tile -> Pencilmark tile"
                    console.log("Single digit tile -> Pencilmark tile");
                    ordered[(row * 9) + column].textContent = '';   // ☢️
                    ordered[(row * 9) + column].classList.add('pencilmark_tile');
                    // Append divs to pencilmark tile
                    for(let x=1; x<=9; x++) {
                        let el = document.createElement('div');
                        //if(x === parseInt(e.target.textContent)) {el.textContent = e.target.textContent};
                        // ⛔ Uncaught TypeError: Cannot read properties of null (reading 'includes')
                        console.log(game_history[current_step][row][column], x)
                        if(game_history[current_step][row][column] === null) {game_history[current_step][row][column] = ''}
                        if(game_history[current_step][row][column].includes(x)) { // Throws errors 💀 - we need to test if it's still an issue here
                            let ind = game_history[current_step][row][column].indexOf(x);
                            el.textContent = game_history[current_step][row][column][ind];  // ☢️
                        }
                        //console.log(game_history[current_step][row][column].length);
                        el.classList.add('xd', `no-${x}`);
                        ordered[(row * 9) + column].appendChild(el);
                    }
                }
            }

            // This statements will not work for pencilmarks !
            else if(ordered[(row * 9) + column].textContent !== game_history[current_step][row][column]) {  // ☢️
                console.log(ordered[(row * 9) + column], game_history[current_step][row][column])
                ordered[(row * 9) + column].textContent = game_history[current_step][row][column];   // ☢️
            }

            /* if(typeof(game_history[current_step][row][column]) !== 'string'  || (typeof(game_history[current_step][row][column]) === 'string' && !parseInt(game_history[current_step][row][column]))) {
                // It means it's not initial tile - because those can never be modified by history travel
                // Now determine whether a tile is normal digit appen
                console.log(parseInt(game_history[current_step][row][column]), game_history[current_step][row][column])

                if(typeof(game_history[current_step][row][column]) === 'string') {
                    console.log('empty cell');
                }
                else if(typeof(game_history[current_step][row][column]) === 'number') {
                    console.log(`it's number`);
                }
                else if(typeof(game_history[current_step][row][column]) === 'object') {
                    console.log(`it is Pencilmark Array`)
                }
            } */

            if(!game_history[current_step][row][column]) {
                // If we used rubber, this might happen. Instead of appending 'NaN', let's append ''
                ordered[(row * 9) + column].textContent = ''; // ☢️
                
            }
        }

        //console.log(game_history, activeTiles_history);

        // At the very end update active class
        //console.log(ordered[activeTiles_history[current_step] - 1]);
        if(ordered[activeTiles_history[current_step] - 1]) {
            ordered[activeTiles_history[current_step] - 1].classList.add('active'); // For undo & redo 
            setActive(ordered[activeTiles_history[current_step] - 1])
            // And apply proper highlighting
            this.resetHighlightEffect(props);
            this.applyHighlightEffect(ordered[activeTiles_history[current_step] - 1], finalDifficulty);
        } else {
            // When we move forward to the very recent move  (prevents from errors !)
            ordered[activeTiles_history[current_step - 1] - 1].classList.add('active');
            setActive(ordered[activeTiles_history[current_step - 1] - 1])
            // And apply proper highlighting
            this.resetHighlightEffect(props);
            this.applyHighlightEffect(ordered[activeTiles_history[current_step - 1] - 1], finalDifficulty);
        }
        //ordered[(activeTiles_history[current_step] + 1) - 1].classList.add('active'); // For redo
    
    },

    resetSudoku: function(final_difficulty) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        ordered.forEach(el => {
            el.textContent = '';  // ☢️
            el.style.color = '';
            el.classList.remove(`active`, `initial`, `initial-night`, `initial-day`, `pencilmark_tile`, /* `tile-${final_difficulty}` */);
        })
    },

    resetHighlightEffect: function({theme}) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);
        console.log(theme);
        if(theme === 'night') {
            for(let tile_no = 0; tile_no<ordered.length; tile_no++) {
                ordered[tile_no].style.backgroundColor = `#000`;
            }
        }
    },

    applyHighlightEffect: function(e_target, finalDifficulty) {
        //console.log(e, e.target);
        //console.log(e.target, e.target.dataset.order, parseInt(Math.floor(e.target.dataset.order - 1) / 9), parseInt((e.target.dataset.order - 1) % 9));
        const activeTile_row = parseInt(Math.floor(e_target.dataset.order - 1) / 9);
        const activeTile_col = parseInt((e_target.dataset.order - 1) % 9);

        const activeTileSquare_row = Math.floor(activeTile_row / 3) * 3;
        const activeTileSquare_col = Math.floor(activeTile_col / 3) * 3;

        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        this.applyHighlightForRowAndCol(ordered, activeTile_row, activeTile_col, finalDifficulty);
        this.applyHighlightForSquare(ordered, activeTileSquare_row, activeTileSquare_col, finalDifficulty);
    },

    applyHighlightForRowAndCol: function(ordered, this_row, this_col, finalDifficulty) {
        for(let iir=0; iir<9; iir++) {
            ordered[(this_row * 9) + iir].style.backgroundColor = this.colors['highlight'][finalDifficulty];  // For row
            ordered[(iir * 9) + this_col].style.backgroundColor = this.colors['highlight'][finalDifficulty];  // For col
        }
    },

    applyHighlightForSquare: function(ordered, this_square_row, this_square_col, finalDifficulty) {
        console.log(this_square_row, this_square_col);
        for(let sq_row=0; sq_row<3; sq_row++) {
            for(let sq_col=0; sq_col<3; sq_col++) {
                ordered[((this_square_row + sq_row) * 9) + (this_square_col + sq_col)].style.backgroundColor = this.colors['highlight'][finalDifficulty]; // For square
            }
        }
    },

    removeOutDatedPencilmarks: function(currentHistory_copy_history, activeTile_Row, activeTile_Col, parsed_pressed_digit) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        const activeTileSquare_Row = Math.floor(activeTile_Row / 3) * 3;
        const activeTileSquare_Col = Math.floor(activeTile_Col / 3) * 3;

        // For rows & cols
        for(let iir=0; iir<9; iir++) {
            // Row
            if(typeof(currentHistory_copy_history[activeTile_Row][iir]) === 'object' && currentHistory_copy_history[activeTile_Row][iir].length) {
                if(currentHistory_copy_history[activeTile_Row][iir].includes(parsed_pressed_digit)) {
                    let ind = currentHistory_copy_history[activeTile_Row][iir].indexOf(parsed_pressed_digit);
                    currentHistory_copy_history[activeTile_Row][iir].splice(ind, 1);
                    ordered[(activeTile_Row * 9) + iir].childNodes[parsed_pressed_digit - 1].textContent = '';
                }
            }
            // Col
            if(typeof(currentHistory_copy_history[iir][activeTile_Col]) === 'object' && currentHistory_copy_history[iir][activeTile_Col].length) {
                if(currentHistory_copy_history[iir][activeTile_Col].includes(parsed_pressed_digit)) {
                    let ind = currentHistory_copy_history[iir][activeTile_Col].indexOf(parsed_pressed_digit);
                    currentHistory_copy_history[iir][activeTile_Col].splice(ind, 1);
                    ordered[(iir * 9) + activeTile_Col].childNodes[parsed_pressed_digit - 1].textContent = '';
                }
            }
        }

        // For squares 
        for(let sq_row=0; sq_row<3; sq_row++) {
            for(let sq_col=0; sq_col<3; sq_col++) {
                if(typeof(currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col]) === 'object' && currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].length) {
                    if(currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].includes(parsed_pressed_digit)) {
                        let ind = currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].indexOf(parsed_pressed_digit);
                        currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].splice(ind, 1);
                        ordered[((activeTileSquare_Row + sq_row) * 9) + (activeTileSquare_Col + sq_col)].childNodes[parsed_pressed_digit - 1].textContent = '';
                    }
                }
            }
        }

    },

    interact: function() {
        console.log('clicked');
    },
 
}

export { engine, success_board };