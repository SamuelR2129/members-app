import {
  DataMappedToDay,
  addDailyUserEntriesTogether,
  addUpHowManyHoursWorked,
  addUpHowMuchUserSpent,
  addValuesTogether,
  sortDataByDay,
  subtractDaysFromWeek,
  tableDataFromDB,
} from "./tableData.router";

describe("subtractDaysFromWeek", () => {
  //Mon: 1, Tues: 2, Wed: 3, Thur: 4, Fri: 5, Sat: 6, Sun: 0

  it("returns the correct date when currentDay is a Sunday", () => {
    const currentDay = new Date("2023-07-02"); // Sunday
    const result = subtractDaysFromWeek(currentDay);
    expect(result).toEqual(new Date("2023-06-26")); // Previous Monday
  });

  it("returns the correct date when currentDay is a Monday", () => {
    const currentDay = new Date("2023-07-03"); // Monday
    const result = subtractDaysFromWeek(currentDay);
    expect(result).toEqual(new Date("2023-07-03")); // Returns Just Monday
  });

  it("returns the correct date when currentDay is a Tuesday", () => {
    const currentDay = new Date("2023-07-04"); // Tuesday
    const result = subtractDaysFromWeek(currentDay);
    expect(result).toEqual(new Date("2023-07-03")); // Previous Monday
  });

  it("returns the correct date when currentDay is a Saturday", () => {
    const currentDay = new Date("2023-07-08"); // Saturday
    const result = subtractDaysFromWeek(currentDay);
    expect(result).toEqual(new Date("2023-07-03")); // Previous Monday
  });
});

describe("sortDataByDay", () => {
  it("should sort data by day correctly", () => {
    const data = [
      { createdAt: new Date("2023-07-08") }, // Saturday
      { createdAt: new Date("2023-06-26") }, // Monday
      { createdAt: new Date("2023-07-04") }, // Tuesday
      { createdAt: new Date("2023-07-02") }, // Sunday
      { createdAt: new Date("2023-07-05") }, // Wednesday
      { createdAt: new Date("2023-07-06") }, // Thursday
      { createdAt: new Date("2023-07-07") }, // Friday
      { createdAt: new Date("2023-07-10") }, // Monday (additional post)
      { createdAt: new Date("2023-07-13") }, // Thursday (additional post)
    ] as tableDataFromDB[];

    const result = sortDataByDay(data);

    expect(result.monday).toEqual([
      { createdAt: new Date("2023-06-26") }, // Monday
      { createdAt: new Date("2023-07-10") }, // Monday (additional post)
    ]);
    expect(result.tuesday).toEqual([
      { createdAt: new Date("2023-07-04") }, // Tuesday
    ]);
    expect(result.wednesday).toEqual([
      { createdAt: new Date("2023-07-05") }, // Wednesday
    ]);
    expect(result.thursday).toEqual([
      { createdAt: new Date("2023-07-06") }, // Thursday
      { createdAt: new Date("2023-07-13") }, // Thursday (additional post)
    ]);
    expect(result.friday).toEqual([
      { createdAt: new Date("2023-07-07") }, // Friday
    ]);
    expect(result.saturday).toEqual([
      { createdAt: new Date("2023-07-08") }, // Saturday
    ]);
    expect(result.sunday).toEqual([
      { createdAt: new Date("2023-07-02") }, // Sunday
    ]);
  });

  it("should handle an empty data array", () => {
    const data: tableDataFromDB[] = [];
    const result = sortDataByDay(data);

    expect(result).toEqual({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    });
  });
});

describe("addUpHowMuchUserSpent", () => {
  test("should return an empty object if the input data is empty", () => {
    const data = [] as tableDataFromDB[];
    const result = addUpHowMuchUserSpent(data);
    expect(result).toEqual({});
  });

  test("should correctly calculate the total costs for each user", () => {
    const data = [
      { name: "John", costs: "10" },
      { name: "Jane", costs: "20" },
      { name: "John", costs: "15" },
      { name: "Jane", costs: "5" },
      { name: "Bob", costs: "30" },
    ] as tableDataFromDB[];
    const result = addUpHowMuchUserSpent(data);
    expect(result).toEqual({
      John: { costs: 25 },
      Jane: { costs: 25 },
      Bob: { costs: 30 },
    });
  });

  test("should handle empty cost values correctly", () => {
    const data = [
      { name: "John", costs: "" },
      { name: "Jane", costs: "20" },
      { name: "John", costs: "" },
      { name: "Jane", costs: "5" },
      { name: "Bob", costs: "30" },
    ] as tableDataFromDB[];
    const result = addUpHowMuchUserSpent(data);
    expect(result).toEqual({
      John: { costs: 0 },
      Jane: { costs: 25 },
      Bob: { costs: 30 },
    });
  });

  test("should handle missing cost values correctly", () => {
    const data = [
      { name: "John" },
      { name: "Jane", costs: "20" },
      { name: "John" },
      { name: "Jane", costs: "5" },
      { name: "Bob", costs: "30" },
    ] as tableDataFromDB[];
    const result = addUpHowMuchUserSpent(data);
    expect(result).toEqual({
      John: { costs: 0 },
      Jane: { costs: 25 },
      Bob: { costs: 30 },
    });
  });
});

describe("addUpHowManyHoursWorked", () => {
  it("should return an empty object if no data is provided", () => {
    const result = addUpHowManyHoursWorked([]);
    expect(result).toEqual({});
  });

  it("should correctly sum the hours worked for each user", () => {
    const data = [
      { name: "John", hours: "2" },
      { name: "Jane", hours: "3" },
      { name: "John", hours: "1" },
    ] as tableDataFromDB[];

    const result = addUpHowManyHoursWorked(data);
    expect(result).toEqual({ John: { hours: 3 }, Jane: { hours: 3 } });
  });

  it("should handle empty or undefined hours correctly", () => {
    const data = [
      { name: "John", hours: "2" },
      { name: "Jane", hours: "" },
      { name: "John", hours: undefined },
      { name: "Jane", hours: "1" },
    ] as tableDataFromDB[];

    const result = addUpHowManyHoursWorked(data);
    expect(result).toEqual({ John: { hours: 2 }, Jane: { hours: 1 } });
  });

  it("should handle initial undefined hours correctly", () => {
    const data = [
      { name: "John", hours: "2" },
      { name: "Jane", hours: "3" },
      { name: "John", hours: "1" },
      { name: "Jane", hours: "1" },
    ] as tableDataFromDB[];

    const result = addUpHowManyHoursWorked(data);
    expect(result).toEqual({ John: { hours: 3 }, Jane: { hours: 4 } });
  });
});

describe("updateArrayWithCost", () => {
  test("should update array elements with total cost and hours, removing duplicates", () => {
    const inputArray = [
      {
        _id: "1",
        name: "A",
        createdAt: new Date("2022-02-02"),
        costs: "5",
        hours: "2",
      },
      {
        _id: "2",
        name: "B",
        createdAt: new Date("2022-02-02"),
        costs: "10",
        hours: "3",
      },
      {
        _id: "3",
        name: "A",
        createdAt: new Date("2022-02-02"),
        costs: "3",
        hours: "1",
      },
      {
        _id: "4",
        name: "C",
        createdAt: new Date("2022-02-02"),
        costs: "8",
        hours: "4",
      },
    ] as tableDataFromDB[];

    const expectedArray = [
      {
        _id: "1",
        name: "A",
        createdAt: new Date("2022-02-02"),
        costs: 8,
        hours: 3,
      },
      {
        _id: "2",
        name: "B",
        createdAt: new Date("2022-02-02"),
        costs: 10,
        hours: 3,
      },
      {
        _id: "4",
        name: "C",
        createdAt: new Date("2022-02-02"),
        costs: 8,
        hours: 4,
      },
    ];

    const updatedArray = addValuesTogether(inputArray);

    expect(updatedArray).toEqual(expectedArray);
  });

  test("should return an empty array for an empty input array", () => {
    const inputArray = [] as tableDataFromDB[];

    const updatedArray = addValuesTogether(inputArray);

    expect(updatedArray).toEqual([]);
  });

  test("should not modify the original input array", () => {
    const inputArray = [
      { _id: "1", name: "A", createdAt: new Date(), costs: "5", hours: "2" },
      { _id: "2", name: "B", createdAt: new Date(), costs: "10", hours: "3" },
    ] as tableDataFromDB[];

    const originalArray = [...inputArray];

    addValuesTogether(inputArray);

    expect(inputArray).toEqual(originalArray);
  });
});

describe("addDailyUserEntriesTogether", () => {
  const mockData: DataMappedToDay = {
    monday: [
      {
        _id: "1",
        name: "Entry 1",
        createdAt: new Date(),
        costs: "10",
        hours: "2",
      },
      {
        _id: "2",
        name: "Entry 2",
        createdAt: new Date(),
        costs: "15",
        hours: "3",
      },
      {
        _id: "1",
        name: "Entry 1",
        createdAt: new Date(),
        costs: "20",
        hours: "3",
      },
    ],
    tuesday: [
      {
        _id: "3",
        name: "Entry 3",
        createdAt: new Date(),
        costs: "20",
        hours: "4",
      },
      {
        _id: "4",
        name: "Entry 4",
        createdAt: new Date(),
        costs: "25",
        hours: "5",
      },
    ],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  const expectedOutput: DataMappedToDay = {
    monday: [
      {
        _id: "1",
        name: "Entry 1",
        createdAt: expect.any(Date),
        costs: 30,
        hours: 5,
      },
      {
        _id: "2",
        name: "Entry 2",
        createdAt: expect.any(Date),
        costs: 15,
        hours: 3,
      },
    ],
    tuesday: [
      {
        _id: "3",
        name: "Entry 3",
        createdAt: expect.any(Date),
        costs: 20,
        hours: 4,
      },
      {
        _id: "4",
        name: "Entry 4",
        createdAt: expect.any(Date),
        costs: 25,
        hours: 5,
      },
    ],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  it("should add the values of costs and hours for each unique name", () => {
    const result = addDailyUserEntriesTogether(mockData);
    expect(result).toEqual(expectedOutput);
  });

  // Add more tests if needed
});
