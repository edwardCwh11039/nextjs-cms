import { Card, Col, Progress, Row } from 'antd';
import { useEffect } from 'react';

export default function StatisticsOverview({ data, title, icon, style }) {
  const percent = ((data.lastMonthAdded / data.total) * 100).toFixed(1);
  
  return (
    <Card style={{ ...style, borderRadius: 10 }}>
      <Row>
        {/* Icon */}
        <Col span={6} className="overview_icon">
          {icon}
        </Col>

        {/* Detail */}
        <Col span={18} className="overview_detail">
          <h3>{title}</h3>
          <h2>{data.total}</h2>
          <Progress
            percent={100 - percent}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p>{`${percent} % Increase in 30 days`}</p>
        </Col>
      </Row>
    </Card>
  );
}
