const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled",
  },
  content: {
    type: String,
    default: "",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model("Idea", ideaSchema);
