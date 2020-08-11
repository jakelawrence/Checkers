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
      pieceShape: "circle",

      lastMoveRed: "",
      lastMoveBlack: "",
      isPieceSelected: false,
      playerTurn: "red",

      pieceSelectedRow: 0,
      pieceSelectedCol: 0,
      suggestedPieceRow: 0,
      suggestedPieceColumn_Left: -1,
      suggestedPieceColumn_Right: -1,
    };
    this.setN = this.setN.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeShape = this.changeShape.bind(this);

    this.handleClick = this.handleClick.bind(this);
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

  changeShape() {
    for (let i = 0; i < this.state.n; i++) {
      for (let j = 0; j < this.state.n; j++) {
        if (this.state.pieceShape === "circle") {
          if (
            document.getElementById(`piece-${i}-${j}`).className ===
            "piece piece-red-circle"
          ) {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-red-triangle";
          } else if (
            document.getElementById(`piece-${i}-${j}`).className ===
            "piece piece-black-circle"
          ) {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-black-triangle";
          }

          this.setState({ pieceShape: "triangle" });
        } else {
          if (
            document.getElementById(`piece-${i}-${j}`).className ===
            "piece piece-red-triangle"
          ) {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-red-circle";
          } else if (
            document.getElementById(`piece-${i}-${j}`).className ===
            "piece piece-black-triangle"
          ) {
            document.getElementById(`piece-${i}-${j}`).className =
              "piece piece-black-circle";
          }
          this.setState({ pieceShape: "circle" });
        }
      }
    }
  }

  handleClick(row, col) {
    console.log(row);
    console.log(col);
    console.log(this.state);
    if (this.state.playerTurn === "black") {
      if (
        col > 0 &&
        col < this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (this.state.isPieceSelected === false) {
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              "piece piece-black-circle" &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              "piece piece-red-circle"
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }
          if (
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              "piece piece-black-circle" &&
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              "piece piece-red-circle"
          ) {
            document.getElementById(`piece-${row - 1}-${col - 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,

            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col - 1}`
          ).className = "piece";

          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col + 1}`
          ).className = "piece";

          this.setState({ isPieceSelected: false });
        } else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          if (this.state.suggestedPieceColumn_Left !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (this.state.suggestedPieceColumn_Right !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          document.getElementById(`piece-${row - 1}-${col - 1}`).className =
            "piece suggested";
          document.getElementById(`piece-${row - 1}-${col + 1}`).className =
            "piece suggested";
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
      } else if (
        col === 0 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (
          document.getElementById(`piece-${row}-${col}`).className ===
            `piece piece-${this.state.playerTurn}-${this.state.pieceShape}` &&
          this.state.isPieceSelected === false
        ) {
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row - 1,

            suggestedPieceColumn_Right: col + 1,
            suggestedPieceColumn_Left: -1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col + 1}`
          ).className = "piece";

          this.setState({ isPieceSelected: false });
        } else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          if (this.state.suggestedPieceColumn_Left !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (this.state.suggestedPieceColumn_Right !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          document.getElementById(`piece-${row - 1}-${col + 1}`).className =
            "piece suggested";
          this.setState({
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Right: -1,
          });
        }
      } else if (
        this.state.isPieceSelected &&
        document.getElementById(`piece-${row}-${col}`).className ===
          "piece suggested"
      ) {
        document.getElementById(
          `piece-${row}-${col}`
        ).className = `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`;
        document.getElementById(
          `piece-${this.state.pieceSelectedRow}-${this.state.pieceSelectedCol}`
        ).className = "piece";
        for (let i = 0; i < this.state.n; i++) {
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${i}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${i}`
            ).className = "piece";
          }
        }
        this.setState({
          isPieceSelected: false,
          pieceSelectedRow: 0,
          pieceSelectedCol: 0,
          suggestedPieceRow: 0,
          suggestedPieceColumn_Left: -1,
          suggestedPieceColumn_Right: -1,
          playerTurn: "red",
        });
      }
    } else if (this.state.playerTurn === "red") {
      if (
        col > 0 &&
        col < this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (this.state.isPieceSelected === false) {
          if (
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              "piece piece-black-circle" &&
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              "piece piece-red-circle"
          ) {
            document.getElementById(`piece-${row + 1}-${col + 1}`).className =
              "piece suggested";
          }
          if (
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              "piece piece-black-circle" &&
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              "piece piece-red-circle"
          ) {
            document.getElementById(`piece-${row + 1}-${col - 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,

            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col - 1}`
          ).className = "piece";

          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col + 1}`
          ).className = "piece";

          this.setState({ isPieceSelected: false });
        } else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          if (this.state.suggestedPieceColumn_Left !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (this.state.suggestedPieceColumn_Right !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          document.getElementById(`piece-${row + 1}-${col - 1}`).className =
            "piece suggested";
          document.getElementById(`piece-${row + 1}-${col + 1}`).className =
            "piece suggested";
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
      } else if (
        col === 0 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (
          document.getElementById(`piece-${row}-${col}`).className ===
            `piece piece-${this.state.playerTurn}-${this.state.pieceShape}` &&
          this.state.isPieceSelected === false
        ) {
          if (
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col + 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row + 1,

            suggestedPieceColumn_Right: col + 1,
            suggestedPieceColumn_Left: -1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          document.getElementById(
            `piece-${this.state.suggestedPieceRow}-${col + 1}`
          ).className = "piece";

          this.setState({ isPieceSelected: false });
        } else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          if (this.state.suggestedPieceColumn_Left !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (this.state.suggestedPieceColumn_Right !== -1) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          document.getElementById(`piece-${row + 1}-${col + 1}`).className =
            "piece suggested";
          this.setState({
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Right: -1,
          });
        }
      } else if (
        this.state.isPieceSelected &&
        document.getElementById(`piece-${row}-${col}`).className ===
          "piece suggested"
      ) {
        document.getElementById(
          `piece-${row}-${col}`
        ).className = `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`;
        document.getElementById(
          `piece-${this.state.pieceSelectedRow}-${this.state.pieceSelectedCol}`
        ).className = "piece";
        for (let i = 0; i < this.state.n; i++) {
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${i}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${i}`
            ).className = "piece";
          }
        }
        this.setState({
          isPieceSelected: false,
          pieceSelectedRow: 0,
          pieceSelectedCol: 0,
          suggestedPieceRow: 0,
          suggestedPieceColumn_Left: -1,
          suggestedPieceColumn_Right: -1,
          playerTurn: "black",
        });
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
                      <Piece
                        onClick={(row, col) => this.handleClick(row, col)}
                        key={pieceIdx}
                        n={n}
                        col={col}
                        row={row}
                      ></Piece>
                    );
                  })}
                </div>
              );
            })}
            <div className="m-3">
              <div className="btn btn-danger m-2" onClick={this.changeShape}>
                Change Pieces Shape
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
