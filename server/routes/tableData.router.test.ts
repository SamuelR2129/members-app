import { subtractDaysFromWeek, tableDataFromDB } from "./tableData.router";

describe("subtractDaysFromWeek", () => {
  it("returns the correct date when currentDay is a Sunday", () => {
    const currentDay = new Date("2023-07-02"); // Sunday
    const result = subtractDaysFromWeek(currentDay);
    expect(result).toEqual(new Date("2023-06-26")); // Previous Monday
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
  import { sortDataByDay } from "./your-module";

  describe("sortDataByDay", () => {
    it("should sort data by day correctly", () => {
      const data = [
        { createdAt: new Date(2023, 6, 3) }, // Saturday
        { createdAt: new Date(2023, 6, 1) }, // Monday
        { createdAt: new Date(2023, 6, 4) }, // Tuesday
        { createdAt: new Date(2023, 6, 2) }, // Sunday
        { createdAt: new Date(2023, 6, 6) }, // Wednesday
        { createdAt: new Date(2023, 6, 5) }, // Thursday
        { createdAt: new Date(2023, 6, 0) }, // Friday
        { createdAt: new Date(2023, 6, 1) }, // Monday (additional post)
        { createdAt: new Date(2023, 6, 5) }, // Thursday (additional post)
      ];

      const result = sortDataByDay(data);

      expect(result.monday).toEqual([
        { createdAt: new Date(2023, 6, 1) },
        { createdAt: new Date(2023, 6, 1) },
      ]);
      expect(result.tuesday).toEqual([{ createdAt: new Date(2023, 6, 4) }]);
      expect(result.wednesday).toEqual([{ createdAt: new Date(2023, 6, 6) }]);
      expect(result.thursday).toEqual([
        { createdAt: new Date(2023, 6, 5) },
        { createdAt: new Date(2023, 6, 5) },
      ]);
      expect(result.friday).toEqual([{ createdAt: new Date(2023, 6, 0) }]);
      expect(result.saturday).toEqual([{ createdAt: new Date(2023, 6, 3) }]);
      expect(result.sunday).toEqual([{ createdAt: new Date(2023, 6, 2) }]);
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

    it("should throw an error for an invalid day number", () => {
      const data = [
        { createdAt: new Date(2023, 6, 7) }, // Invalid day number (7)
      ];

      expect(() => {
        sortDataByDay(data);
      }).toThrowError(
        "A number that is not a day was given to the tableData switch"
      );
    });
  });
});
