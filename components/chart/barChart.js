import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

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

    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => item === undefined)) {
      return;
    }

    const { skill, interest } = data;
    const skillCategories = Object.keys(skill).map((key) => key);
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


    
    console.log(data, categories);

    setOption({ xAxis: { categories: categories }, series: interests });
  }, [data]);

  return <HighchartsReact Highcharts={Highcharts} options={option} />;
}
