import express from "express";
import posts from "../interfaces/post.interface";

export const tableRouter = express.Router();

type tableDataFromDB = {
  _id: string;
  name: string;
  createdAt: Date;
  costs: string;
  hours: string;
};

const isTableDataValid = (
  unknownData: tableDataFromDB[] | unknown
): unknownData is tableDataFromDB[] => {
  const postsFromDB = unknownData as tableDataFromDB[];
  return (
    Array.isArray(postsFromDB) &&
    typeof postsFromDB[0]._id &&
    typeof postsFromDB[0].createdAt &&
    typeof postsFromDB[0].name === "string" &&
    typeof postsFromDB[0].costs === "string" &&
    typeof postsFromDB[0].hours === "string"
  );
};

tableRouter.get("/fetchTableData", async (req, res) => {
  // Retrieve all entries with a users name
  const data = await posts.find({
    createdAt: { $gte: new Date("2020-12-17T03:24:00"), $lte: new Date() },
  });

  if (!isTableDataValid(data)) {
    return res.status(500).send({
      valid: false,
      result: "Mongoose did not create a new post",
    });
  }

  res.status(200).send([{ name: "", hours: "String;", costs: "" }]);
});
