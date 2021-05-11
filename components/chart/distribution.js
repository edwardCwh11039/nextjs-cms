import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import apiServices from '../../lib/services/api-services';

export default function DistributionChart({ data, title }) {
  const [options, setOptions] = useState({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#fff'],
        [0.5, Highcharts.getOptions().colors[0]],
        [1, '#1890ff'],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
    },
  });
  const [mapGeo, setMapGeo] = useState(null);

  useEffect(() => {
    apiServices.getWorld().then((res) => {
      setMapGeo(res.data);
      setOptions({ series: [{ mapData: res.data }] });
    });
  }, []);

  useEffect(() => {
    if (!data || !mapGeo) {
      return;
    }

    const mapSource = data.map((country) => {
      const target = mapGeo.features.find(
        (feature) =>
          country.name.toLowerCase() === feature.properties.name.toLowerCase()
      );
      return !!target
        ? { 'hc-key': target.properties['hc-key'], value: country.amount }
        : {};
    });
    setOptions({
      title: {
        text: `<span>${title}</span>`,
      },
      series: [
        {
          data: mapSource,
          mapData: mapGeo,
          name: 'Total',
        },
      ],
    });
  }, [data, mapGeo]);

  return (
    <HighchartsReact
      options={options}
      highcharts={Highcharts}
      constructorType={'mapChart'}
    />
  );
}
