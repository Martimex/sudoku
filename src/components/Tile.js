import React, { useState } from "react";
import Square from "./Square";
import '../styles/tile.css';

function Tile(props) {

    const [value, setValue] = useState(null);
    //console.log(props);

    const pattern = (Math.floor((props.parentId / props.squareColumns)) * (props.mainColumns * props.squareRows)) + // detect main row for Square
    (Math.floor((props.id / props.squareRows)) * props.mainColumns) +  // detect square row
    ((props.parentId % props.squareColumns) * props.squareColumns) +
    (props.id % 3) + 1
    
    return(
        <div className="tile" data-order={pattern}>
            {value}
        </div>
    );
}


export default Tile; 