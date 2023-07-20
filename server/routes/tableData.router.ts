import express from "express";
import posts from "../interfaces/post.interface";

export const tableRouter = express.Router();

export type tableDataFromDB = {
  _id: string;
  name: string;
  createdAt: Date;
  costs: string | number;
  hours: string | number;
};

export type MappedWeeklyData = {
  [k: string]: {
    _id: string;
    name: string;
    createdAt: Date;
    costs: number;
    hours: number;
  };
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

export type UserCosts = {
  [key: string]: {
    costs: number;
  };
};

export type UserHours = {
  [key: string]: {
    hours: number;
  };
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
  const currentDayOfWeek = currentDay.getDay();
  const daysToSubtract = (currentDayOfWeek + 6) % 7; // Calculate the number of days to subtract inside a 7 day modulo

  const previousDays = new Date(currentDay);
  previousDays.setDate(currentDay.getDate() - daysToSubtract);

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

export const addValuesTogether = (
  postValues: tableDataFromDB[]
): tableDataFromDB[] => {
  const duplicatePosts = postValues.map((element) => {
    const matchingElements = postValues.filter(
      (el) => el.name === element.name
    );

    const totalCost = matchingElements.reduce((acc, el) => acc + +el.costs, 0);

    const totalHours = matchingElements.reduce((acc, el) => acc + +el.hours, 0);

    return {
      _id: element._id,
      name: element.name,
      createdAt: element.createdAt,
      costs: totalCost,
      hours: totalHours,
    };
  });

  //remove duplicates created by above algo
  return duplicatePosts.filter(
    (post, index) =>
      duplicatePosts.findIndex((item) => item.name === post.name) === index
  );
};

export const addDailyUserEntriesTogether = (
  data: DataMappedToDay
): DataMappedToDay => {
  return {
    monday: addValuesTogether(data.monday),
    tuesday: addValuesTogether(data.tuesday),
    wednesday: addValuesTogether(data.wednesday),
    thursday: addValuesTogether(data.thursday),
    friday: addValuesTogether(data.friday),
    saturday: addValuesTogether(data.saturday),
    sunday: addValuesTogether(data.sunday),
  };
};

export const addUpHowMuchUserSpent = (data: tableDataFromDB[]): UserCosts => {
  const finalSums: UserCosts = {};

  for (const post of data) {
    let builtCosts: tableDataFromDB | { name: string; costs: string };

    if (!post.name) {
      throw new Error("No name on post when adding up costs");
    }

    if (post.costs === "" || !post.costs) {
      builtCosts = {
        name: post.name,
        costs: "0",
      };
    } else {
      builtCosts = post;
    }

    if (!finalSums[builtCosts.name]) {
      finalSums[builtCosts.name] = { costs: +builtCosts.costs };
    } else {
      finalSums[builtCosts.name].costs =
        +finalSums[builtCosts.name].costs + +builtCosts.costs;
    }
  }
  return finalSums;
};

export const addUpHowManyHoursWorked = (data: tableDataFromDB[]): UserHours => {
  const finalSums: UserHours = {};

  for (const post of data) {
    let builtHours: tableDataFromDB | { name: string; hours: string };

    if (!post.name) {
      throw new Error("No name on post when adding up hours worked");
    }

    if (post.hours === "" || !post.hours) {
      builtHours = {
        name: post.name,
        hours: "0",
      };
    } else {
      builtHours = post;
    }

    if (!finalSums[builtHours.name]) {
      finalSums[builtHours.name] = { hours: +builtHours.hours };
    } else {
      finalSums[builtHours.name].hours =
        +finalSums[builtHours.name].hours + +builtHours.hours;
    }
  }

  return finalSums;
};

tableRouter.get("/fetchTableData", async (req, res) => {
  try {
    const currentDay = new Date();
    const pastDate = subtractDaysFromWeek(currentDay);

    // Retrieve all entries with a users name
    const postData = await posts.find({
      createdAt: { $gte: pastDate, $lte: currentDay },
    });

    if (Array.isArray(postData) && postData.length === 0) {
      return res.status(200).send([]);
    }

    if (!isTableDataValid(postData)) {
      return res.status(500).send({
        valid: false,
        result: "Table data is in a incorrect configuration",
      });
    }

    const dataByDay = sortDataByDay(postData);

    const weeklyData = addDailyUserEntriesTogether(dataByDay);

    const overallCosts = addUpHowMuchUserSpent(postData);

    const overallHours = addUpHowManyHoursWorked(postData);

    res.status(200).send({
      weeklyData: weeklyData,
      totalCosts: overallCosts,
      totalHours: overallHours,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
