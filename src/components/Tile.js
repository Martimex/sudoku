import React from "react";
import '../styles/tile.css';

function Tile(props) {

    const pattern = (Math.floor((props.parentId / props.squareColumns)) * (props.mainColumns * props.squareRows)) + // detect main row for Square
    (Math.floor((props.id / props.squareRows)) * props.mainColumns) +  // detect square row
    ((props.parentId % props.squareColumns) * props.squareColumns) +
    (props.id % 3) + 1
    
    return(
        <div className={`tile tile-${props.difficulty}`} data-order={pattern}>

        </div>
    );
}


export default Tile; 