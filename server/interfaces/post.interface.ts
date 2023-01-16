import * as Mongoose from "mongoose";

const PostSchema = new Mongoose.Schema({
  name: String,
  time: String,
  text: String,
  image: { type: String, required: false },
});

const posts = Mongoose.model("posts", PostSchema);

export default posts;
