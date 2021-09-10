  
import React from 'react';

export default class Cell extends React.Component {


    getValue(){
        return ( `(${this.props.value.x},${this.props.value.y})`)

        if (!this.props.value.isRevealed){
            return this.props.value.isFlagged ? "P" : null;
        }
        if (this.props.value.isMine) {
            return "X";
        }
        if(this.props.value.minesNear === 0 ){
            return null;
        }
        return this.props.value.minesNear;
    }

    render(){
        let className = "cell" + (this.props.value.isRevealed ? "" : " hidden") + (this.props.value.isMine ? " is-mine" : "") + (this.props.value.isFlagged ? " is-flag" : "");


        return (
            // <div ref="cell" onClick={this.props.onClick} className={className} onContextMenu={this.props.cMenu}>
            //     {this.getValue()} 
            // </div>
            <div onClick={this.props.onClick} className={className} onContextMenu={this.props.cMenu}>
                {this.getValue()} 
            </div>
        );
    }
}