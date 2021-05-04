import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import StatisticsOverview from '../../../components/chart/overview';
import AppLayout from '../../../components/layout/layout';
import apiServices from '../../../lib/services/api-services';
import DistributionChart from '../../../components/chart/distribution';
import dynamic from 'next/dynamic';

const Distribution = dynamic(
  () => import('../../../components/chart/distribution'),
  { ssr: false }
);

export default function Page() {
  const [overview, setOverview] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    apiServices.getStatistics('overview').then((res) => {
      setOverview(res.data);
    });
    apiServices.getStatistics('student').then((res) => {
      setStudent(res.data);
    });
  }, []);

  return (
    <AppLayout>
      {overview && (
        <Row gutter={[20, 16]}>
          <Col span={8}>
            <StatisticsOverview
              title="TOTAL STUDENTS"
              icon={<SolutionOutlined />}
              style={{ background: '#1890ff' }}
              data={overview.student}
            />
          </Col>
          <Col span={8}>
            <StatisticsOverview
              title="TOTAL TEACHERS"
              icon={<DeploymentUnitOutlined />}
              style={{ background: '#673bb7' }}
              data={overview.teacher}
            />
          </Col>
          <Col span={8}>
            <StatisticsOverview
              title="TOTAL COURSES"
              icon={<ReadOutlined />}
              style={{ background: '#ffaa16' }}
              data={overview.course}
            />
          </Col>
        </Row>
      )}
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <Card title="Distribution" extra={<a href="#">More</a>}>
            <Distribution data={student} />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
