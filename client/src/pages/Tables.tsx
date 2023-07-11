import { useState } from "react";
import "./css/table.css";

type UserCosts = {
  [key: string]: {
    costs: number;
  };
};

type UserHours = {
  [key: string]: {
    hours: number;
  };
};

export type MappedWeeklyData = {
  [k: string]: (
    | {
        _id: string;
        name: string;
        createdAt: Date;
        costs: number;
        hours: number;
      }
    | undefined
  )[];
};

type TableData = {
  weeklyData: MappedWeeklyData[];
  costs: UserCosts;
  hours: UserHours;
};

const Tables = async () => {
  const [tableData, setTableData] = useState<TableData>();

  try {
    const response = await fetch(`/table-data/fetchTableData`);

    if (!response.ok) {
      throw new Error(
        `This is an HTTP error fetching the table data: The status is ${response.status}`
      );
    }

    const dbData = await response.json();

    setTableData(dbData);
  } catch (error) {
    console.error("An error occurred while fetching the feed:", error);
  }

  return (
    <>
      <h1>TABLES</h1>
      <div className="App">
        <table>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
          {tableData &&
            tableData.weeklyData.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
              );
            })}
        </table>
      </div>
    </>
  );
};

export default Tables;
