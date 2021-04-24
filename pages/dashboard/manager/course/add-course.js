import { Steps, Result, Button } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '../../../../components/layout/layout';
import AddCourse from '../../../../components/course/add-course';
import CourseChapterForm from '../../../../components/course/course-chapter';
import storage from '../../../../lib/services/storage';

const { Step } = Steps;

export default function Page() {
  const [step, setStep] = useState(0);
  const [availableStep, setAvailableStep] = useState([0]);
  const [courseId, setCourseId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const router = useRouter();
  const nextStep = () => {
    setStep(step + 1);
    setAvailableStep([...availableStep, step + 1]);
  };
  const steps = [
    <AddCourse
      onFinish={(course) => {
        setCourseId(course.id);
        setScheduleId(course.scheduleId);
        nextStep();
      }}
    ></AddCourse>,
    <CourseChapterForm
      courseId={courseId}
      scheduleId={scheduleId}
      onFinish={nextStep}
    ></CourseChapterForm>,
    <Result
      status="success"
      title="Successfully Create Course!"
      extra={[
        <Button
          type="primary"
          key="detail"
          onClick={() =>
            router.push(`/dashboard/${storage.getRole()}/course/${courseId}`)
          }
        >
          Go Course
        </Button>,
        <Button
          key="again"
          onClick={() => {
            router.reload();
          }}
        >
          Create Again
        </Button>,
      ]}
    />,
  ];

  return (
    <AppLayout>
      <Steps
        current={step}
        type="navigation"
        onChange={(current) => {
          if (availableStep.includes(current)) {
            setStep(current);
          }
        }}
        style={{ padding: '1em 1.6%', margin: '20px 0' }}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>

      {steps.map((element, index) => {
        return (
          <div
            key={index}
            style={{ display: index === step ? 'block' : 'none' }}
          >
            {element}
          </div>
        );
      })}
    </AppLayout>
  );
}
