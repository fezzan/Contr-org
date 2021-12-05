import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { connect } from 'react-redux';
import { getTasks } from '../../redux/actions/task';

const TaskGraph = ({ getTasks, role, list }) => {
  const [charts, setCharts] = useState([]);
  useEffect(() => {
    getTasks(role);
    return () => {};
  }, []);
  useEffect(() => {
    const groupByProjects = list.reduce((result, task) => {
      result[task?.project?._id] = result[task?.project?._id] || [];
      result[task?.project?._id].push({
        status: task.status,
        name: task?.project?.name,
      });
      return result;
    }, {});

    const counts = Object.values(groupByProjects).map((val) =>
      val.reduce((result, val) => {
        result[val.status] = result[val.status] ? ++result[val.status] : 1;
        return { ...result, name: val.name };
      }, {})
    );

    setCharts([...counts]);
    // const ch = Object.values(groupByProjects)[0].reduce((result, status) => {
    //   result[status] = result[status] ? ++result[status] : 1;
    //   return result;
    // }, {});

    console.log({ groupByProjects, counts });
    return () => {};
  }, [list]);
  //   useEffect(() => {
  //     setChart({
  //       ...chart,
  //       todo: list.reduce(
  //         (total, { status }) => (status === 'To do' ? total + 1 : total),
  //         0
  //       ),
  //       inp: list.reduce(
  //         (total, { status }) => (status === 'In Progress' ? total + 1 : total),
  //         0
  //       ),
  //       comp: list.reduce(
  //         (total, { status }) => (status === 'Completed' ? total + 1 : total),
  //         0
  //       ),
  //     });
  //     return () => {};
  //   }, [list]);
  return (
    <>
      {charts.map((chart) => (
        <Card
          title={`${chart.name.toUpperCase()} - Tasks`}
          hoverable
          className='mb-5'
        >
          <Chart
            width={'100%'}
            height={'100%'}
            chartType='PieChart'
            loader={<div>Loading Chart</div>}
            data={[
              ['Projects', 'Statuses'],
              ['To do', chart['To do'] || 0],
              ['In Progress', chart['In Progress'] || 0],
              ['Completed', chart['Completed'] || 0],
            ]}
            options={{
              title: 'Projects Status',
              // Just add this option
              is3D: true,
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </Card>
      ))}
    </>
  );
};

const mapStateToProps = ({
  user: { user: { role } = {} },
  task: { list },
}) => ({
  role,
  list,
});
export default connect(mapStateToProps, { getTasks })(TaskGraph);

//send later
// const getValue = (str) => {
//   const arr = str.split('');
//   arr.reverse();
//   return arr.reduce(
//     (value, val, i) => value + (val.charCodeAt(0) - 64) * Math.pow(26, i),
//     0
//   );
// };

// const query = `SELECT dateofTravel AS 'Month', country AS 'Country', COUNT(*) AS 'Count' FROM travel GROUP BY country;`;
