import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { connect } from 'react-redux';
import { getProjects } from '../../redux/actions/project';

const Report = ({ getProjects, role, list }) => {
  const [chart, setChart] = useState({ todo: 0, inp: 0, comp: 0 });
  useEffect(() => {
    getProjects(role);
    return () => {};
  }, []);
  useEffect(() => {
    setChart({
      ...chart,
      todo: list.reduce(
        (total, { status }) => (status === 'To do' ? total + 1 : total),
        0
      ),
      inp: list.reduce(
        (total, { status }) => (status === 'In Progress' ? total + 1 : total),
        0
      ),
      comp: list.reduce(
        (total, { status }) => (status === 'Completed' ? total + 1 : total),
        0
      ),
    });
    return () => {};
  }, [list]);
  return (
    <>
      <Card title='Pie 3D' hoverable className='mb-5'>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType='PieChart'
          loader={<div>Loading Chart</div>}
          data={[
            ['Projects', 'Statuses'],
            ['To do', chart.todo],
            ['In Progress', chart.inp],
            ['Completed', chart.comp],
          ]}
          options={{
            title: 'Projects Status',
            // Just add this option
            is3D: true,
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      </Card>
      <Card title='Donut' hoverable className='mb-5'>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType='PieChart'
          loader={<div>Loading Chart</div>}
          data={[
            ['Projects', 'Statuses'],
            ['To do', chart.todo],
            ['In Progress', chart.inp],
            ['Completed', chart.comp],
          ]}
          options={{
            title: 'Projects Status',
            // Just add this option
            pieHole: 0.4,
          }}
          rootProps={{ 'data-testid': '3' }}
        />
      </Card>
      <Card title='Exploading Pie' hoverable className='mb-5'>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType='PieChart'
          loader={<div>Loading Chart</div>}
          data={[
            ['Projects', 'Statuses'],
            ['To do', chart.todo],
            ['In Progress', chart.inp],
            ['Completed', chart.comp],
          ]}
          options={{
            title: 'Projects Status',
            // Just add this option
            legend: 'none',
            pieSliceText: 'label',
            slices: {
              4: { offset: 0.2 },
              12: { offset: 0.3 },
              14: { offset: 0.4 },
              15: { offset: 0.5 },
            },
          }}
          rootProps={{ 'data-testid': '4' }}
        />
      </Card>
    </>
  );
};

const mapStateToProps = ({
  user: { user: { role } = {} },
  project: { list },
}) => ({
  role,
  list,
});
export default connect(mapStateToProps, { getProjects })(Report);
