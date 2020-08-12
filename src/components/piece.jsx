import React, { Component } from "react";

import "./piece.css";

export default class Piece extends Component {
  render() {
    const { row, col, shape, player, onClick } = this.props;

    let extraClassName = "";

    if (player) {
      extraClassName = `piece-${player}-${shape}`;
    }

    return (
      <div
        id={`piece-${row}-${col}`}
        className={`piece ${extraClassName}`}
        onClick={() => onClick(row, col)}
      ></div>
    );
  }
}
