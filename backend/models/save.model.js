const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//how save is presented in DB
const saveSchema = new Schema(
  {
    n: {
      type: Number,
      required: true,
    },

    pieces: {
      type: Object,
      required: true,
    },
    pieceShape: {
      type: String,
      required: true,
    },
    isPieceSelected: {
      type: Boolean,
      required: true,
    },
    playerTurn: {
      type: String,
      required: true,
    },
    pieceSelectedRow: {
      type: Number,
      required: true,
    },
    pieceSelectedCol: {
      type: Number,
      required: true,
    },
    suggestedPieceRow: {
      type: Number,
      required: true,
    },
    suggestedPieceColumn_Left: {
      type: Number,
      required: true,
    },
    suggestedPieceColumn_Right: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Save = mongoose.model("Save", saveSchema);

module.exports = Save;
