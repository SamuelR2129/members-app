import express from "express";
import { tableModel } from "../interfaces/table.interface";

export const tableRouter = express.Router();

//make post request with array of names

// Retrieve all entries with a users name
tableModel.find({ name: "your-value" }, (error: any, entries: unknown) => {
  if (error) {
    console.error(error);
  } else {
    console.log(entries);
  }
});
