import React, { Component } from "react";

import "./square.css";

export default class Node extends Component {
  render() {
    const { col, row } = this.props;
    let extraClassName = "";
    if (row % 2 === 0) {
      if (col % 2 === 0) {
        extraClassName = "square-black";
      } else {
        extraClassName = "square-white";
      }
    }
    if (row % 2 === 1) {
      if (col % 2 === 1) {
        extraClassName = "square-black";
      } else {
        extraClassName = "square-white";
      }
    }

    return (
      <div
        id={`square-${row}-${col}`}
        className={`square ${extraClassName}`}
      ></div>
    );
  }
}
