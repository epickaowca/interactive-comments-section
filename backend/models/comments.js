import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  parentId: {
    type: String,
  },

  //   author: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     required: true,
  //     ref: "Author",
  //   },
});

export const Comment = mongoose.model("Comment", commentSchema);
