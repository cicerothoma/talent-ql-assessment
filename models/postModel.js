const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post Must Belong To A User"],
      immutable: true,
    },
    feeling: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Post Must Contain Message"],
      minlength: [10, "Post Must Be Above 10 Characters"],
      trim: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    strict: true,
    timestamps: true,
  }
);

// Query Middleware
postSchema.pre(/^find/, function (next) {
  const fieldsToRemove = "-password -__v -createdAt -updatedAt -phone";
  this.populate("tags", fieldsToRemove);
  next();
});

const Post = model("Post", postSchema, "posts");

module.exports = Post;
