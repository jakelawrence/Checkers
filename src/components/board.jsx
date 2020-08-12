import React, { Component } from "react";
import axios from "axios";
import Square from "./square.jsx";
import Piece from "./piece.jsx";
import "./board.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleReset = this.handleReset.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("stateSaved") === "true") {
      axios
        .get("http://localhost:5000/saves/")
        .then((response) => {
          this.setState(
            {
              n: response.data[0].n,
              pieces: response.data[0].pieces,
              pieceShape: response.data[0].pieceShape,
              isPieceSelected: response.data[0].isPieceSelected,
              playerTurn: response.data[0].playerTurn,
              pieceSelectedRow: response.data[0].pieceSelectedRow,
              pieceSelectedCol: response.data[0].pieceSelectedCol,
              suggestedPieceRow: response.data[0].suggestedPieceRow,
              suggestedPieceColumn_Left:
                response.data[0].suggestedPieceColumn_Left,
              suggestedPieceColumn_Right:
                response.data[0].suggestedPieceColumn_Right,
            },
            () => {
              console.log(this.state.pieces);
              const grid = getInitialGrid(this.state.n);
              this.setState({ grid });
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const grid = getInitialGrid(this.state.n);
      this.setState({ grid });
      const pieces = getInitialPieces(this.state.n, this.state.pieceShape);
      this.setState({ pieces });
    }
  }

  //set user selected value of n and save it to state
  setN() {
    const number = document.getElementById("num").value;

    this.setState({
      n: number,
    });
  }

  //change shape of pieces according to user
  changeShape() {
    let newPieces = this.state.pieces;
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
          newPieces[i][j].shape = "triangle";
          this.setState({ pieceShape: "triangle" });
        } else if (this.state.pieceShape === "triangle") {
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
          newPieces[i][j].shape = "circle";
          this.setState({ pieceShape: "circle" });
        }
      }
    }
  }

  //handle all moves played
  handleClick(row, col) {
    //if player turn is black
    if (this.state.playerTurn === "black") {
      //if the selected piece is not in the first or last column
      if (
        col > 0 &&
        col < this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-black-${this.state.pieceShape}`
      ) {
        //if the there is currently no other piece selected
        if (this.state.isPieceSelected === false) {
          //if the space up and to the right is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }
          //if the space up and to the left is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col - 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            //piece has been selected
            isPieceSelected: true,
            //selected piece coordinates
            pieceSelectedCol: col,
            pieceSelectedRow: row,

            //suggested moves coordinates
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
        //if there is a piece selected and player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if there is a suggested move up and to the left, change it back to blank square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }
          //if there is a suggested move up and to the right, change it back to blank square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }
          //piece is no longer selected
          this.setState({ isPieceSelected: false });
        }
        //if there is a piece selected and player chooses a different piece to highlight
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //if there is a suggested move up and to the left, change it back to blank square
          //in this we ask if suggestedPieceColumn_Left is not -1, that means that it has been
          //set and we haven't selected a piece on the first or last column previously
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          //same thing as if statement above but for up and to the right
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          //if the space up and to the right is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }
          //if the space up and to the left is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col - 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
      }
      //if the selected piece is in the first column
      else if (
        col === 0 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        //if there is no piece currently selected
        if (this.state.isPieceSelected === false) {
          //if the move up and to the right is open, highlight it as a suggested move
          //we don't do up and to the left here because we would go out of bounds looking
          //to the left in the first row
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row - 1,

            suggestedPieceColumn_Right: col + 1,
            //keep as -1 because there is no suggested move to the left
            suggestedPieceColumn_Left: -1,
          });
        }
        //if there is a piece selected and the player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if the piece up and to the right was marked as a suggested move
          //return it to a default square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

          //set state to no piece selected
          this.setState({ isPieceSelected: false });
        }
        //if there is a piece selected and the player chooses a different piece to highlight
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //unselect the previously suggested moves
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }
          //if the move up and to the right is open, highlight it as a suggested move
          //we don't do up and to the left here because we would go out of bounds looking
          //to the left in the first row
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
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Right: -1,
          });
        }
      }
      //if the selected piece is in the last column
      else if (
        col === this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-black-${this.state.pieceShape}`
      ) {
        //if there is no currently selected pieces
        if (this.state.isPieceSelected === false) {
          //if the move up and to the left is open, highlight it as a suggested move
          //we don't do up and to the right here because we would go out of bounds looking
          //to the right in the last row
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
            //keep suggested move to the right empty
            suggestedPieceColumn_Right: -1,
            suggestedPieceColumn_Left: col - 1,
          });
        }
        //if there is a piece selected and the player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if there is a suggested move up and to the left
          //return it back to a blank space
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }
          //no current selected pieces
          this.setState({ isPieceSelected: false });
        }
        //if there is a selected piece and the user selects a different piece
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //unselect the previously suggested moves
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          //if the move up and to the left is open, highlight it as a suggested move
          //we don't do up and to the right here because we would go out of bounds looking
          //to the right in the last row
          if (
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row - 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}` &&
            (row < 2 || row > this.state.n - 2)
          ) {
            document.getElementById(`piece-${row - 1}-${col + 1}`).className =
              "piece suggested";
          }
          this.setState({
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row - 1,
            suggestedPieceColumn_Left: -1,
          });
        }
      }
      //if the player chooses a suggested move
      else if (
        this.state.isPieceSelected &&
        document.getElementById(`piece-${row}-${col}`).className ===
          "piece suggested"
      ) {
        //execute the user selected move and move the piece to that square
        document.getElementById(
          `piece-${row}-${col}`
        ).className = `piece piece-black-${this.state.pieceShape}`;
        //remove the piece from its previous space
        document.getElementById(
          `piece-${this.state.pieceSelectedRow}-${this.state.pieceSelectedCol}`
        ).className = "piece";
        const newPieces = this.state.pieces;
        newPieces[row][col].player = "black";
        newPieces[this.state.pieceSelectedRow][
          this.state.pieceSelectedCol
        ].player = "";
        this.setState({ pieces: newPieces });
        console.log(newPieces);
        //remove suggested moves
        if (
          document.getElementById(
            `piece-${this.state.pieceSelectedRow - 1}-${
              this.state.pieceSelectedCol + 1
            }`
          ).className === "piece suggested"
        ) {
          document.getElementById(
            `piece-${this.state.pieceSelectedRow - 1}-${
              this.state.pieceSelectedCol + 1
            }`
          ).className = "piece";
        }
        if (
          document.getElementById(
            `piece-${this.state.pieceSelectedRow - 1}-${
              this.state.pieceSelectedCol - 1
            }`
          ).className === "piece suggested"
        ) {
          document.getElementById(
            `piece-${this.state.pieceSelectedRow - 1}-${
              this.state.pieceSelectedCol - 1
            }`
          ).className = "piece";
        }

        //reset selected piece and suggested moves
        //set it to red player's turn
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
    }
    //if player turn is red
    else if (this.state.playerTurn === "red") {
      //if the selected piece is not in the first or last column
      if (
        col > 0 &&
        col < this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-red-${this.state.pieceShape}`
      ) {
        console.log(this.state.isPieceSelected);
        //if the there is currently no other piece selected
        if (this.state.isPieceSelected === false) {
          //if the space down and to the right is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col + 1}`).className =
              "piece suggested";
          }
          //if the space down and to the left is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col - 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            //piece has been selected
            isPieceSelected: true,
            //selected piece coordinates
            pieceSelectedCol: col,
            pieceSelectedRow: row,

            //suggested moves coordinates
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
        //if there is a piece selected and player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if there is a suggested move down and to the left, change it back to blank square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }
          //if there is a suggested move up and to the right, change it back to blank square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }
          //piece is no longer selected
          this.setState({ isPieceSelected: false });
        }
        //if there is a piece selected and player chooses a different piece to highlight
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //if there is a suggested move down and to the left, change it back to blank square
          //in this we ask if suggestedPieceColumn_Left is not -1, that means that it has been
          //set and we haven't selected a piece on the first or last column previously
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          //same thing as if statement above but for up and to the right
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          //if the space down and to the right is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col + 1}`).className =
              "piece suggested";
          }
          //if the space down and to the left is open, then mark it as a suggested move
          if (
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col - 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col - 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: col - 1,
            suggestedPieceColumn_Right: col + 1,
          });
        }
      }
      //if the selected piece is in the first column
      else if (
        col === 0 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-${this.state.playerTurn}-${this.state.pieceShape}`
      ) {
        //if there is no piece currently selected
        if (this.state.isPieceSelected === false) {
          //if the move down and to the right is open, highlight it as a suggested move
          //we don't do down and to the left here because we would go out of bounds looking
          //to the left in the first row
          if (
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-black-${this.state.pieceShape}` &&
            document.getElementById(`piece-${row + 1}-${col + 1}`).className !==
              `piece piece-red-${this.state.pieceShape}`
          ) {
            document.getElementById(`piece-${row + 1}-${col + 1}`).className =
              "piece suggested";
          }

          //update state
          this.setState({
            isPieceSelected: true,
            pieceSelectedCol: col,
            pieceSelectedRow: row,
            suggestedPieceRow: row + 1,

            suggestedPieceColumn_Right: col + 1,
            //keep as -1 because there is no suggested move to the left
            suggestedPieceColumn_Left: -1,
          });
        }
        //if there is a piece selected and the player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if the piece down and to the right was marked as a suggested move
          //return it to a default square
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col + 1}`
            ).className = "piece";
          }

          //set state to no piece selected
          this.setState({ isPieceSelected: false });
        }
        //if there is a piece selected and the player chooses a different piece to highlight
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //unselect the previously suggested moves
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }
          //if the move down and to the right is open, highlight it as a suggested move
          //we don't do down and to the left here because we would go out of bounds looking
          //to the left in the first row
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
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Right: -1,
          });
        }
      }
      //if the selected piece is in the last column
      else if (
        col === this.state.n - 1 &&
        document.getElementById(`piece-${row}-${col}`).className ===
          `piece piece-red-${this.state.pieceShape}`
      ) {
        //if there is no currently selected pieces
        if (this.state.isPieceSelected === false) {
          //if the move down and to the left is open, highlight it as a suggested move
          //we don't do down and to the right here because we would go out of bounds looking
          //to the right in the last row
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
            //keep suggested move to the right empty
            suggestedPieceColumn_Right: -1,
            suggestedPieceColumn_Left: col - 1,
          });
        }
        //if there is a piece selected and the player chooses to unselect it
        else if (
          this.state.isPieceSelected === true &&
          row === this.state.pieceSelectedRow &&
          col === this.state.pieceSelectedCol
        ) {
          //if there is a suggested move down and to the left
          //return it back to a blank space
          if (
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${col - 1}`
            ).className = "piece";
          }
          //no current selected pieces
          this.setState({ isPieceSelected: false });
        }
        //if there is a selected piece and the user selects a different piece
        else if (
          this.state.isPieceSelected === true &&
          (row !== this.state.pieceSelectedRow ||
            col !== this.state.pieceSelectedCol)
        ) {
          //unselect the previously suggested moves
          if (
            this.state.suggestedPieceColumn_Left !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Left}`
            ).className = "piece";
          }
          if (
            this.state.suggestedPieceColumn_Right !== -1 &&
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className === "piece suggested"
          ) {
            document.getElementById(
              `piece-${this.state.suggestedPieceRow}-${this.state.suggestedPieceColumn_Right}`
            ).className = "piece";
          }

          //if the move down and to the left is open, highlight it as a suggested move
          //we don't do down and to the right here because we would go out of bounds looking
          //to the right in the last row
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
            isPieceSelected: false,
            pieceSelectedCol: 0,
            pieceSelectedRow: 0,
            suggestedPieceRow: row + 1,
            suggestedPieceColumn_Left: -1,
          });
        }
      }
      //if the player chooses a suggested move
      else if (
        this.state.isPieceSelected &&
        document.getElementById(`piece-${row}-${col}`).className ===
          "piece suggested"
      ) {
        //execute the user selected move and move the piece to that square
        document.getElementById(
          `piece-${row}-${col}`
        ).className = `piece piece-red-${this.state.pieceShape}`;
        //remove the piece from its previous space
        document.getElementById(
          `piece-${this.state.pieceSelectedRow}-${this.state.pieceSelectedCol}`
        ).className = "piece";
        const newPieces = this.state.pieces;
        newPieces[row][col].player = "red";
        newPieces[this.state.pieceSelectedRow][
          this.state.pieceSelectedCol
        ].player = "";
        this.setState({ pieces: newPieces });
        console.log(newPieces);
        //remove suggested moves
        if (
          document.getElementById(
            `piece-${this.state.pieceSelectedRow + 1}-${
              this.state.pieceSelectedCol + 1
            }`
          ).className === "piece suggested"
        ) {
          document.getElementById(
            `piece-${this.state.pieceSelectedRow + 1}-${
              this.state.pieceSelectedCol + 1
            }`
          ).className = "piece";
        }
        if (
          document.getElementById(
            `piece-${this.state.pieceSelectedRow + 1}-${
              this.state.pieceSelectedCol - 1
            }`
          ).className === "piece suggested"
        ) {
          document.getElementById(
            `piece-${this.state.pieceSelectedRow + 1}-${
              this.state.pieceSelectedCol - 1
            }`
          ).className = "piece";
        }

        //reset selected piece and suggested moves
        //set it to black player's turn
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

  handleSave() {
    localStorage.setItem("stateSaved", "true");
    const save = {
      n: this.state.n,
      pieces: this.state.pieces,
      pieceShape: this.state.pieceShape,
      isPieceSelected: this.state.isPieceSelected,
      playerTurn: this.state.playerTurn,
      pieceSelectedRow: this.state.pieceSelectedRow,
      pieceSelectedCol: this.state.pieceSelectedCol,
      suggestedPieceRow: this.state.suggestedPieceRow,
      suggestedPieceColumn_Left: this.state.suggestedPieceColumn_Left,
      suggestedPieceColumn_Right: this.state.suggestedPieceColumn_Right,
    };
    axios
      .patch("http://localhost:5000/saves/", save)
      .then((res) => console.log(res.data));
  }

  handleReset() {
    localStorage.removeItem("stateSaved");
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    const pieces = getInitialPieces(this.state.n, this.state.pieceShape);
    this.setState({ pieces });
    this.setState({ playerTurn: "red" });
  }

  //handle the submit functionn for the number of rows and columns
  handleSubmit(event) {
    event.preventDefault();
    const grid = getInitialGrid(this.state.n);
    this.setState({ grid });
    const pieces = getInitialPieces(this.state.n, this.state.pieceShape);
    this.setState({ pieces });
  }

  render() {
    const { grid } = this.state;
    const { pieces } = this.state;

    return (
      <div className="">
        {/* Number of rows and columns selecter */}
        <ul className="nav bg-dark p-3 d-flex justify-content-between">
          <h1 className="text-white ml-2 mt-2">Checkers</h1>
          <div>
            <h2 className="text-white">Select Size:</h2>
            <input
              onChange={() => this.setN()}
              id="num"
              className="multi-range"
              type="number"
              value={this.state.n}
              min="5"
              max="13"
            />
            <div
              onClick={this.handleSubmit}
              className="btn btn-info btn-sm ml-2"
            >
              Submit
            </div>
          </div>

          <div>
            <div
              className="btn btn-success btn-sm mr-2 mt-3"
              onClick={this.handleSave}
            >
              Save Game
            </div>
            <div
              className="btn btn-danger btn-sm mr-2 mt-3"
              onClick={this.handleReset}
            >
              Reset Game
            </div>
          </div>
        </ul>

        {/* Checker board under the player pieces */}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div className="row" key={rowIdx}>
                {row.map((square, squareIdx) => {
                  const { row, col } = square;
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
                    const { row, col, shape, player } = piece;
                    return (
                      <Piece
                        onClick={(row, col) => this.handleClick(row, col)}
                        shape={shape}
                        player={player}
                        key={pieceIdx}
                        col={col}
                        row={row}
                      ></Piece>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="m-3">
          {/* Change Piece Shape Button and Player's Turn indicator */}

          <div style={{ color: this.state.playerTurn }}>
            {this.state.playerTurn.toUpperCase()} PLAYER'S TURN
          </div>
          <div className="btn btn-primary m-2" onClick={this.changeShape}>
            Change Pieces Shape
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
const getInitialPieces = (n, shape) => {
  const pieces = [];
  for (let row = 0; row < n; row++) {
    const currentRow = [];
    let player = "";
    if (row < 2) {
      player = "red";
    }
    if (row > n - 3) {
      player = "black";
    }
    for (let col = 0; col < n; col++) {
      currentRow.push(createPiece(col, row, shape, player));
    }
    pieces.push(currentRow);
  }
  return pieces;
};

//creates individual pieces
const createPiece = (col, row, shape, player) => {
  return {
    col,
    row,
    shape,
    player,
  };
};

export default Board;
