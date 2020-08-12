const router = require("express").Router();
let Save = require("../models/save.model");

//functions to view users
router.route("/").get((req, res) => {
  Save.find()
    .then((saves) => res.json(saves))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.patch("/", async (req, res) => {
  try {
    const savedState = await Save.updateOne(
      { _id: "5f33abfd096d80c7ebc8c540" },
      {
        $set: {
          n: req.body.n,
          pieces: req.body.pieces,
          pieceShape: req.body.pieceShape,
          isPieceSelected: req.body.isPieceSelected,
          playerTurn: req.body.playerTurn,
          pieceSelectedRow: req.body.pieceSelectedRow,
          pieceSelectedCol: req.body.pieceSelectedCol,
          suggestedPieceRow: req.body.suggestedPieceRow,
          suggestedPieceColumn_Left: req.body.suggestedPieceColumn_Left,
          suggestedPieceColumn_Right: req.body.suggestedPieceColumn_Right,
        },
      }
    );
    res.json(savedState);
  } catch (err) {
    res.json({ message: err });
  }
});

router.route("/").post((req, res) => {
  const n = req.body.n;
  const pieces = req.body.pieces;
  const pieceShape = req.body.pieceShape;
  const isPieceSelected = req.body.isPieceSelected;
  const playerTurn = req.body.playerTurn;
  const pieceSelectedRow = req.body.pieceSelectedRow;
  const pieceSelectedCol = req.body.pieceSelectedCol;
  const suggestedPieceRow = req.body.suggestedPieceRow;
  const suggestedPieceColumn_Left = req.body.suggestedPieceColumn_Left;
  const suggestedPieceColumn_Right = req.body.suggestedPieceColumn_Right;

  const newSave = new Save({
    n,
    pieces,
    pieceShape,
    isPieceSelected,
    playerTurn,
    pieceSelectedRow,
    pieceSelectedCol,
    suggestedPieceRow,
    suggestedPieceColumn_Left,
    suggestedPieceColumn_Right,
  });

  newSave
    .save()
    .then(() => res.json("Save added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
