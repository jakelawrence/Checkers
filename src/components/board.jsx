import React, { Component } from "react";
import Square from "./square.jsx";
import Piece from "./piece.jsx";
import "./board.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //number of rows and columns
      n: 8,
      //black and white board
      grid: [],
      //black and red player pieces
      pieces: [],
      //selected shape of pieces
      pieceShape: "circle",

      //is there a piece currently selected
      isPieceSelected: false,
      //current player's turn
      playerTurn: "red",

      //coordinated of selected piece
      pieceSelectedRow: 0,
      pieceSelectedCol: 0,

      //coordinates of suggested pieces
      suggestedPieceRow: 0,
      suggestedPieceColumn_Left: -1,
      suggestedPieceColumn_Right: -1,

      savedState: false,
    };

    //bind functions
    this.setN = this.setN.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeShape = this.changeShape.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    const pieces = getInitialPieces(this.state.n);
    this.setState({ pieces });
  }

  //set user selected value of n and save it to state
  setN() {
    console.log("Hello");
    const number = document.getElementById("num").value;

    this.setState({
      n: number,
    });
  }

  //change shape of pieces according to user
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

  //handle all moves played
  handleClick(row, col) {
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
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }

          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

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
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

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
        col === this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (
          document.getElementById(`piece-${row}-${col}`).className ===
            `piece piece-${this.state.playerTurn}-${this.state.pieceShape}` &&
          this.state.isPieceSelected === false
        ) {
          if (
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col - 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row - 1,

            suggestedPieceColumn_Right: -1,
            suggestedPieceColumn_Left: col - 1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }

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
          this.setState({
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: -1,
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
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }

          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

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
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

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
        col === this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        if (
          document.getElementById(`piece-${row}-${col}`).className ===
            `piece piece-${this.state.playerTurn}-${this.state.pieceShape}` &&
          this.state.isPieceSelected === false
        ) {
          if (
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col - 1}`).className =
              "piece suggested";
          }

          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row + 1,

            suggestedPieceColumn_Right: -1,
            suggestedPieceColumn_Left: col - 1,
          });
        } else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }

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
          this.setState({
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: -1,
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

  handleSave() {}

  //handle the submit functionn for the number of rows and columns
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
      <div className="container">
        {/* Number of rows and columns selecter */}

        <div class="input-group m-auto w-50">
          <input
            id="num"
            type="text"
            class="form-control"
            placeholder="Enter Number of Rows/Columns: (Default: 8)"
            onChange={() => this.setN()}
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-primary"
              onClick={this.handleSubmit}
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
        {/* Checker board under the player pieces */}
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
          {/* Pieces over the top of the checker board */}
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
            {/* Change Piece Shape Button and PLayer's Turn ID */}
            <div className="m-3">
              <div className="btn btn-primary m-2" onClick={this.changeShape}>
                Change Pieces Shape
              </div>

              <div style={{ color: this.state.playerTurn }}>
                {this.state.playerTurn.toUpperCase()} PLAYER'S TURN
              </div>
            </div>
            {/* Save and Reset Game Buttons */}
            <div>
              <div className="btn btn-success m-2" onClick={this.handleSave}>
                Save Game
              </div>
              <div className="btn btn-danger m-2" onClick={this.changeShape}>
                Reset Game
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//Creates a grid of sqaure NxN, according to the user inputed N
const getInitialGrid = (n) => {
  const grid = [];
  for (let row = 0; row < n; row++) {
    const currentRow = [];
    for (let col = 0; col < n; col++) {
      currentRow.push(createSquare(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

//creates Squares
const createSquare = (col, row) => {
  return {
    col,
    row,
  };
};

//creates piece grid with pieces in starting position
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

//creates individual pieces
const createPiece = (col, row, n) => {
  return {
    col,
    row,
    n,
  };
};

export default Board;
