import * as Mongoose from "mongoose";

const PostSchema = new Mongoose.Schema(
  {
    name: String,
    hours: String,
    costs: String,
    report: String,
    images: String,
  },
  {
    timestamps: true,
  }
);

const posts = Mongoose.model("posts", PostSchema);

export default posts;
