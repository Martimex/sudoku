import  Sudoku from '../components/Sudoku.js';
import Square from '../components/Square.js';
import Tile from '../components/Tile.js';

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

    checkColumnCompatibility: function(numbers_array, thisEl, ordered) {
        const columnNo = ((thisEl.dataset.order - 1) % this.columns) + 1;
        console.log(columnNo);
        for(let c=columnNo; c<parseInt(thisEl.dataset.order); c=this.columns) {  // Check one column
            let usedNumber = ordered[c].innerText; // here we store a number
            for(let q=0; q<numbers_array.length; q++) {
                if(parseInt(usedNumber) === numbers_array[q]) {
                    numbers_array.splice(q, 1);
                    q = q - 1;
                }
            } 
        }
        //console.log(columnNo);
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

    checkColumnCompatibility1: function(numbers_array, thisEl, ordered) {  // Works perfectly
        const columnNo = ((thisEl.dataset.order - 1) % this.columns) + 1;
        for(let c=columnNo; c<=parseInt(thisEl.dataset.order); c = c + this.columns) {
            if(numbers_array.includes(parseInt(ordered[c-1].textContent))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(ordered[c-1].textContent));
                numbers_array.splice(index, 1);
            }
        }
    },

    checkSquareCompatibility: function(numbers_array, thisEl, ordered, elIndex) {  // Bugged
        //console.log(numbers_array);  
        const squareRows = 3; const squareColumns = 3;
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArr = [...allTiles];
        const squaredBaseIndex = allTilesArr.indexOf(thisEl);
        const  start = (Math.floor(squaredBaseIndex / (squareRows * squareColumns)));
        for(let i=0; i<(squareRows * squareColumns); i++) {
            allTiles[((start * (squareRows * squareColumns)) + i)].style.background = "tomato";
            if(numbers_array.includes(parseInt(allTiles[((start * (squareRows * squareColumns)) + i)].textContent))) {
                // Usuń wartość z tablicy
                const index = numbers_array.indexOf(parseInt(allTiles[((start * (squareRows * squareColumns)) + i)].textContent));
                numbers_array.splice(index, 1);
            }
        }
    },

    checkColumnCompatibility2: function(data_order, allDigits) {
        let numsToRemove = [];
        const rest = (parseInt(data_order % 9)); // 0 to 8
        for(let k = rest + 1; k<(parseInt(data_order)); k+=9) {
            let tile = document.querySelector(`[data-order='${k}']`);
            numsToRemove.push(parseInt(tile.textContent)); // number on tile
        }
        for(let g=0; g<numsToRemove.length; g++) {
            if(allDigits.includes(numsToRemove[g])) {
                let index = allDigits.indexOf(numsToRemove[g]);
                allDigits.splice(index, 1);
            }
        }
    },

    checkSquareCompatibility2: function(currRow, currTile_inRow, allDigits) {
        let numsToRemove = [];
        let allTiles = document.querySelectorAll('.tile');
        let currPos = (currRow * 9) + currTile_inRow; // with 0 index, just like for arrays
        let squareNo = Math.floor(currPos / 9); // 0 to 8 - which square number on board
        for(let f=(squareNo * 9); f<currPos; f++) {
            numsToRemove.push(parseInt(allTiles[f].textContent)); // number on tile
        }
        for(let g=0; g<numsToRemove.length; g++) {
            if(allDigits.includes(numsToRemove[g])) {
                let index = allDigits.indexOf(numsToRemove[g]);
                allDigits.splice(index, 1);
            }
        }

    },

    checkDangerZone: function(possibilitiesObj) {
        let lowestArrLength = 10;
        let keysWithLowestArrLength = 0;
        let dangerZoneDigits = [];

        // What's the lowest array length ?
        for(let key in possibilitiesObj) {
           if(possibilitiesObj[key].length < lowestArrLength) {
               lowestArrLength = possibilitiesObj[key].length;
           }
        }

        // How many keys have the lowest array length ?
        for(let key in possibilitiesObj) {
            if(possibilitiesObj[key].length === lowestArrLength) {
                dangerZoneDigits.push(key);
                keysWithLowestArrLength++;
            }
         }

        // Condition
        if(keysWithLowestArrLength === lowestArrLength) {
            // It's Danger Zone !
            return dangerZoneDigits;
        } else {return false;}

        //console.log(lowestArrLength, keysWithLowestArrLength);
    },

    setBoard: function() {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
        //console.log(this.con(ordered));
        console.log(ordered);
        for(let currRow=0; currRow<1; currRow++) {  // current row // switch 3 to this.rows;
            //console.log(this.squareColumns); 
            let possibilitiesObj = {  // key means digit to use; arr of values refers to which row tile no. that digit could be assigned
                1: [], // 1, 2, 3, 4, 5, 6, 7, 8, 9
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
                let index = ((currRow * 9) + currTile_inRow); // this.rows;
                let data_order = index + 1;
                //this.checkColumnCompatibility1(allDigits, ordered[index], ordered);
                //this.checkSquareCompatibility(allDigits, ordered[index], ordered, index); // ? not sure if that works correctly
                this.checkColumnCompatibility2(data_order, allDigits);
                this.checkSquareCompatibility2(currRow, currTile_inRow, allDigits);
                //console.log(allDigits);
                for(let digit of allDigits) {
                    possibilitiesObj[digit].push(currTile_inRow + 1);
                }
            }

            //console.log(Object.values(possibilitiesObj));
            let usedDigits = [];

            for(let currColumn= 0; currColumn<this.columns; currColumn++) { // current tile no. in current row
                
                console.log(Object.values(possibilitiesObj));
                
                let lowestArrLength = 10;
                let dangerZoneDigits = [];
        
                // What's the lowest array length ?
                for(let key in possibilitiesObj) {
                   if((possibilitiesObj[key].length < lowestArrLength) && (!(usedDigits.includes(key)))) {
                       lowestArrLength = possibilitiesObj[key].length;
                   }
                }
        
                // How many keys have the lowest array length ?
                for(let key in possibilitiesObj) {
                    //console.warn(key);
                    if((possibilitiesObj[key].length === lowestArrLength) && (!(usedDigits.includes(key)))) {
                        dangerZoneDigits.push(key);
                    }
                }

                let rand_digit = Math.floor(Math.random() * dangerZoneDigits.length);
                let rand_tile = Math.floor(Math.random() * possibilitiesObj[dangerZoneDigits[rand_digit]].length);
                let index = (currRow * 9) + (parseInt(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile] - 1));

                console.log(dangerZoneDigits, rand_digit);

                console.log(dangerZoneDigits[rand_digit] + ' will be assigned into tile no ' + possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile], index);
                ordered[index].textContent = dangerZoneDigits[rand_digit];

                usedDigits.push(dangerZoneDigits[rand_digit]);

                // Remove a chosen key from an object (1) and the current tile number from all other arrays (2)
                // availableNumbers[random_number] - here we have the digit (key) from an object
                // 2
                 for(let key in possibilitiesObj) {
                    if(possibilitiesObj[key].includes(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile])) {
                        let ind = possibilitiesObj[key].indexOf(possibilitiesObj[dangerZoneDigits[rand_digit]][rand_tile]);
                        possibilitiesObj[key].splice(ind, 1);
                    }
                }
                // 1
                delete possibilitiesObj[dangerZoneDigits[rand_digit]];

                console.log(possibilitiesObj);


                /* let index = ((currRow * 9) + currColumn); // this.rows
                let isDanger = this.checkDangerZone(possibilitiesObj);
                let availableNumbers = [];

                if(isDanger) {
                    console.log(`%c Danger zone`, 'color:red')
                    availableNumbers = isDanger; // ? not sure if that works correctly
                } else {
                    for(let key in possibilitiesObj) {
                        if(possibilitiesObj[key].includes((currColumn + 1))) {
                            availableNumbers.push(key);
                        }
                    }
                }

                // Randomize and assign a value to the current tile

                let random_number = Math.floor(Math.random() * availableNumbers.length);
                ordered[index].textContent = availableNumbers[random_number];

                // Remove a chosen key from an object (1) and the current tile number from all other arrays (2)
                // availableNumbers[random_number] - here we have the digit (key) from an object
                // 1
                delete possibilitiesObj[availableNumbers[random_number]];
                // 2
                for(let key in possibilitiesObj) {
                    if(possibilitiesObj[key].includes((currColumn + 1))) {
                        possibilitiesObj[key].shift(); // might be improved lol
                    }
                } */
            }

        }
    },
 
}

export default engine;