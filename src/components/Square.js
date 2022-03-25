import react from "react";
import Sudoku from './Sudoku.js';
import '../styles/square.css';
import Tile from './Tile.js';

function Square(props) {

    const squareGridStyle =  {gridTemplateRows: `repeat(${props.squareRows}, 33%)`, gridTemplateColumns: `repeat(${props.squareColumns}, 33%)`}

    let renderArray = [];
    for(let i=0; i<(props.squareRows * props.squareColumns); i++) {
        renderArray.push('');
    }

    const allTiles = renderArray.map((tile, index) => 
        <Tile key={index.toString()} id={index} parentId={props.id} difficulty={props.difficulty}
        squareRows={props.squareRows} squareColumns={props.squareColumns} mainRows={props.mainRows} mainColumns={props.mainColumns}
        />
    )

    return(
        <div className={`square square-${props.theme}`} style={squareGridStyle}>
            {allTiles}
        </div>
    );
}


export default Square;