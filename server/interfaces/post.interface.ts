import * as Mongoose from "mongoose";

const PostSchema = new Mongoose.Schema({
  name: String,
  hours: String,
  costs: String,
  report: String,
  image: { type: String, required: false },
});

const posts = Mongoose.model("posts", PostSchema);

export default posts;
