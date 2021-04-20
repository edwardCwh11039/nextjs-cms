import { Steps } from 'antd';
import React, { useState } from 'react';
import AppLayout from '../../../../components/layout/layout';
import AddCourse from '../../../../components/course/add-course';

const { Step } = Steps;

export default function Page() {
  const [step, setStep] = useState(0);
  const [availableStep, setAvailableStep] = useState([0]);
  const [courseId, setCourseId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
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
    <p>hi2</p>,
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
