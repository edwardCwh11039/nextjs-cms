import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function LineChart({ data }) {
  const [option, setOption] = useState({
    chart: { type: 'line' },
    title: { text: '' },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      title: {
        text: 'Increment',
      },
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => item === undefined)) {
      return;
    }

    const series = Object.entries(data).map(([key, value]) => {
      const currentYear = new Date().getFullYear();
      const lineData = new Array(12).fill(0).map((_, index) => {
        const target = value.find((item) => {
          const date = new Date(item.name);
          
          return (
            date.getFullYear() === currentYear && date.getMonth() === index
          );
        });
        return (target && target.amount) || 0;
      });

      return { name: key, data: lineData };
    });

    setOption({ series: series });
  }, [data]);

  return <HighchartsReact Highcharts={Highcharts} options={option} />;
}
