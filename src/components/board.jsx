import React, { Component } from "react";
import Square from "./square.jsx";
import Piece from "./piece.jsx";
import "./board.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 8,
      grid: [],
      pieces: [],
      redPiece: "circle",
      blackPiece: "circle",
    };
    this.setN = this.setN.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeRed = this.changeRed.bind(this);
    this.changeBlack = this.changeBlack.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    const pieces = getInitialPieces(this.state.n);
    this.setState({ pieces });
  }

  setN() {
    const number = document.getElementById("num").value;

    this.setState({
      n: number,
    });
  }

  changeRed() {
    for (let i = 0; i < this.state.n; i++) {
      for (let j = 0; j < this.state.n; j++) {
        if (i < 2) {
          if (this.state.redPiece === "circle") {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-red-triangle";
            this.setState({ redPiece: "triangle" });
          } else {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-red-circle";
            this.setState({ redPiece: "circle" });
          }
        }
      }
    }
  }

  changeBlack() {
    console.log("Hello");
    for (let i = 0; i < this.state.n; i++) {
      for (let j = 0; j < this.state.n; j++) {
        if (i > this.state.n - 3) {
          if (this.state.blackPiece === "circle") {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-black-triangle";
            this.setState({ blackPiece: "triangle" });
          } else {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-black-circle";
            this.setState({ blackPiece: "circle" });
          }
        }
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    const pieces = getInitialPieces(this.state.n);
    this.setState({ pieces });
  }

  render() {
    const { grid } = this.state;
    const { pieces } = this.state;
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
          <div className="pieces">
            {pieces.map((row, rowIdx) => {
              return (
                <div className="row" key={rowIdx}>
                  {row.map((piece, pieceIdx) => {
                    const { row, col, n } = piece;
                    return (
                      <Piece key={pieceIdx} n={n} col={col} row={row}></Piece>
                    );
                  })}
                </div>
              );
            })}
            <div className="m-3">
              <div className="btn btn-danger m-2" onClick={this.changeRed}>
                Change Red Pieces Shape
              </div>
              <div className="btn btn-dark m-2" onClick={this.changeBlack}>
                Change Black Pieces Shape
              </div>
            </div>
          </div>
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

const getInitialPieces = (n) => {
  const pieces = [];
  for (let row = 0; row < n; row++) {
    const currentRow = [];
    for (let col = 0; col < n; col++) {
      currentRow.push(createPiece(col, row, n));
    }
    pieces.push(currentRow);
  }
  return pieces;
};

const createPiece = (col, row, n) => {
  return {
    col,
    row,
    n,
  };
};

export default Board;
