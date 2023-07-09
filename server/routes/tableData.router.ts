import express from "express";
import posts from "../interfaces/post.interface";

export const tableRouter = express.Router();

export type tableDataFromDB = {
  _id: string;
  name: string;
  createdAt: Date;
  costs: string;
  hours: string;
};

export type DataMappedToDay = {
  monday: tableDataFromDB[];
  tuesday: tableDataFromDB[];
  wednesday: tableDataFromDB[];
  thursday: tableDataFromDB[];
  friday: tableDataFromDB[];
  saturday: tableDataFromDB[];
  sunday: tableDataFromDB[];
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

export const subtractDaysFromWeek = (currentDay: Date) => {
  const daysTillEndOfWeek = 6 - currentDay.getDay();
  const previousDays = currentDay;
  previousDays.setDate(previousDays.getDate() - daysTillEndOfWeek);
  return previousDays;
};

export const sortDataByDay = (data: tableDataFromDB[]): DataMappedToDay => {
  //Mon: 1, Tues: 2, Wed: 3, Thur: 4, Fri: 5, Sat: 6, Sun: 0
  let dayGroups: DataMappedToDay = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  for (const post of data) {
    const postDay = post.createdAt.getDay();

    switch (postDay) {
      case 0:
        dayGroups.sunday.push(post);
        break;

      case 1:
        dayGroups.monday.push(post);
        break;

      case 2:
        dayGroups.tuesday.push(post);
        break;

      case 3:
        dayGroups.wednesday.push(post);
        break;

      case 4:
        dayGroups.thursday.push(post);
        break;

      case 5:
        dayGroups.friday.push(post);
        break;

      case 6:
        dayGroups.saturday.push(post);
        break;

      default:
        throw new Error(
          "A number that is not a day was given to the tableData switch"
        );
    }
  }

  return dayGroups;
};

tableRouter.get("/fetchTableData", async (req, res) => {
  const currentDay = new Date();
  const pastDate = subtractDaysFromWeek(currentDay);

  // Retrieve all entries with a users name
  const data = await posts.find({
    createdAt: { $gte: pastDate, $lte: currentDay },
  });

  if (Array.isArray(data) && data.length === 0) {
    res.status(200).send([]);
  }

  if (!isTableDataValid(data)) {
    return res.status(500).send({
      valid: false,
      result: "Table data is in a incorrect configuration",
    });
  }

  sortDataByDay(data);

  res.status(200).send(data);
});
