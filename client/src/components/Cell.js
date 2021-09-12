import React from 'react';
import {
	FaBomb,
    FaFlag
} from 'react-icons/fa';

const Cell = (props) => {
    //console.log(props.cellData.isRevealed)
    // console.log(props)
    const getValue = () => {
        //return ( `(${props.cellData.isRevealed})`)

        if (!props.cellData.isRevealed){
            return props.cellData.isFlagged ? <FaFlag  className="has-text-primary" /> : null;
        }
        if (props.cellData.isMine) {
            return <FaBomb  className="has-text-primary" />;
        }
        if(props.cellData.nearbyMines === 0 ){
            return null;
        }
        return props.cellData.nearbyMines;
    }

    let className = "cell" + (props.cellData.isRevealed ? "" : " hidden") + (props.cellData.isMine ? " is-mine" : "") + (props.cellData.isFlagged ? " is-flag" : "");

    return (
        // <div ref="cell" onClick={this.props.onClick} className={className} onContextMenu={this.props.cMenu}>
        //     {this.getValue()} 
        // </div>
        // <div onClick={props.onClick} className={className} onContextMenu={props.cMenu}>
        <div className={className} onClick={props.onClick} onContextMenu={props.contextMenu}>
            {getValue()} 
        </div>
    );
}

export default Cell;