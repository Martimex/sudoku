import  Sudoku from '../components/Sudoku.js';
import Square from '../components/Square.js';
import Tile from '../components/Tile.js';

const rules = {
    easy:  {
        initialNumbers: {
            min: 30,
            max: 32,
        }, 
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
            min: 21,
            max: 23,
        },
        conditions: {
            square_min_fill: 0, // The least amount of initial digits that a square can have
            max_squares_min_filled: 3, // How much squares can be minimally filled ?
            //
            digit_shown_min: 1, // The least amount each digit can be shown on the board
            max_digits_min_shown: 4, // How much digits with least amount can be ?

        },
    },
}

const engine = {

    version: '1.0.0',
    squareRows: 3,
    squareColumns: 3,
    rows: 9,
    columns: 9,

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
                numbers_array.splice(index, 1);
            }
        }
    },

    checkColumnCompatibility: function(numbers_array, thisEl, ordered) {  // Works perfectly
        const columnNo = ((thisEl.dataset.order - 1) % this.columns) + 1;
        for(let c=columnNo; c<=parseInt(thisEl.dataset.order); c = c + this.columns) {
            if(numbers_array.includes(parseInt(ordered[c-1].textContent))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(ordered[c-1].textContent));
                numbers_array.splice(index, 1);
            }
        }
    },

    checkSquareCompatibility: function(numbers_array, thisEl, ordered, elIndex) {  // Works fine
        const squareRows = 3; const squareColumns = 3;
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArr = [...allTiles];
        const squaredBaseIndex = allTilesArr.indexOf(thisEl);
        const  start = (Math.floor(squaredBaseIndex / (squareRows * squareColumns)));
        for(let i=0; i<(squareRows * squareColumns); i++) {
            //allTiles[((start * (squareRows * squareColumns)) + i)].style.background = "tomato";
            if(numbers_array.includes(parseInt(allTiles[((start * (squareRows * squareColumns)) + i)].textContent))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(allTiles[((start * (squareRows * squareColumns)) + i)].textContent));
                numbers_array.splice(index, 1);
            }
        }
    },

    applyRow: function(currRow, ordered, possibilitiesObj) {
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
            let index = (currRow * 9) + (parseInt(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile] - 1));

            usedTiles.push(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile]);
            usedDigits.push(dangerZoneDigits[rand_digit]);

            if(!ordered[index]) { return false; }

            ordered[index].textContent = dangerZoneDigits[rand_digit];

            for(let key in possibilitiesObj) {
                if(possibilitiesObj[key].includes(parseInt(usedTiles[usedTiles.length - 1]))) {
                    let inde = possibilitiesObj[key].indexOf(parseInt(usedTiles[usedTiles.length - 1]));
                    possibilitiesObj[key].splice(inde, 1);
                }
            }
            // 1
            delete possibilitiesObj[parseInt(usedDigits[usedDigits.length - 1])];
        }

        return true;
    },

    setBoard: function() {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
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
                let index = ((currRow * 9) + currTile_inRow);
                this.checkColumnCompatibility(allDigits, ordered[index], ordered);
                this.checkSquareCompatibility(allDigits, ordered[index], ordered, index);
                for(let digit of allDigits) {
                    possibilitiesObj[digit].push(currTile_inRow + 1);
                }
            }

            const isSuccess = this.applyRow(currRow, ordered, possibilitiesObj);

            if(!isSuccess) {
                for(let i=((currRow - 1) * this.columns); i<=(currRow * this.columns) + 9; i++) {
                    ordered[i].textContent = '';
                }
                currRow = currRow - 2;
            }

        }
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
        console.log(difficulty, theme, options);
        console.log(rules[difficulty]);

        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];

        const ordered = this.orderTiles(allTilesArray);

        const randInitial = Math.floor(Math.random() * ((rules[difficulty].initialNumbers.max - rules[difficulty].initialNumbers.min) + 1)) + rules[difficulty].initialNumbers.min;

        console.log(ordered);

        // Remove counterparts
            // 1. First randomize, whether the middle tile in middle square should be hidden or not
            const randHide = Math.floor(Math.random() * 2);
            const initialCounterPartsRemove = 18;
            console.log(randHide);
            if(randHide) {ordered[Math.floor(ordered.length / 2)].textContent = ''; } //  + invoke score checking function
            ordered.splice(Math.floor(ordered.length / 2), 1);

            for(let c=0; c<initialCounterPartsRemove; c++) {
                let rand = Math.floor(Math.random() * (ordered.length / 2));
                let counterPart = ordered.length - (rand + 1);

                let partDigit = ordered[rand].textContent;
                let counterPartDigit = ordered[counterPart].textContent;

                ordered[rand].textContent = '';
                ordered[counterPart].textContent = '';

                let isStillUnique = this.backtrack();
                console.log('UNIQUE SUDOKU ?', isStillUnique);
                if(isStillUnique) {
                    // Order here is important !
                    ordered.splice(counterPart, 1);
                    ordered.splice(rand, 1);
                } else {
                    c = c - 1;
                    ordered[rand].textContent = partDigit;
                    ordered[counterPart].textContent = counterPartDigit;
                }  



            }

            //. To this point Sudoku can be 100% solved with only Single Candidate and Single Position (36 - 37 digits already removed)
        


        let substr = 2;
        let multiRemove_start = 81 - ((initialCounterPartsRemove * 2) + randHide);
        console.log(multiRemove_start, randHide);
        let multiRemove_stop = 34;
        let i;
        console.log(multiRemove_stop);

        for(i=multiRemove_start; i>multiRemove_stop - randHide; i = i - substr) {

            let temp = [];

            for(let x=0; x<substr; x++) {
                let rand = Math.floor(Math.random() * ordered.length);
                temp.push([]);
                temp[temp.length - 1].push(ordered[rand], ordered[rand].textContent);
                ordered[rand].textContent = '';
                ordered.splice(rand, 1);
            }

            let isStillUnique = this.backtrack();
            console.log('HAS SUDOKU JUST ONE SOLUTION ?', isStillUnique);

            if(!isStillUnique) {
                for(let x=0; x<temp.length; x++) {
                    temp[x][0].textContent = temp[x][1];
                    ordered.push(temp[x][0]);
                }
                i = i + substr;
            }
        } 

        let j = {j: 0 + randHide};
        ordered.forEach(el => {
            return j.j++;
        })

        console.log('our iterator is: ', i, '  tiles uncover count is: ', j.j);

        this.singleRemoval(ordered, randInitial, i, randHide); 

        allTilesArray.forEach(tile => {
            if(tile.textContent) { tile.classList.add(`initial`, `initial-${theme}`); }
        })

        let isUnique = this.backtrack();
        console.warn('isSudokuUnique? ', isUnique);

    },

    singleRemoval: function(ordered, randInitial, singleRemove_start, randHide) {
        
        let orderedCopy = [...ordered];
        let elAndDigit = [];

        for(let x=singleRemove_start; x>randInitial + randHide; x--) {
           
            let rand = Math.floor(Math.random() * orderedCopy.length);
            elAndDigit.push([orderedCopy[rand], orderedCopy[rand].textContent]);

            orderedCopy[rand].textContent = '';

            let isStillUnique = this.backtrack();

            if(isStillUnique) { // it's unique Sudoku
                ordered.splice(rand, 1);
                orderedCopy = [...ordered];
            } else { // not unique
                elAndDigit[elAndDigit.length -1][0].textContent = elAndDigit[elAndDigit.length -1][1];
                orderedCopy.splice(rand, 1);
                x = x + 1;
                console.log(orderedCopy.length);
                if(orderedCopy.length <= (ordered.length / 2)) { // WE WANT TO SAVE TIME FOR RENDERING, THATS WHY IT LOOKS LIKE THAT
                    //console.log(`CANNOT REMOVE MORE - ${x} from ${randInitial + randHide} remain`);
                    return;
                }
            }

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
        const methodsArr = [singleCandidate, singlePosition, candidateLines];

        /* const dimensionObject = {
            row: [

            ],

            column: [

            ],

            square: [

            ],
        } */

        const grid = [];

        ordered.map((el, index) => { 
            if(index % 9 === 0 ) {
                grid.push([]);
            }
            el.textContent ? grid[grid.length -1].push(el.textContent) : grid[grid.length -1].push([]);
        })

        
        console.log(grid);
        fillGrid(grid);
        //fillDimensionObject(dimensionObject, grid);

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
                            console.warn(`Row checker has detected that number ${num} will not be in grid[${gridRow}][${iir}]`);
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
                            console.warn(`Column checker has detected that number ${num} will not be in grid[${iic}][${gridCol}]`);
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
            console.log(grid);
            for(let r=0; r<9; r++) {
                for(let iir=0; iir<9; iir++) {
                    if((grid[r][iir].length <= 1) && (typeof(grid[r][iir]) !== 'string')) { 
                        ordered[(r * 9) + iir].style.color = 'tomato';
                        ordered[(r * 9) + iir].textContent = grid[r][iir][0];
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
                        console.log('we are checking num-', num);
                        const isBelonging = checkBelonging(num, grid, allSquares, squareNo);
                        if(isBelonging) {
                            helpedSolving = true;
                        }
                    }
                }
            }
            return helpedSolving;
        }


        // while kończy się, kiedy nasza ostatnia najtrudniejsza metoda zwróci false - wtedy już nie można bardziej rozwiązać sudoku zaimplementowanymi obecnie metodami
        let currMethodNo = 0;
        while(currMethodNo < methodsArr.length) {
            let doesItHelp = methodsArr[currMethodNo]();
            if(doesItHelp) {
                if(currMethodNo === 2) {console.warn('Our new function has helped !')}
                console.log('back to method first'); 
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
        
        //console.log(dimensionObject);

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
                if(num === parseInt(ordered[row * 9 + k].textContent) /* && (grid[row][k].length <= 1) */) return false; // CHECK ROW || if False = We have this number in a row already
                if(num === parseInt(ordered[k * 9 + index_in_row].textContent) /* && (grid[k][index_in_row].length <= 1) */) return false; // CHECK COLUMN || if False =  We have this number in a column already
            }
    
            // Check square at last
    
            for(let square_row=0; square_row<3; square_row++) {
                for(let square_column=0; square_column<3; square_column++) {
                    if(num === parseInt(ordered[(((Math.floor(row / 3) * 3) + square_row) * 9) + (Math.floor(index_in_row / 3) * 3) + square_column].textContent)
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
                    if(dim === 'r') {ordered[(dim_1 * 9) + dim_2].style.color = 'aqua'};
                    if(dim === 'c') {ordered[(dim_1 * 9) + dim_2].style.color = 'green'};
                    if(dim === 's') {ordered[(dim_1 * 9) + dim_2].style.color = 'burlywood'};
                    ordered[(dim_1 * 9) + dim_2].textContent = singPos[x];
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
                    b[b.length - 1].push(el.textContent)
                } else {
                    b[b.length - 1].push(parseInt(el.textContent))
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
            if(tile.textContent) { tile.classList.add(`initial`, `initial-${theme}`); }
        })

        //console.log(currentBoard);
    },

    performEngineOperations: function(eov, currentBoard, randInitial, difficulty) {
        for(let i=(this.rows*this.columns); i>randInitial; i--) {
            /* Perform engine operations */
            if(!currentBoard.length) {console.warn('exhausted elems'); return;}

            let randSquare = Math.floor(Math.random() * currentBoard.length);
            let randTile_inSquare = Math.floor(Math.random() * currentBoard[randSquare].length);

            eov.all_digits_shown[(parseInt(currentBoard[randSquare][randTile_inSquare].textContent) - 1)]--;

            const number_to_keep = parseInt(currentBoard[randSquare][randTile_inSquare].textContent);
            currentBoard[randSquare][randTile_inSquare].textContent = '';
            currentBoard[randSquare].splice(randTile_inSquare, 1);

            if((eov.all_digits_shown[number_to_keep - 1]  - eov.substr) <= rules[difficulty].conditions.digit_shown_min) {
                //console.log('violated ', number_to_keep.toString())
                // Now remove all currentboard items, that has the same number attached, apart from the one we got now
                for(let arr of currentBoard) {
                    arr.forEach((elem, index) => {
                        if((arr[index].textContent === number_to_keep.toString()) /* && (arr[index] !== currentBoard[randSquare][randTile_inSquare]) */) {
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
                                    if(parseInt(arr[index].textContent) === (x + 1)) {
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

    backtrack: function () {
        //console.log('tracking....');
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
        //
        const grid = [];
        const grid2 = [];

        ordered.map((el, index) => { 
            if(index % 9 === 0 ) {
                grid.push([]);
                grid2.push([]);
            }
            el.textContent ? grid[grid.length -1].push(el.textContent) : grid[grid.length -1].push(0);
            el.textContent ? grid2[grid2.length -1].push(el.textContent) : grid2[grid2.length -1].push(0);
        })

       //console.log(grid);

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

    interact: function() {
        console.log('clicked');
    },
 
}

export default engine;