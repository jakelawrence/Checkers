const router = require("express").Router();
let Save = require("../models/save.model");

//returns the saved state of the game
router.route("/").get((req, res) => {
  Save.find()
    .then((saves) => res.json(saves))
    .catch((err) => res.status(400).json("Error: " + err));
});

//updates the saved state of the game
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

module.exports = router;
