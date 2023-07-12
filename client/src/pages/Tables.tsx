import Table from "../components/Table";
import { TableCell, TableHeading } from "../styles/twTable";
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
  totalCosts: UserCosts;
  totalHours: UserHours;
};

const isFetchTableDataValid = (
  unknownData: unknown
): unknownData is TableData => {
  const dataFromDB = unknownData as TableData;
  return (
    dataFromDB !== undefined &&
    dataFromDB.totalCosts !== undefined &&
    dataFromDB.totalHours !== undefined &&
    dataFromDB.weeklyData !== undefined
  );
};

const Tables = () => {
  const { data, error, isLoading } = useSWR(`/table-data/fetchTableData`);

  if (error) return <h2>Failed to load table data</h2>;

  if (isLoading) return <h3>loading...</h3>;

  if (!isFetchTableDataValid(data)) {
    console.error(`The structure of fetchTableData is not expected - ${data}`);
    return <h2>There was an Error</h2>;
  }

  const days = Object.keys(data.weeklyData);
  const names = Object.keys(data.totalCosts);

  console.log(days);

  const tableProps = {
    weeklyData: data.weeklyData,
    totalHours: data.totalHours,
    totalCosts: data.totalCosts,
    days,
    names,
  };

  console.log(tableProps);

  return (
    <div className="table-container">
      <h2>Current Table</h2>
      <Table tableProps={tableProps} />
      <h2>Previous Table</h2>
      <Table tableProps={tableProps} />
    </div>
  );
};

export default Tables;
