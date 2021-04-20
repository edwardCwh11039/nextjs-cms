import { Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';

const NumberWithUnit = ({ value = {}, onChange, options, defaultUnit }) => {
  const [number, setNumber] = useState(value.number);
  const [unit, setUnit] = useState(value.unit || defaultUnit);
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({ number, unit, ...value, ...changedValue });
    }
  };
  const onNumberChange = (newNumber) => {
    if (Number.isNaN(number)) {
      return;
    }

    if (!('number' in value)) {
      setNumber(newNumber);
    }

    triggerChange({ number: newNumber });
  };
  const onUnitChange = (newUnit) => {
    if (!('unit' in value)) {
      setUnit(newUnit);
    }

    triggerChange({ unit: newUnit });
  };

  return (
    <Input.Group compact style={{ display: 'flex' }}>
      <InputNumber
        value={value.number || number}
        onChange={onNumberChange}
        style={{ flex: 1 }}
      />

      <Select value={value.unit || unit} onChange={onUnitChange}>
        {Object.keys(options).map((key) => (
          <Select.Option value={key} key={key}>
            {options[key]}
          </Select.Option>
        ))}
      </Select>
    </Input.Group>
  );
};

export default NumberWithUnit;
