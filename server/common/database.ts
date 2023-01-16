import * as Mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  Mongoose.connect(process.env.MONGOURI || "", {
    retryWrites: true,
    w: "majority",
  })
    .then(() => {
      console.log("Connected to mongoDB.");
    })
    .catch((error) => {
      console.error("Unable to connect to mongoDB.");
      console.error(error);
    });
};

export default connectDB;
