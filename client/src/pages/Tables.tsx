import "./css/table.css";
import useSWR from "swr";

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

type CellData = {
  _id: string;
  name: string;
  createdAt: Date;
  costs: number;
  hours: number;
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

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th>Total Hours</th>
            <th>Total Costs</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr key={name}>
              <td>{name}</td>
              {days.map((day) => {
                const cellData = data.weeklyData[day].find(
                  (item: CellData) => item.name === name
                );
                return (
                  <td key={`${name}-${day}`}>
                    {cellData ? (
                      <>
                        <div>Hours: {cellData.hours}</div>
                        <div>Costs: {cellData.costs}</div>
                      </>
                    ) : null}
                  </td>
                );
              })}
              <td>{data.totalHours[name]?.hours}</td>
              <td>{data.totalCosts[name]?.costs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
