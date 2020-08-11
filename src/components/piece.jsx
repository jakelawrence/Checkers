import React, { Component } from "react";

import "./piece.css";

export default class Piece extends Component {
  render() {
    const { row, col, n, onClick } = this.props;

    let extraClassName = "";

    if (row < 2) {
      extraClassName = "piece-red-circle";
    } else if (row > n - 3) {
      extraClassName = "piece-black-circle";
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
