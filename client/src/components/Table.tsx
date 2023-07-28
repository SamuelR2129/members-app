import { CellData, MappedWeeklyData, UserCosts, UserHours } from '../pages/Tables';
import { TableCell, TableHeading } from '../styles/table';

type TableProps = {
  tableProps: {
    weeklyData: MappedWeeklyData[];
    totalHours: UserHours;
    totalCosts: UserCosts;
    days: string[];
    names: string[];
  };
};

const Table = (props: TableProps) => {
  const { weeklyData, totalCosts, totalHours, days, names } = props.tableProps;

  return (
    <table className="table">
      <thead>
        <tr>
          <TableHeading>Name</TableHeading>
          {days.map((day) => (
            <TableHeading key={day}>{day}</TableHeading>
          ))}
          <TableHeading>Total Hours</TableHeading>
          <TableHeading>Total Costs</TableHeading>
        </tr>
      </thead>
      <tbody>
        {names.map((name) => (
          <tr key={name}>
            <TableCell>{name}</TableCell>

            {days.map((day: string) => {
              const cellData = weeklyData[day].find((item: CellData) => item.name === name);

              return (
                <TableCell key={`${name}-${day}`}>
                  {cellData ? (
                    <>
                      <div>Hours: {cellData.hours}</div>
                      <div>Costs: {cellData.costs}</div>
                    </>
                  ) : null}
                </TableCell>
              );
            })}
            <TableCell>{totalHours[name]?.hours}</TableCell>
            <TableCell>{totalCosts[name]?.costs}</TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
