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

    fadeDigits: function({difficulty, theme, options}) {
        console.log(difficulty, theme, options);
        console.log(rules[difficulty]);

        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        // const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property

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

    interact: function() {
        console.log('clicked');
    },
 
}

export default engine;