import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import apiServices from '../../lib/services/api-services';

export default function DistributionChart({ data }) {
  const [options, setOptions] = useState({
    title: {
      text: null,
    },

    mapNavigation: {
      enabled: true,
    },

    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    series: [
      {
        joinBy: ['hc-key', 'key'],
        name: 'Random data',
      },
      {
        type: 'mapline',
        name: 'Separators',
        nullColor: 'gray',
        showInLegend: false,
        enableMouseTracking: false,
      },
    ],
  });

  useEffect(() => {
    apiServices.getWorld().then((res) => {
      console.log(res.data);
      setOptions({ series: [{ mapData: res.data }] });
    });
  }, []);

  useEffect(() => {
    // console.log(data);
    // setOptions({ series: [{ data: data }] });
  }, [data]);

  return (
    <div>
      <HighchartsReact
        options={options}
        highcharts={Highcharts}
        constructorType={'mapChart'}
      />
    </div>
  );
}
