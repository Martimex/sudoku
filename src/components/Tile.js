import React from "react";
import '../styles/tile.css';

function Tile(props) {

    const pattern = (Math.floor((props.parentId / props.squareColumns)) * (props.mainColumns * props.squareRows)) + // detect main row for Square
    (Math.floor((props.id / props.squareRows)) * props.mainColumns) +  // detect square row
    ((props.parentId % props.squareColumns) * props.squareColumns) +
    (props.id % 3) + 1
    
   // const row = Math.floor((props.parentId % 3) * props.squareRows) + Math.floor(props.id / props.squareRows); // tile cord => row
   // const column =  (props.squareColumns * Math.floor(props.parentId / 3)) + Math.floor((props.id % 3)); // tile cord => column

   const column =   (pattern - 1) % (props.squareColumns * props.squareRows);
   const row = Math.floor((pattern - 1) / (props.squareColumns * props.squareRows));

    return(
        <div className={`tile tile-${props.difficulty}`} data-row={row} data-column={column} data-order={pattern}>
        
        </div>
    );
}


export default Tile; 