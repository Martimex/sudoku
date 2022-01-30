import React from "react";
import Square from "./Square";
import '../styles/tile.css';

function Tile(props) {

    return(
        <div className="tile">
            {/* {((props.parentId) * (props.squareRows * props.squareColumns)) + (props.id + 1)} */}
            {(Math.floor((props.parentId / props.squareColumns)) * (props.mainColumns * props.squareRows)) +  // detect main row for Square
             (Math.floor((props.id / props.squareRows)) * props.mainColumns) +  // detect square row
             ((props.parentId % props.squareColumns) * props.squareColumns) +
             (props.id % 3) + 1
            }
        </div>
    );
}


export default Tile; 