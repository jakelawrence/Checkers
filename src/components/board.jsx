import React, { Component } from "react";
import Square from "./square.jsx";
import "./board.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 8,
      grid: [],
    };
    this.setN = this.setN.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
  }

  setN() {
    const number = document.getElementById("num").value;
    console.log(number);
    this.setState({
      n: number,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    console.log(this.state.n);
  }

  render() {
    const { grid } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter Number of Rows/Columns:
            <input
              id="num"
              type="text"
              value={this.state.n}
              onChange={() => this.setN()}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div className="row" key={rowIdx}>
                {row.map((square, squareIdx) => {
                  const { row, col, isBlack } = square;
                  return <Square key={squareIdx} col={col} row={row}></Square>;
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (n) => {
  const grid = [];
  for (let row = 0; row < n; row++) {
    const currentRow = [];
    for (let col = 0; col < n; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
  };
};

export default Board;
