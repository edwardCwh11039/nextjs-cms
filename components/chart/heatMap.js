import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { weekDays } from '../../lib/constant/config';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/heatmap')(Highcharts);
  require('highcharts/modules/exporting')(Highcharts);
}
//   require('highcharts/modules/exporting')(Highcharts);
//   require('highcharts/modules/export-data')(Highcharts);
//   require('highcharts/modules/accessibility')(Highcharts);

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === 'y',
    axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
}

export default function HeatMap({ data }) {
  const [options, setOptions] = useState({
    chart: {
      type: 'heatmap',
      plotBorderWidth: 1,
    },

    title: {
      text: 'Course Schedule Per Weekday',
    },

    xAxis: {
      categories: [...weekDays, 'TOTAL'],
    },

    accessibility: {
      point: {
        descriptionFormatter: function (point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, 'x'),
            yName = getPointCategoryName(point, 'y'),
            val = point.value;
          return ix + '. ' + xName + ' lessons ' + yName + ', ' + val + '.';
        },
      },
    },

    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#1890ff',
    },

    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280,
    },

    tooltip: {
      formatter: function () {
        return (
          '<b>' +
          getPointCategoryName(this.point, 'y') +
          '</b><br><b>' +
          this.point.value +
          '</b> lessons on <br><b>' +
          getPointCategoryName(this.point, 'x') +
          '</b>'
        );
      },
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                },
              },
            },
          },
        },
      ],
    },

    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => item === undefined)) {
      return;
    }

    const categories = data.map((value) => value.name).concat('TOTAL');

    const array = data
      .map((item, index) => {
        const courses = item.courses
          .map((course) => course.classTime)
          .flat()
          .map((time) => time?.split(' ')[0]);

        const array = weekDays.map((weekday, i) => {
          const count = courses.filter((day) => weekday === day).length;

          return [i, index, count];
        });

        return array;
      })
      .flat();

    const xTotal = data.map((_, index) => {
      const total = array
        .filter((item) => item[1] === index)
        .map((item) => item[2])
        .reduce((acc, cur) => acc + cur, 0);

      return [weekDays.length, index, total];
    });

    const yTotal = weekDays.map((_, index) => {
      const total = array
        .filter((item) => item[0] === index)
        .map((item) => item[2])
        .reduce((acc, cur) => acc + cur, 0);

      return [index, data.length, total];
    });

    const total = xTotal
      .map((item) => item[2])
      .reduce((acc, cur) => acc + cur, 0);

    const allTotal = [weekDays.length, categories.length - 1, total];
    const heatSource = array.concat(xTotal, yTotal, [allTotal]);

    setOptions({
      yAxis: {
        categories: categories,
        title: null,
        reversed: true,
      },
      series: [
        {
          name: 'Lessons per weekday',
          borderWidth: 1,
          data: heatSource,
          dataLabels: { enabled: true, color: '#000000' },
        },
      ],
    });
  }, [data]);

  return <HighchartsReact Highcharts={Highcharts} options={options} />;
}
