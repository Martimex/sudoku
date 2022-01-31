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

    checkColumnCompatibility: function(numbers_array) {

    },

    checkSquareCompatibility: function(numbers_array) {

    },

    setBoard: function() {
        const allTiles = document.querySelectorAll('.tile');
        const allTilesArray = [...allTiles];
        const ordered = this.orderTiles(allTilesArray); // sort out the tiles by their dataset-order property
        console.log(this.con(ordered));
        for(let currRow=0; currRow<this.rows; currRow++) {
            //console.log(this.squareColumns);
            let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for(let currColumn=0; currColumn<this.columns; currColumn++) {
                let index = ((currRow * this.rows) + currColumn);
                let availableNumbers = [...allNumbers];
                this.checkColumnCompatibility(availableNumbers);
                this.checkSquareCompatibility(availableNumbers);
                let random_number = Math.floor(Math.random() * allNumbers.length);
                ordered[index].textContent = allNumbers[random_number];
                allNumbers.splice(random_number, 1);
            }

        }
    },
 
}

export default engine;