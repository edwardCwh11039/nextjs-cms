import { Input, Select, Tabs, Row, Col, Spin } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import AppLayout from '../../../../components/layout/layout';
import CourseDetailForm from '../../../../components/course/course-detail';
import CourseChapterForm from '../../../../components/course/course-chapter';
import { debounce } from 'lodash';
import apiServices from '../../../../lib/services/api-services';
import storage from '../../../../lib/services/storage';

const { Option } = Select;

export default function Page() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState('uid');
  const [searchResult, setSearchResult] = useState([]);
  const [course, setCourse] = useState(null);
  const search = useCallback(
    debounce((value) => {
      if (!value) {
        return;
      }
      setIsSearching(true);
      apiServices
        .getCourses(storage.getUserId(), searchBy, value)
        .then((res) => {
          const { data } = res;

          if (!!data) {
            setSearchResult(data.courses);
          }
        })
        .finally(() => setIsSearching(false));
    }, 1000),
    [searchBy]
  );

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={12} style={{ marginLeft: '1em' }}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select defaultValue="uid" onChange={(value) => setSearchBy(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              onSearch={(value) => search(value)}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);

                setCourse(course);
              }}
            >
              {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        type="card"
        size="large"
        animated
      >
        <Tabs.TabPane key="course" tab="Course Detail">
          <CourseDetailForm course={course} />
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <CourseChapterForm
            courseId={course?.id}
            scheduleId={course?.scheduleId}
            isAdd={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </AppLayout>
  );
}
