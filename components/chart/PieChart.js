import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function PieChart({ data, title }) {
  const [option, setOption] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat:
        '{series.name}: <b>{point.percentage:.1f}%</b> <br> total: {point.y}',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const pieSource = data.map((type) => ({ name: type.name, y: type.amount }));
    setOption({
      title: { text: `<span>${title}</span>` },
      subtitle: {
        text: `${title.split(' ')[0]} total: ${pieSource.reduce(
          (accumulator, currentValue) => accumulator + currentValue.y,
          0
        )}`,
      },
      series: [{ name: 'percentage', colorByPoint: true, data: pieSource }],
    });
  }, [data]);

  return <HighchartsReact Highcharts={Highcharts} options={option} />;
}
