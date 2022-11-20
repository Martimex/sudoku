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
let success_board = [];

const store = {
    sudoku_easy: [],
    sudoku_medium: [],
    sudoku_hard: [],
    sudoku_master: [],
}

const engine = {

    squareRows: 3,
    squareColumns: 3,
    rows: 9,
    columns: 9,

    colors: {
        highlight: {
            day: {
                easy: 'hsla(116, 40%, 70%, .4)',
                medium: 'hsla(55, 40%, 70%, .4)',
                hard: 'hsla(12, 40%, 70%, .4)',
                master: 'hsla(182, 40%, 70%, .4)',
            },

            night: {
                easy: 'hsla(116, 40%, 30%, .4)',
                medium: 'hsla(55, 40%, 30%, .4)',
                hard: 'hsla(12, 40%, 30%, .4)',
                master: 'hsla(182, 40%, 30%, .4)',
            },
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

    checkRowCompatibility: function(numbers_array, thisEl, ordered) {
        /* As Sudoku grid is filled with numbers, engine goes row by row, meaning
            this checker function is not needed (as opposed to checkColumnCompatibility and checkSquareCompatibility)
        */
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
            delete possibilitiesObj[parseInt(usedDigits[usedDigits.length - 1])];
        }

        return true;
    },

    setBoard: function() {
        //console.log(success_board);
        if(success_board.length) {
            //while(success_board.length) { success_board.pop(); console.log('rm one')};
            //success_board.splice(0);
            success_board = [];
        }

        for(let success_board_row = 0; success_board_row < 9; success_board_row++) {
            success_board.push([]);
            for(let success_board_tile_in_row = 0; success_board_tile_in_row < 9; success_board_tile_in_row++) {
                success_board[success_board_row].push('');
            }
        } 

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

    reduceAvailableDigits: function(sudoku_grid) {
        let newAvailableDigits = {
            1: 9,
            2: 9,
            3: 9,
            4: 9,
            5: 9,
            6: 9,
            7: 9,
            8: 9,
            9: 9,
        } 

        for(let sudoku_row = 0; sudoku_row < 9; sudoku_row++) {
            for(let sudoku_col = 0; sudoku_col < 9; sudoku_col++) {
                if(parseInt(sudoku_grid[sudoku_row][sudoku_col]))  {
                    newAvailableDigits[parseInt(sudoku_grid[sudoku_row][sudoku_col])]--;
                }
            }
        }

        return newAvailableDigits;
    },

/*     gatherTilesData: function(allTiles) {
        const arr = [];

        for(let a=0; a<this.rows; a++) {
            arr.push([]);
        }

        for(let b=0; b<allTiles.length; b++) {
            arr[Math.floor(b / this.rows)].push(allTiles[b]);
        }
        return arr;
    }, */

    hideDigits: function(difficulty, theme) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        if(initial_board.length) {
            while(initial_board.length) initial_board.pop();
        }

        for(let initial_board_row = 0; initial_board_row < 9; initial_board_row++) {
            initial_board.push([]);
            for(let initial_board_tile_in_row = 0; initial_board_tile_in_row < 9; initial_board_tile_in_row++) {
                initial_board[initial_board_row].push(success_board[initial_board_row][initial_board_tile_in_row]);
            }
        } 

        const randInitial = Math.floor(Math.random() * ((rules[difficulty].initialNumbers.max - rules[difficulty].initialNumbers.min) + 1)) + rules[difficulty].initialNumbers.min;

        // Remove counterparts
        // 1. First randomize, whether the middle tile in middle square should be hidden or not
        const randHide = Math.floor(Math.random() * 2);
        const initialCounterPartsRemove = 18;
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

            initial_board[rand_row][rand_col] = '';  
            initial_board[8 - rand_row][8 - rand_col] = ''; 

            let isStillUnique = this.backtrack();
            //const hardestMethodNo = this.solveSudoku(); -> uncomment when rebuilding
            if((isStillUnique) /* && (rules[difficulty]['bestMethodsAllowed'].includes(hardestMethodNo)) -> uncomment when rebuilding */) {
                randomElemsToHide.splice(ind, 1);
            } else {
                c = c - 1;
                initial_board[rand_row][rand_col] = partDigit[0];
                initial_board[8 - rand_row][8 - rand_col] = counterPartDigit[0];
            }  


        }

        // To this point Sudoku can be 100% solved with only Single Candidate and Single Position (36 - 37 digits already removed)

        let substr = 2;
        let multiRemove_start = 81 - ((initialCounterPartsRemove * 2) + randHide);
        let multiRemove_stop = 34;
        let i;

        let remainTiles = [];
        for(let board_row = 0; board_row < 9; board_row++) {
            for(let tile_in_row = 0; tile_in_row < 9; tile_in_row++) {
                if(parseInt(initial_board[board_row][tile_in_row])) {
                    remainTiles.push([board_row, tile_in_row]);
                }
            }
        }

        for(i=multiRemove_start; i>multiRemove_stop - randHide; i = i - substr) {

            let temp = [];
            let tempDigit = [];

            for(let x=0; x<substr; x++) {
                let rand = Math.floor(Math.random() * remainTiles.length);
                temp.push([remainTiles[rand][0], remainTiles[rand][1]]); // Get tile cords
                tempDigit.push(initial_board[remainTiles[rand][0]][remainTiles[rand][1]]);
                initial_board[remainTiles[rand][0]][remainTiles[rand][1]] = '';
                remainTiles.splice(rand, 1);
            }

            let isStillUnique = this.backtrack();

            if(!isStillUnique) {
                for(let x=0; x<temp.length; x++) {
                    initial_board[temp[x][0]][temp[x][1]] = tempDigit[x];
                    remainTiles.push([temp[x][0], temp[x][1]]);
                }
                i = i + substr;
            }
        } 

        this.singleRemoval(initial_board, remainTiles, randInitial, i, randHide,  rules[difficulty]['renderingTrials'], 0); 

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

        //let isUnique = this.backtrack();
        //console.warn('isSudokuUnique? ', isUnique, success_board);
        const hardestMethodNo = this.solveSudoku();
        //console.log('Hardest method no is... ', hardestMethodNo);

        this.applyInitials(theme);

        let difficulty_name;

        for(let key in rules) {
            if(rules[key]['bestMethodsAllowed'].includes(hardestMethodNo)) {
                difficulty_name = key;
            }
        }

        return difficulty_name;
    },

    setInitialClassToChosenTiles: function({theme}) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];

        allTilesArray.forEach(tile => {
            if(tile.textContent) {  //  Not activated, so it wont be a problem
                tile.classList.add(`initial`, `initial-${theme}`);
            }
        })
    },

    applyInitials: function(theme) {
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
        // ITERATIVE APPROACH
        let remainTilesCopy = [...remainTiles];
        let elAndDigit = [];

        const time_stop = 1750;
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
                if(remainTilesCopy.length <= (remainTiles.length / 2)) { // WE WANT TO SAVE TIME FOR RENDERING, THATS WHY IT LOOKS LIKE THAT
                    return;
                }
            }

            let measure_stop = Date.now();
            if(measure_stop - measure_start > time_stop) { return; }

            elAndDigit.pop(); 
        }
    },

    solveSudoku: function() {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
    
        // Our array of methods
        const methodsArr = [singleCandidate, singlePosition, candidateLines, doublePairs,  nakedSubset, hiddenSubset, xWings, swordFish];

        let grid = [];

        ordered.map((el, index) => { 
            if(index % 9 === 0 ) {
                grid.push([]);
            }
            el.textContent ? grid[grid.length -1].push(el.textContent) : grid[grid.length -1].push([]);  // ☢️  ☢️
        })

        fillGrid(grid);

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
                            didHelp = true;
                        }
                    }
                }
                return didHelp;
            }

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
            for(let r=0; r<9; r++) {
                for(let iir=0; iir<9; iir++) {
                    if((grid[r][iir].length <= 1) && (typeof(grid[r][iir]) !== 'string')) { 
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
                        let isUpd = applyOnePosition(grid, r, iir, singPos_Row, 'r');
                        if(isUpd) {helpedSolving = true};
                    }
                    if((typeof(grid[iir][r]) === 'object') && (singPos_Col.length > 0)) {
                        let isUpd = applyOnePosition(grid, iir, r, singPos_Col, 'c');
                        if(isUpd) {helpedSolving = true};
                    }
                    if((typeof(grid[sq_r][sq_c]) === 'object') && (singPos_Sqr.length > 0)) {
                        let isUpd = applyOnePosition(grid, sq_r, sq_c, singPos_Sqr, 's');
                        if(isUpd) {helpedSolving = true};
                    }
                }
            }

            return helpedSolving;
        }

        function candidateLines()  {
            let helpedSolving = null;
            const allSquares = getSquares();
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
                for(let num = 1; num <= 9; num++) { // Verify if that cant be improved (time-wise)
                    if((digitsToCheck.has(num)) && (!exceptionDigits.has(num))) {
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
            // Rows and columns can be safely gathered from grid, but squares from a special function: getSquares()
            let helpedSolving = null;
            const allSquares = getSquares();

            for(let square_in_line=0; square_in_line < 3; square_in_line++) {
                // Set, from which we get all numbers
                let square_in_line_row_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let square_in_line_col_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                let square_in_line_row_set = new Set();
                let square_in_line_col_set = new Set();

                // Create 2 pointers that changes their position over every iteration

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


                /* Take the row/column from pointer1 and pointer2 and check if it occurs as an option in three
                squares through which it passes. If so, look for a square in which grids (inside the line
                not_detected) it does not occur. If such a square is, then for its remaining lines can be excluded
                from the checked digit option
                */

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
            // If isHidden parameter is specified, it means we are looking for Hidden Subset. If not specified, we are checking Naked Subset
            // Has to be applied for rows, columns and squares || we are looking for pair, triples, [not quads yet !]
            let helpedSolving = null;
            const allSquares = getSquares();

            const nakedSubset_size = [2, 3]; // We only work for double / tripple subsets
           
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

            for(let subset_iter=0; subset_iter<nakedSubset_size.length; subset_iter++) { // For chosen subset length
                for(let dimension_no=0; dimension_no<Object.keys(dimensionObj).length;  dimension_no++) { // For chosen dimension (row / column / square)
                    for(let dimension_item=0; dimension_item<9; dimension_item++) { // For content of above dimension (line - row, col || box - square)
                        dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]].dimArr.push([]);
                        dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]].uniqueOptionsAsNaked_dim.push([]);
                        let isHelpful = testNakedSubset(grid, allSquares, Object.keys(dimensionObj)[dimension_no], dimensionObj[Object.keys(dimensionObj)[dimension_no]][nakedSubset_size[subset_iter]], nakedSubset_size[subset_iter], dimension_no, dimension_item, isHidden);
                        if(isHelpful) {helpedSolving = true;}
                    }
                }
            }

            return helpedSolving;
        }

        function hiddenSubset() {
            // Has to be applied for rows, columns and squares || we are looking for pair, triples [not] quads
            // This short function is for hidden version of Subsets' technique
            let helpedSolving = null;
            const testHidden = nakedSubset('hidden');
            if(testHidden) {helpedSolving = true;}
            return helpedSolving;
        }

        function xWings(isSwordfish) {
            let helpedSolving = null;
        
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
                    const twiceInDimNums = { };             
                    for(let tileInLine_no = 0; tileInLine_no < 9; tileInLine_no ++) {
                        // For each tile in line ( tile in line ... in row, tile in line ... in column)
                        if(detectedDimensions[currentDimension_no] === 'row') {
                            if(typeof(grid[currentLine_no][tileInLine_no]) === 'object') {
                                // We can surmise it's length is two or more
                                if(grid[currentLine_no][tileInLine_no].length > 1) {
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
                                    for(let no = 0; no<grid[tileInLine_no][currentLine_no].length; no++) {
                                        if(!twiceInDimNums.hasOwnProperty(grid[tileInLine_no][currentLine_no][no])) {
                                            twiceInDimNums[grid[tileInLine_no][currentLine_no][no]] = [tileInLine_no];
                                        } else {
                                            twiceInDimNums[grid[tileInLine_no][currentLine_no][no]].push(tileInLine_no);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    dimensionObj[detectedDimensions[currentDimension_no]].numsTwiceInDim.push([]);
                    dimensionObj[detectedDimensions[currentDimension_no]].numsTwiceInDim_Indexes.push([]);

                    for(let num in twiceInDimNums) {
                        if(twiceInDimNums[num].length === 2) {
                            dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim'][currentLine_no].push(parseInt(num));
                            dimensionObj[detectedDimensions[currentDimension_no]]['numsTwiceInDim_Indexes'][currentLine_no].push(twiceInDimNums[num]);
                        }
                    }
                }

                let testIfHelps = checkForXWingsOrSwordfish(grid, dimensionObj, detectedDimensions[currentDimension_no], isSwordfish);
                if(testIfHelps) {helpedSolving = true;}
            }

            return helpedSolving;
        }

        function swordFish() {
            let helpedSolving = null;
            const testSwordfish = xWings('swordfish');
            if(testSwordfish) { helpedSolving = true; }
            return helpedSolving;
        }


        // while finishes executing, when our last - hardest - technique returns false. At this point sudoku cannot be solved more, using already implemented techinques

        let currMethodNo = 0;
        let bestMethod = 0;
        while(currMethodNo < methodsArr.length) {
            let doesItHelp = methodsArr[currMethodNo]();
            if(doesItHelp) { 
                if(currMethodNo > bestMethod) {
                    bestMethod = currMethodNo;
                }
                currMethodNo = 0; 
                updateGrid(grid); 
            }
            else if(!doesItHelp) {
                currMethodNo++;
            }
        }
        const isGridFullyFilled = testGridFullyFilled(grid); 
        if(!isGridFullyFilled) {
            bestMethod = null;
        }

        function testGridFullyFilled(grid) {
            for(let row = 0; row<9; row++) {
                for(let col = 0; col<9; col++) {
                    if(typeof(grid[row][col]) === 'object') {
                        return false;
                    }
                }
            }
            return true;
        }

        function checkForXWingsOrSwordfish(grid, dimensionObj, currentDim, isSwordfish) {
            let isHelpful = null;
            let pointersCount = 2;
            if(isSwordfish) {
                pointersCount = 3;
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
                                        // Gather unique indexes for pointers 'static' and 'dynamic', for which this number occurs - and check if pointer 'conditional' has them all
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

                                                let pointersIndexes_arr = [pointer_static_pos, pointer_dynamic_pos, pointer_conditional_pos];
                                                let didHelp = checkCounterpartRemoval(currentDim, pointersIndexes_arr, dimensionObj[currentDim]['numsTwiceInDim'][pointer_static_pos][staticInd], pointersUniqueIndexes_array, pointersCount, isSwordfish);
                                               
                                                if(didHelp) {isHelpful = true;}
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

            // Now let's finish things off with potential removals

            if(currentDim === 'row') {
                for(let pointer_no_counterpart = 0; pointer_no_counterpart <  pointersCount; pointer_no_counterpart++) {
                    // For each pointer counterpart
                    for(let tile_in_counterpart = 0; tile_in_counterpart < 9; tile_in_counterpart++) {
                        // For each tile in chosen counterpart
                        // If checked tile has this number as an option, and it's not part of the x-wings
                        if(typeof(grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]]) === 'object') {
                            if((grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].includes(digit)) && (!pointersIndexes_arr.includes(tile_in_counterpart))) {
                                let index = grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].indexOf(digit);
                                grid[tile_in_counterpart][digitIndexes_arr[pointer_no_counterpart]].splice(index, 1);
                                isHelpful = true;
                            }
                        }
                    }
                }
            } else {
                // if currentDim === 'column'
                for(let pointer_no_counterpart = 0; pointer_no_counterpart < pointersCount; pointer_no_counterpart++) {
                    for(let tile_in_counterpart = 0; tile_in_counterpart < 9; tile_in_counterpart++) {
                        if(typeof(grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart]) === 'object') {
                            if((grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].includes(digit)) && (!pointersIndexes_arr.includes(tile_in_counterpart))) {
                                let index = grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].indexOf(digit);
                                grid[digitIndexes_arr[pointer_no_counterpart]][tile_in_counterpart].splice(index, 1);
                                isHelpful = true;
                            }
                        }
                    }
                }
            }

            return isHelpful;
        }
        
        function testNakedSubset(grid, allSquares, dimensionObj_dim, dimensionObj_dim_subset_l,  nakedSubset_l, dimension_no, dimension_item, isHidden) {
            let didHelp = false;

            for(let dimension_item_tile=0; dimension_item_tile<9; dimension_item_tile++) { // For each tile in line / box
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

            let numsObj = {};

            if(isHidden) {
                for(let tileNo = 0; tileNo <dimensionObj_dim_subset_l.dimArr[dimension_item].length; tileNo++) {
                    for(let option_index = 0; option_index < dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo].length; option_index++) {
                        numsObj[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]] = (numsObj[dimensionObj_dim_subset_l.dimArr[dimension_item][tileNo][option_index]]+1) || 1;
                    }
                } 
            }

            if(isHidden) {
                // allHiddenSubset_Digits -> array of arrays, in which are all elements of each own subset  
                const allHiddenSubset_Digits = checkIfHiddenUnique(dimensionObj_dim_subset_l.dimArr[dimension_item], nakedSubset_l, numsObj);

                // Modify grid based on allHiddenSubset_Digit
                for(let hiddenSubsetsfound = 0; hiddenSubsetsfound<allHiddenSubset_Digits.length; hiddenSubsetsfound++) {
                    // For each found hidden subset and it's 2 to 3 unique digits (there's usually 1 such subset)
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
                            // Remove numbers from grid and point out, that the function helps us
                            if((dimensionObj_dim === 'row') && (typeof(grid[dimension_item][tile_in_dimension]) === 'object')) {
                                if((grid[dimension_item][tile_in_dimension].length > 1) && (grid[dimension_item][tile_in_dimension].length !== options_updated.length)) {
                                    grid[dimension_item][tile_in_dimension] = options_updated;
                                    didHelp = true;
                                }
                            } else if((dimensionObj_dim === 'column') && (typeof(grid[tile_in_dimension][dimension_item]) === 'object'))  {
                                if((grid[tile_in_dimension][dimension_item].length > 1) && (grid[tile_in_dimension][dimension_item].length !== options_updated.length)) {
                                    grid[tile_in_dimension][dimension_item] = options_updated;
                                    didHelp = true;
                                }
                            } else if((dimensionObj_dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  {
                                if((grid[sq_r][sq_c].length > 1) && (grid[sq_r][sq_c].length !== options_updated.length)) {
                                    grid[sq_r][sq_c] = options_updated;
                                    didHelp = true;
                                }
                            }
                        }
                    }
                }
                
            }

            else {
                for(let no=0; no<9; no++) { // for each element in a given dimension (9 elems in line / box)
                    // Test for each row || column || square
                    if(dimensionObj_dim_subset_l.dimArr[dimension_item][no].length === nakedSubset_l) {
                        const isUniqueTileOptions = checkIfUnique(dimensionObj_dim_subset_l.dimArr[dimension_item], dimensionObj_dim_subset_l.dimArr[dimension_item][no], dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item], nakedSubset_l);
                        if(isUniqueTileOptions) {
                            dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item].push(dimensionObj_dim_subset_l.dimArr[dimension_item][no]);
                        }
                    }  
                }

                for(let found_subsets = 0; found_subsets < dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item].length;  found_subsets++) {
                    // For every unique subset found (example is: [2, 4]) This subset has to happen either 2 or 3 times !
                    let same_subset = 0;
                    for(let tile_no = 0; tile_no < 9; tile_no++) {
                        let same_digit = 0;
                        if(dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets].length === dimensionObj_dim_subset_l.dimArr[dimension_item][tile_no].length) {
                            for(let n=0; n<nakedSubset_l;  n++) {
                                if(dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets][n] === dimensionObj_dim_subset_l.dimArr[dimension_item][tile_no][n]) {
                                    same_digit++;
                                    if(nakedSubset_l === same_digit) { // If we have the same subset, which we compare with the unique version (uniqueOptionsAsNaked_dim)
                                        same_subset++;
                                    }
                                    if(nakedSubset_l < same_subset) { /* Don't do anything with it, since it might throw an error */}
                                    if(nakedSubset_l === same_subset) { // If the number of (exactly the same) found subsets is equals to their length (the function would probably help)
                                        same_subset++; // We have to ensure that it happens only once !
                                        // It means we found legit subset pair / tripple ! So function *probably* helps + just remove subset numbers from other (non-subset pair/tripple) tiles (if those exists - that's why *probably*)
                                        const didItRemoved = removeSubsetDigits(grid, dimensionObj_dim_subset_l.dimArr[dimension_item], dimensionObj_dim_subset_l.uniqueOptionsAsNaked_dim[dimension_item][found_subsets], dimension_item, tile_no, dimensionObj_dim);
                                        if(didItRemoved) {didHelp = true;}
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Now we can focus on subset methods that are length specific :
            // 1) Incomplete tripple subset -> {3, 6} {3, 6, 9} {3, 6, 9} || {2, 7} {2, 8} {2, 7, 8}
            // 2) Three double subsets -> {4, 9} {2, 4} {2, 9}

            // 1)
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
                // isHidden - check if we are looking for hidden subsets. If so, in this case we don't care about subsets lengths anymore, since some numbers might 'hide' actual subset digits

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
                        }

                        function checkExactDuplicates(checked_el, compared_el) {
                            if(!compared_el) {return false;}
                            let areExact = false;
                            if((checked_el.length === 2) && (compared_el.length === 2)) {
                                areExact = true;
                                for(let index = 0; index < 2; index++) {
                                    // Compare indexes of those elems and check if those are not exast same duplicates
                                    if(parseInt(checked_el[index]) !== parseInt(compared_el[index])) {
                                        areExact = false;
                                    }
                                }
                            }
                            
                            return areExact;
                        }
                    }
                }

                if(doubleInDimArr.length < 3) { return false;}

                // So now we have all double subset which are 100% not duplicative, and we have 3 or more of them

                // 1. Gather  all numbers from remaining doubles
                const doubleNums = {};

                for(let doubleNo = 0; doubleNo <doubleInDimArr.length; doubleNo++) {
                    for(let doubleNo_index = 0; doubleNo_index < doubleInDimArr[doubleNo].length; doubleNo_index++) {
                        doubleNums[doubleInDimArr[doubleNo][doubleNo_index]] = (doubleNums[doubleInDimArr[doubleNo][doubleNo_index]]+1) || 1;
                    }
                }

                // 2. Remove doubles, which has num / nums that exists more or less than exactly 2 times && then check for 3 or above length (only for naked subset) - hidden has its own version
                if(isHidden) {
                    for(let double_el = 0; double_el<doubleInDimArr.length; double_el++) {
                        let twiceInDim = 0;
                        for(let digit_as_option = 0; digit_as_option<doubleInDimArr[double_el].length; digit_as_option++) {
                            if(doubleNums[doubleInDimArr[double_el][digit_as_option]] === 2) {
                                twiceInDim++;
                            }
                        }
                        if(twiceInDim !== 2) {
                            doubleInDimArr.splice(double_el, 1);
                            indexArr.splice(double_el, 1);
                            double_el--;
                        }
                    }
                }
                else {
                    for(let key in doubleNums) {
                        if(doubleNums[key] !== 2) {
                            for(let doubleNo = 0 ; doubleNo < doubleInDimArr.length; doubleNo++) {
                                if(doubleInDimArr[doubleNo].includes(parseInt(key))) {
                                    doubleInDimArr.splice(doubleNo, 1);
                                    doubleNo--;
                                }
                            }
                        }
                    }
                }    

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

                        if(uniqueDigits.size !== 3) {return false; } // In some specific cases set get a length of 4 - this line prevents from errors

                    } else {
                        uniqueDigits = new Set([].concat(...doubleInDimArr));
                        if(uniqueDigits.size !== 3) {return false; } // In some specific cases set get a length of 4 - this line prevents from errors
                    }
                   
                    // We have found three double subset ! Now just check if it helps removing anything
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
                                        didHelp = true;
                                    }
                                } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                    const isHiddenSubset = checkHiddenSubset(grid[dimension_tile][dim_no], uniqueDigits);
                                    if(isHiddenSubset) {
                                        grid[dimension_tile][dim_no] = isHiddenSubset;
                                        didHelp = true;
                                    }
                                } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                    const isHiddenSubset = checkHiddenSubset(grid[sq_r][sq_c], uniqueDigits);
                                    if(isHiddenSubset) {
                                        grid[sq_r][sq_c] = isHiddenSubset;
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
                            // Remove digits from grid, and point out that the function helped
                            if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                const isNotaSubset = checkNotASubset(grid[dim_no][dimension_tile], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[dim_no][dimension_tile] = isNotaSubset;
                                    didHelp = true;
                                }
                            } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                const isNotaSubset = checkNotASubset(grid[dimension_tile][dim_no], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[dimension_tile][dim_no] = isNotaSubset;
                                    didHelp = true;
                                }
                            } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  {
                                const isNotaSubset = checkNotASubset(grid[sq_r][sq_c], uniqueDigits);
                                if(isNotaSubset) {
                                    grid[sq_r][sq_c] = isNotaSubset;
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

                    for(let x=0; x<currTileOptions_copy.length; x++) {
                        if(!numsToKeep.has(currTileOptions_copy[x])) {
                            currTileOptions_copy.splice(x, 1);
                            x--;
                            didRemove = true;
                        }
                    }

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
                // isHidden - check if we are looking for hidden subsets. If so, in this case we don't care about subsets lengths anymore, since some numbers might 'hide' actual subset digits
          
                let didHelp = false;

                // isHidden?
                //   NO - Pick all tripples from current line / box and keep in trippleInDimArr
                //  YES - Pick all tripples / quads / quints (or higher!) from current line / box and keep in trippleInDimArr

                let trippleInDimArr = thisDimOptions.filter((val, index) => {
                    // We don't actually need this for hidden version
                    if(thisDimOptions[index].length === 3) return true;
                    else {return false;}
                })

                // If we don't find anything that meets above criteria (-> no tripples || quads / quints found)
                if(trippleInDimArr.length === 0 && (!isHidden)) {return false;}

                let numsObj = {};

                if(isHidden) {
                    for(let tileNo = 0; tileNo <thisDimOptions.length; tileNo++) {
                        for(let option_index = 0; option_index < thisDimOptions[tileNo].length; option_index++) {
                            numsObj[thisDimOptions[tileNo][option_index]] = (numsObj[thisDimOptions[tileNo][option_index]]+1) || 1;
                        }
                    }   

                    let uniqueNumbers = []; // array of digits, which options happened only twice or three times within whole line / box
                    for(let key in numsObj) {
                        if(numsObj[key] === 2 || numsObj[key] === 3)  uniqueNumbers.push(parseInt(key));
                    }

                    let uniqueNumInTilesNo = [];

                    for(let uniqueInd = 0; uniqueInd < uniqueNumbers.length; uniqueInd++) {
                        uniqueNumInTilesNo.push([]);
                        for(let tile_in_dimension = 0; tile_in_dimension < thisDimOptions.length; tile_in_dimension++) {
                            if(thisDimOptions[tile_in_dimension].includes(uniqueNumbers[uniqueInd])) {
                                uniqueNumInTilesNo[uniqueNumInTilesNo.length - 1].push(tile_in_dimension);
                            }
                        }
                    }

                    let uniqueSubsetDigits = [];
                    for(let uniqueNumbersInd = 0; uniqueNumbersInd < uniqueNumbers.length; uniqueNumbersInd++) {
                        if(uniqueNumbers.length < 3) { return false; }
                        let potentialSubset = [0];
                        for(let cordsToTest = 1; cordsToTest < uniqueNumInTilesNo.length; cordsToTest++) {
                            const thisUniqueNumberCords = uniqueNumInTilesNo[0];
                            let theSameAs_tUNC = 0;
                            for(let cordNo = 0; cordNo < thisUniqueNumberCords.length; cordNo++) {
                               if(uniqueNumInTilesNo[cordsToTest][cordNo] !== undefined) {
                                    if(thisUniqueNumberCords.includes(uniqueNumInTilesNo[cordsToTest][cordNo])) {
                                        theSameAs_tUNC++;
                                    }
                                }
                            }

                            if(theSameAs_tUNC === 3) {
                                potentialSubset.push(cordsToTest);
                            }
                            else if((theSameAs_tUNC === 2) && (uniqueNumInTilesNo[cordsToTest].length === 2)) {
                                potentialSubset.push(cordsToTest);
                            }
                        }

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

                        if(uniqueSubsetDigits.length > 0) {
                            for(let foundSubset = 0; foundSubset<uniqueSubsetDigits.length; foundSubset++) {
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
                                    for(let uniqueTile = 0; uniqueTile<uniqueTiles.length; uniqueTile++) {
                                        // Now let's just update grid with what we've found there
                                        let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                        let sq_r_rest = dim_no % 3; // 0 to 2
                                        let sq_c_compressed = Math.floor(uniqueTiles[uniqueTile] / 3); // 0 to 2
                                        let sq_c_rest = uniqueTiles[uniqueTile] % 3; // 0 to 2
                            
                                        let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                        let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                        // Remove digits from grid, and point out that the function helped
                                        if((dim === 'row') && (typeof(grid[dim_no][uniqueTiles[uniqueTile]]) === 'object')) {
                                            if((grid[dim_no][uniqueTiles[uniqueTile]].length > 1) && (grid[dim_no][uniqueTiles[uniqueTile]].length !== onlyUniques_confirmed[uniqueTile].length)) {
                                                grid[dim_no][uniqueTiles[uniqueTile]] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        } else if((dim === 'column') && (typeof(grid[uniqueTiles[uniqueTile]][dim_no]) === 'object'))  {
                                            if((grid[uniqueTiles[uniqueTile]][dim_no].length > 1) && (grid[uniqueTiles[uniqueTile]][dim_no].length !== onlyUniques_confirmed[uniqueTile].length)) {
                                                grid[uniqueTiles[uniqueTile]][dim_no] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  {
                                            if((grid[sq_r][sq_c].length > 1) && (grid[sq_r][sq_c].length !== onlyUniques_confirmed[uniqueTile])) {
                                                grid[sq_r][sq_c] = onlyUniques_confirmed[uniqueTile];
                                                didHelp = true;
                                            }
                                        }
                                    }
                                }
                            }  
                        }
                    }
                }

                else {
                    for(let trippleCandidateNo = 0; trippleCandidateNo<trippleInDimArr.length; trippleCandidateNo++) {
                        // For each tile we manage to gather in trippleInDimArr (-> tripples only || quads / quints ...)
    
                        let incompleteTrippleCandidates = [];
    
                        // There we will push elems that contains the same numbers as currently checked trippleInDimArr tile
                        for(let trippleOptionsEl = 0; trippleOptionsEl<thisDimOptions.length; trippleOptionsEl++) {
                            // For each elem inside current dimension
                            let doesContainsOnlyTheSameNumbers = checkContaisnOnlyTheSameNumbers(trippleInDimArr[trippleCandidateNo], thisDimOptions[trippleOptionsEl]);
                            if(doesContainsOnlyTheSameNumbers) {
                                incompleteTrippleCandidates.push(thisDimOptions[trippleOptionsEl]);
                            }
                        }
    
                        // Now we have a candidates (of length 2 or 3 to test with current tripple)
                        if(incompleteTrippleCandidates.length === 3) {
                            // Our function helps (probably) !
    
                            for(let dimension_tile = 0; dimension_tile<9; dimension_tile++) {
                                // For every tile in current dimension
                                const detectedTileOptions_copy = [...thisDimOptions[dimension_tile]];
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
    
                                    // Now let's just update grid with what we've found there
                                    let sq_r_compressed = Math.floor(dim_no / 3); // 0 to 2
                                    let sq_r_rest = dim_no % 3; // 0 to 2
                                    let sq_c_compressed = Math.floor(dimension_tile / 3); // 0 to 2
                                    let sq_c_rest = dimension_tile % 3; // 0 to 2
                        
                                    let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                    let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                    // Remove digits from grid, and point out that the function helped
                                    if((dim === 'row') && (typeof(grid[dim_no][dimension_tile]) === 'object')) {
                                        if(grid[dim_no][dimension_tile].length > 1) {
                                            grid[dim_no][dimension_tile] = detectedTileOptions_copy;
                                            didHelp = true;
                                        }
                                    } else if((dim === 'column') && (typeof(grid[dimension_tile][dim_no]) === 'object'))  {
                                        if(grid[dimension_tile][dim_no].length > 1) {
                                            grid[dimension_tile][dim_no] = detectedTileOptions_copy;
                                            didHelp = true;
                                        }
                                    } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                        if(grid[sq_r][sq_c].length > 1) {
                                            grid[sq_r][sq_c] = detectedTileOptions_copy;
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
                        // If we have 3 digits, which happens only 3 times in a given line / box - now we look for two remain elems, which happens three times in a given line / box

                        // First of all, specify the array, which will push whole tiles, that are potential subsets
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
                            // We have ready hidden subset !
                            hiddenSubsetDigits.push([]);
                            hiddenSubsetDigits[hiddenSubsetDigits.length - 1].push(...uniquesContained);
                            //  Now remove indexes of found elements from ourArray COPY
                            //  Use reversed loop to splice elements correctly
                            for(let index = (potentialSubsetElems_indexes.length - 1); index >= 0; index--) {
                                ourArr_copy.splice(potentialSubsetElems_indexes[index], 1);
                            }
                        }

                    }
                }
                return hiddenSubsetDigits;
            }

            function checkIfUnique(ourArr, el, uOAN, subset_size) {
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
                let didHelp = false;
                // Remove subset digits that don't belong to any subset-part tiles, but are available in non-subset tiles
                for(let dig = 0; dig<subset.length; dig++) {
                    // for every digit in subset
                    for(let tile_in_dimension=0; tile_in_dimension<9; tile_in_dimension++) {
                        if(thisdimension[tile_in_dimension].includes(subset[dig])) { // If we own that digit as an option in tile aswell
                            const isNotANakedSubset = checkNotANakedSubset(thisdimension[tile_in_dimension], subset);
                            if(isNotANakedSubset) {  // Now check if iterated tile does not belong to detected subset !
                                let sq_r_compressed = Math.floor(row / 3); // 0 to 2
                                let sq_r_rest = row % 3; // 0 to 2
                                let sq_c_compressed = Math.floor(tile_in_dimension / 3); // 0 to 2
                                let sq_c_rest = tile_in_dimension % 3; // 0 to 2
                    
                                let sq_r = (sq_r_compressed * 3) + sq_c_compressed;
                                let sq_c = (sq_r_rest * 3) + sq_c_rest;
                                // Remove numbers from grid, and point out that the function helped
                                if((dim === 'row') && (typeof(grid[row][tile_in_dimension]) === 'object')) {
                                    if(grid[row][tile_in_dimension].length > 1) {
                                        let index = grid[row][tile_in_dimension].indexOf(subset[dig]);
                                        grid[row][tile_in_dimension].splice(index, 1);
                                        didHelp = true;
                                    }
                                } else if((dim === 'column') && (typeof(grid[tile_in_dimension][row]) === 'object'))  {
                                    if(grid[tile_in_dimension][row].length > 1) {
                                        let index = grid[tile_in_dimension][row].indexOf(subset[dig]);
                                        grid[tile_in_dimension][row].splice(index, 1);
                                        didHelp = true;
                                    }
                                } else if((dim === 'square') && (typeof(grid[sq_r][sq_c]) === 'object'))  { // dim === 'square
                                    if(grid[sq_r][sq_c].length > 1) {
                                        let index = grid[sq_r][sq_c].indexOf(subset[dig]);
                                        grid[sq_r][sq_c].splice(index, 1);
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
                            if(parseInt(testTile[i]) !== parseInt(subset[i])) { return true;}
                        }
                        return false; // given elems have the same digits as a options, so these are definitely subset items
                    }
                }
                return didHelp;
            }

            return didHelp;
        }

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

                
                // Digit from noDetect might happen only for one square

                let digitInSquareNo = [];
                for(let square_no=0; square_no<3; square_no++) {
                    for(let tile_in_square_line=0; tile_in_square_line<3; tile_in_square_line++) {
                        let noDetect_checkedTile = dimension === 'row'? grid[noDetect][(square_no * 3) + tile_in_square_line] : grid[(square_no * 3) + tile_in_square_line][noDetect];
                        if(typeof(noDetect_checkedTile) === 'object') {
                            if(noDetect_checkedTile.includes(digit)) {
                                digitInSquareNo.push(square_no);
                                if(digitInSquareNo.length > 1) {
                                    if(digitInSquareNo[0] !== digitInSquareNo[digitInSquareNo.length - 1]) {
                                        return false; //return to the start of the loop
                                    }
                                }
                            }
                        }
                    }
                }
                if(digitInSquareNo.length < 1) { return false;} //return to the start of the loop

                // From now we now, that noDetect meet its' own requirements -  we have to check if pointer1 and pointer2 are meeting their own conditions

                // Now check, if in square in which our noDetect has a number, or in remain lines (that are in the same square) there is that number.
                // If there's no such number, that means the function would not help, so we can go back to the start of the loop
                // If there's desired number, we can move on:

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

                if(!isTargetSqaureContainingDigit) { return false; } //return to the start of the loop

                // At the very end we need to check, if that number happens in other squares inside the same lines, onto which pointer1 and pointer2 are pointing onto.
                // They has to appear at least twice for pointers - one in first, and other one in second square, in which noDetect doesn't have a number.
                // If not, it means the function would not help us, so we can move back to the start of the loop 
                // If yes, let's move on:

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

                if(!isFinalConditionMet) { return false; } //return to the start of the loop


                // ... from square, where noDetect has numbers, from lines, where the pointers points out in this square, we remove all occurences of
                // this number. We indicate, that the function helped. DON'T REMOVE ANY NUMBER FROM ROW, WHERE noDetect points out.
            
                for(let targetSquareTile = 0; targetSquareTile < 3; targetSquareTile++) {
                    let pointer1_checkedTile = dimension === 'row'? grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1];
                    let pointer2_checkedTile = dimension === 'row'? grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile] : grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2];

                    if(typeof(pointer1_checkedTile) === 'object') {
                        if(pointer1_checkedTile.includes(digit)) {
                            if(dimension === 'row') {
                                let index = grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile].indexOf(digit);
                                grid[pointer1][(digitInSquareNo[0] * 3) + targetSquareTile].splice(index, 1);
                            } else {
                                let index = grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1].indexOf(digit);
                                grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer1].splice(index, 1);
                            }
                            didHelp = true;
                        }
                    }
                    if(typeof(pointer2_checkedTile) === 'object') {
                        if(pointer2_checkedTile.includes(digit)) {
                           if(dimension === 'row') {
                                let index = grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile].indexOf(digit);
                                grid[pointer2][(digitInSquareNo[0] * 3) + targetSquareTile].splice(index, 1);
                           } else {
                                let index = grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2].indexOf(digit);
                                grid[(digitInSquareNo[0] * 3) + targetSquareTile][pointer2].splice(index, 1);
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
                if(num === parseInt(ordered[row * 9 + k].textContent) /* ☢️  */) return false; // CHECK ROW || if False = We have this number in a row already
                if(num === parseInt(ordered[k * 9 + index_in_row].textContent) /* ☢️  */) return false; // CHECK COLUMN || if False =  We have this number in a column already
            }
    
            // Check square at last
    
            for(let square_row=0; square_row<3; square_row++) {
                for(let square_column=0; square_column<3; square_column++) {
                    if(num === parseInt(ordered[(((Math.floor(row / 3) * 3) + square_row) * 9) + (Math.floor(index_in_row / 3) * 3) + square_column].textContent) // ☢️
                    ) return false; // CHECK SQUARE || if False = We have this number in a square already
                }
            }

            return true;
        }

        function occuredOnce(arr, length, sign) {
            
            let onlyOnce = [];

            arr.sort(function(a, b) { return a - b; });

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
                    ordered[(dim_1 * 9) + dim_2].textContent = singPos[x];  // ☢️
                    grid[dim_1][dim_2] = singPos[x];
                    return true;
                }
            }
            return false;
        }

        return bestMethod;
    },

    backtrack: function (currGridState) {

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

            if(!isUnassigned) { return grid; }

            const checkSafety = engine.testSafety.bind();

            for(let i=start_num; (start_num < end_num) ? i<=end_num : i>=end_num; (start_num < end_num) ? i++ : i--) {
                const isSafe = checkSafety(grid, pos, i);
                
                if(isSafe) {
                    grid[pos.row][pos.index_in_row] = i;

                    if(initBackTrack(grid, start_num, end_num)) { return grid; }

                    grid[pos.row][pos.index_in_row] = 0;
                }
            }

            return false;
        }

        const opt_1To9 =  initBackTrack(grid, 1, 9);
        const opt_9To1 =  initBackTrack(grid2, 9, 1);
        
        const isSudokuUnique = this.checkOneSolution(opt_1To9, opt_9To1);

        return isSudokuUnique;
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

    switchAvailableDigits: function(availableDigits_history, current_step, step) {
        // 1. History - available digit adjusting
        let availableDigits_current = {...availableDigits_history[current_step]}; // it's a copy of available Digits, so we have to make it reference in order to work properly !
        if(current_step === step) {
            availableDigits_current = {...availableDigits_history[availableDigits_history.length - 1]}
        }
        const numbersBox = document.querySelector('.numbers-box');
        const allNumersBoxOptions = numbersBox.querySelectorAll('.option');
        for(let key in availableDigits_current) {
            if(availableDigits_current[key]) {
                allNumersBoxOptions[parseInt(key - 1)].classList.remove('option-blank');
                allNumersBoxOptions[parseInt(key - 1)].style.pointerEvents = 'auto';
            } else if(availableDigits_current[key] === 0) {
                allNumersBoxOptions[parseInt(key - 1)].classList.add('option-blank');
                allNumersBoxOptions[parseInt(key - 1)].style.pointerEvents = 'none';
            }
        }

        return availableDigits_current;
    },

    cleanBlankNumberBoxes: function() {
        const numbersBox = document.querySelector('.numbers-box');
        const allNumersBoxOptions = numbersBox.querySelectorAll('.option');
        allNumersBoxOptions.forEach(el => {
            el.classList.remove('option-blank');
            el.style.pointerEvents = 'auto';
        })
    },

    // This one is a Toolbox specific function, which repaints the board whenever player 'travels in time'
    travelInTime: function(current_step, game_history, activeTiles_history, setActive, finalDifficulty, props) {    

        // 2. History - board repainting
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        for(let tile = 0; tile<ordered.length; tile++) {
            let row = Math.floor(tile / 9); 
            let column = tile%9;

            // During "time travelling" change the position of "active" class pointer
             if(ordered[(row * 9) + column].classList.contains('active')) {   
                ordered[(row * 9) + column].classList.remove('active');
            } 

            if((ordered[(row * 9) + column].classList.contains('pencilmark_tile')) && (typeof(game_history[current_step][row][column]) === 'object')) {
            
                let orderedPencilmarks = [];
                for(let y=0; y<ordered[(row * 9) + column].childNodes.length; y++) {
                    if(parseInt(ordered[(row * 9) + column].childNodes[y].textContent)) {  // ☢️
                        orderedPencilmarks.push(parseInt(ordered[(row * 9) + column].childNodes[y].textContent));  // ☢️
                    }
                }

                if(orderedPencilmarks.length !== game_history[current_step][row][column].length) {
                    let pencilmarkToModify;
                    let longerArray = (orderedPencilmarks.length > game_history[current_step][row][column].length) ? orderedPencilmarks : game_history[current_step][row][column];
                    let shorterArray = (orderedPencilmarks.length > game_history[current_step][row][column].length) ? game_history[current_step][row][column] : orderedPencilmarks;
                    // In this tile pencilmarks has received an update. Identify the change in the tile
                    longerArray.some((val, ind) => {
                        if(!shorterArray.includes(val)) {
                            pencilmarkToModify = val;
                            return val;
                        }
                    })

                    let pencilmark_tile = ordered[(row * 9) + column].querySelector(`.no-${pencilmarkToModify}`);
                    (parseInt(pencilmark_tile.textContent)) ? pencilmark_tile.textContent = '' : pencilmark_tile.textContent = pencilmarkToModify;  // ☢️ ☢️ ☢️
                }
            }

            // When player change tile role from "pencilmark" to "single digit" and vice versa
            else if(ordered[(row * 9) + column].classList.contains('pencilmark_tile') || typeof(game_history[current_step][row][column]) === 'object') {

                if(ordered[(row * 9) + column].classList.contains('pencilmark_tile')) {
                    // "Pencilmark tile" -> "Single digit tile"
                    ordered[(row * 9) + column].classList.remove('pencilmark_tile');
                    while(ordered[(row * 9) + column].childNodes.length) {
                        ordered[(row * 9) + column].childNodes[ordered[(row * 9) + column].childNodes.length - 1].remove();
                    }
                    // At last append before existent number to the tile
                    ordered[(row * 9) + column].textContent = game_history[current_step][row][column];  // ☢️
                }

                else if(typeof(game_history[current_step][row][column]) === 'object') {
                    // "Single digit tile -> Pencilmark tile"
                    ordered[(row * 9) + column].textContent = '';   // ☢️
                    ordered[(row * 9) + column].classList.add('pencilmark_tile');
                    // Append divs to pencilmark tile
                    for(let x=1; x<=9; x++) {
                        let el = document.createElement('div');
                        if(game_history[current_step][row][column] === null) {game_history[current_step][row][column] = ''}
                        if(game_history[current_step][row][column].includes(x)) {
                            let ind = game_history[current_step][row][column].indexOf(x);
                            el.textContent = game_history[current_step][row][column][ind];  // ☢️
                        }
                        el.classList.add('xd', `no-${x}`);
                        ordered[(row * 9) + column].appendChild(el);
                    }
                }
            }

            // This statements will not work for pencilmarks !
            else if(ordered[(row * 9) + column].textContent !== game_history[current_step][row][column]) {  // ☢️
                ordered[(row * 9) + column].textContent = game_history[current_step][row][column];   // ☢️
            }

            if(!game_history[current_step][row][column]) {
                // If we used rubber, this might happen. Instead of appending 'NaN', let's append ''
                ordered[(row * 9) + column].textContent = ''; // ☢️
                
            }
        }

        // At the very end update active class
        if(ordered[activeTiles_history[current_step] - 1]) {
            ordered[activeTiles_history[current_step] - 1].classList.add('active'); // For undo & redo 
            setActive(ordered[activeTiles_history[current_step] - 1])
            // And apply proper highlighting
            if(props.options['backlit']) {
                this.resetHighlightEffect(props);
                this.applyHighlightEffect(ordered[activeTiles_history[current_step] - 1], finalDifficulty, props);
            }
        } else {
            // When we move forward to the very recent move  (prevents from errors !)
            ordered[activeTiles_history[current_step - 1] - 1].classList.add('active');
            setActive(ordered[activeTiles_history[current_step - 1] - 1])
            // And apply proper highlighting
            if(props.options['backlit']) {
                this.resetHighlightEffect(props);
                this.applyHighlightEffect(ordered[activeTiles_history[current_step - 1] - 1], finalDifficulty, props);
            }
        }
    },

    resetSudoku: function(final_difficulty) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        ordered.forEach(el => {
            el.textContent = '';  // ☢️
            el.style.color = '';
            el.classList.remove(`active`, `initial`, `initial-night`, `initial-day`, `pencilmark_tile`);
        })
    },

    resetHighlightEffect: function(theme) {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);
        if(theme === 'night') {
            for(let tile_no = 0; tile_no<ordered.length; tile_no++) {
                ordered[tile_no].style.backgroundColor = `#000`;
            }
        } else if(theme === 'day') {
            for(let tile_no = 0; tile_no<ordered.length; tile_no++) {
                ordered[tile_no].style.backgroundColor = `#eee`;
            }
        }
    },

    applyHighlightEffect: function(e_target, finalDifficulty, theme) {
        const activeTile_row = parseInt(Math.floor(e_target.dataset.order - 1) / 9);
        const activeTile_col = parseInt((e_target.dataset.order - 1) % 9);

        const activeTileSquare_row = Math.floor(activeTile_row / 3) * 3;
        const activeTileSquare_col = Math.floor(activeTile_col / 3) * 3;

        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray);

        this.applyHighlightForRowAndCol(ordered, activeTile_row, activeTile_col, finalDifficulty, theme);
        this.applyHighlightForSquare(ordered, activeTileSquare_row, activeTileSquare_col, finalDifficulty, theme);
    },

    applyHighlightForRowAndCol: function(ordered, this_row, this_col, finalDifficulty, theme) {
        for(let iir=0; iir<9; iir++) {
            ordered[(this_row * 9) + iir].style.backgroundColor = this.colors['highlight'][theme][finalDifficulty];  // For row
            ordered[(iir * 9) + this_col].style.backgroundColor = this.colors['highlight'][theme][finalDifficulty];  // For col
        }
    },

    applyHighlightForSquare: function(ordered, this_square_row, this_square_col, finalDifficulty, theme) {
        for(let sq_row=0; sq_row<3; sq_row++) {
            for(let sq_col=0; sq_col<3; sq_col++) {
                ordered[((this_square_row + sq_row) * 9) + (this_square_col + sq_col)].style.backgroundColor = this.colors['highlight'][theme][finalDifficulty]; // For square
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
            if(typeof(currentHistory_copy_history[activeTile_Row][iir]) === 'object' && currentHistory_copy_history[activeTile_Row][iir] !== null) {
                if(currentHistory_copy_history[activeTile_Row][iir].length) {
                    if(currentHistory_copy_history[activeTile_Row][iir].includes(parsed_pressed_digit)) {
                        let ind = currentHistory_copy_history[activeTile_Row][iir].indexOf(parsed_pressed_digit);
                        currentHistory_copy_history[activeTile_Row][iir].splice(ind, 1);
                        ordered[(activeTile_Row * 9) + iir].childNodes[parsed_pressed_digit - 1].textContent = '';
                    }
                }
            }
            // Col
            if(typeof(currentHistory_copy_history[iir][activeTile_Col]) === 'object' && currentHistory_copy_history[iir][activeTile_Col] !== null) {
                if(currentHistory_copy_history[iir][activeTile_Col].length) {
                    if(currentHistory_copy_history[iir][activeTile_Col].includes(parsed_pressed_digit)) {
                        let ind = currentHistory_copy_history[iir][activeTile_Col].indexOf(parsed_pressed_digit);
                        currentHistory_copy_history[iir][activeTile_Col].splice(ind, 1);
                        ordered[(iir * 9) + activeTile_Col].childNodes[parsed_pressed_digit - 1].textContent = '';
                    }
                }
            }
        }

        // For squares 
        for(let sq_row=0; sq_row<3; sq_row++) {
            for(let sq_col=0; sq_col<3; sq_col++) {
                if(typeof(currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col]) === 'object' && currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col] !== null) {
                    if(currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].length) {
                        if(currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].includes(parsed_pressed_digit)) {
                            let ind = currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].indexOf(parsed_pressed_digit);
                            currentHistory_copy_history[activeTileSquare_Row + sq_row][activeTileSquare_Col + sq_col].splice(ind, 1);
                            ordered[((activeTileSquare_Row + sq_row) * 9) + (activeTileSquare_Col + sq_col)].childNodes[parsed_pressed_digit - 1].textContent = '';
                        }
                    }
                }
            }
        }

    },

}

export { engine, success_board };