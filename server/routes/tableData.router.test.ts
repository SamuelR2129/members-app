import {
  addUpHowManyHoursWorked,
  addUpHowMuchUserSpent,
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
