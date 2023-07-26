import Table from "../components/Table";
import "../styles/table.css";
import useSWR from "swr";

export type CellData = {
  _id: string;
  name: string;
  createdAt: Date;
  costs: number;
  hours: number;
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

export type MappedWeeklyData = {
  [k: string]: (CellData | undefined)[];
};

type TableData = {
  weeklyData: MappedWeeklyData[];
  overallCosts: UserCosts;
  overallHours: UserHours;
};

const isFetchTableDataValid = (
  unknownData: unknown
): unknownData is TableData[] => {
  const dataFromDB = unknownData as TableData[];
  return dataFromDB !== undefined && Array.isArray(dataFromDB);
};

const Tables = () => {
  const { data, error, isLoading } = useSWR(`/table-data/fetchTableData`);

  if (error) return <h2>Failed to load table data</h2>;

  if (isLoading) return <h3>loading...</h3>;

  if (!isFetchTableDataValid(data)) {
    console.error(`The structure of fetchTableData is not expected - ${data}`);
    return <h2>There was an Error</h2>;
  }

  const weeklyTableProps = data.map((tableData) => {
    const days = Object.keys(tableData.weeklyData);
    const names = Object.keys(tableData.overallCosts);

    return {
      weeklyData: tableData.weeklyData,
      totalHours: tableData.overallHours,
      totalCosts: tableData.overallCosts,
      days,
      names,
    };
  });

  return (
    <div className="table-container">
      <h2>Current Table</h2>
      <Table tableProps={weeklyTableProps[1]} />
      <h2>Previous Table</h2>
      <Table tableProps={weeklyTableProps[0]} />
    </div>
  );
};

export default Tables;
