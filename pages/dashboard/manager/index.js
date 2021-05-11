import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import StatisticsOverview from '../../../components/chart/overview';
import AppLayout from '../../../components/layout/layout';
import apiServices from '../../../lib/services/api-services';
import dynamic from 'next/dynamic';
import PieChart from '../../../components/chart/PieChart';
import LineChart from '../../../components/chart/lineChart';
import BarChart from '../../../components/chart/barChart';
import HeatMap from '../../../components/chart/heatMap';
import EditableFormControl from '../../../components/editable-form-control';

const Distribution = dynamic(
  () => import('../../../components/chart/distribution'),
  { ssr: false }
);

export default function Page() {
  const [overview, setOverview] = useState(null);
  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [course, setCourse] = useState(null);
  const [distribution, setDistribution] = useState('Student');
  const [type, setType] = useState('student');

  useEffect(() => {
    apiServices.getStatistics('overview').then((res) => {
      setOverview(res.data);
    });
    apiServices.getStatistics('student').then((res) => {
      setStudent(res.data);
    });
    apiServices.getStatistics('teacher').then((res) => {
      setTeacher(res.data);
    });
    apiServices.getStatistics('course').then((res) => {
      setCourse(res.data);
    });
  }, []);

  return (
    <AppLayout>
      {/* <EditableFormControl
        label="Username"
        name="username"
        initialValue={{ username: 'testing' }}
      >
        <Input />
      </EditableFormControl> */}
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
        {/* Distribution Chart - student / teacher */}
        <Col span={12}>
          <Card
            title="Distribution"
            extra={
              <Select
                defaultValue={distribution}
                onSelect={(value) => setDistribution(value)}
              >
                <Select.Option value="Student">Student</Select.Option>
                <Select.Option value="Teacher">Teacher</Select.Option>
              </Select>
            }
          >
            <Distribution
              data={
                distribution === 'Student' ? student?.country : teacher?.country
              }
              title={distribution}
            />
          </Card>
        </Col>

        {/* Pie Chart - Student / Course / Gender */}
        <Col span={12}>
          <Card
            title="Types"
            extra={
              <Select defaultValue={type} onSelect={(value) => setType(value)}>
                <Select.Option value="student">Student Type</Select.Option>
                <Select.Option value="course">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {type === 'student' ? (
              <PieChart data={student?.type} title="Student Type" />
            ) : type === 'course' ? (
              <PieChart data={course?.type} title="Course Type" />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(
                      overview.student.gender
                    ).map(([key, value]) => ({ name: key, amount: value }))}
                    title="Student Gender"
                  />
                </Col>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(
                      overview.teacher.gender
                    ).map(([key, value]) => ({ name: key, amount: value }))}
                    title="Teacher Gender"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                student: student?.createdAt,
                teacher: teacher?.createdAt,
                course: course?.createdAt,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{ interest: student?.interest, skill: teacher?.skills }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[6, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatMap data={course?.classTime} />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
