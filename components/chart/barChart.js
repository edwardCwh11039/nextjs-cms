import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { levels } from '../../lib/constant/config';

export default function BarChart({ data }) {
  const [option, setOption] = useState({
    chart: {
      type: 'column',
    },

    title: {
      text: 'Student vs Teacher',
    },

    subTitle: {
      text: "Comparing what students are interested in and teachers' skills",
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Interested vs Skills',
      },
    },

    tooltip: {
      formatter: function () {
        return this.series.name === 'Interest'
          ? this.series.name + ': ' + this.y
          : '<b>' +
              this.x +
              '</b><br/>' +
              this.series.name +
              ': ' +
              this.y +
              '<br/>' +
              'Total: ' +
              this.point.stackTotal;
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },

    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => item === undefined)) {
      return;
    }

    const { skill, interest } = data;
    const skillCategories = Object.keys(skill);
    const interestCategories = interest.map((item) => item.name);
    const categories = skillCategories.concat(
      interestCategories.filter((value) => !skillCategories.includes(value))
    );

    const interests = {
      name: 'Interest',
      stack: 'interest',
      data: categories.map((key) => {
        const target = interest.find((item) => item.name === key);

        return target ? target.amount : 0;
      }),
    };

    const skills = new Array(5).fill({}).map((_, index) => {
      const level = index + 1;
      const skillData = categories.map((category) => {
        const data = Object.entries(skill).find(([key, value]) => {
          return category === key;
        });
        const target = !!!data
          ? 0
          : data[1].find((item) => item.level === level);
        return !!!target ? 0 : target.amount;
      });
      return { name: levels[index], stack: 'skill', data: skillData };
    });

    setOption({
      xAxis: { categories: categories },
      series: skills.concat(interests),
    });
  }, [data]);

  return <HighchartsReact Highcharts={Highcharts} options={option} />;
}
