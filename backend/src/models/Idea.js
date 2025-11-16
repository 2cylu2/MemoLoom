import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  id: String,
  timestamp: Date,
  title: String,
  content: String,
}, { _id: false });

const ideaSchema = new mongoose.Schema({
  title: String,
  content: String,
  parentId: String,

  // FIX: Add versions array
  versions: {
    type: [versionSchema],
    default: []
  }

}, { timestamps: true });

ideaSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model("Idea", ideaSchema);
