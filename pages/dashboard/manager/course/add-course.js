import { Steps } from 'antd';
import React, { useState } from 'react';
import AppLayout from '../../../../components/layout/layout';
import AddCourse from '../../../../components/course/add-course';

const { Step } = Steps;

export default function Page() {
  const [step, setStep] = useState(0);
  const steps = [<AddCourse></AddCourse>, <p>hi2</p>];

  return (
    <AppLayout>
      <Steps
        current={step}
        type="navigation"
        onChange={(current) => {
          setStep(current);
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
