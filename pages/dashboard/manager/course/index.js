import { Button, List, BackTop, Spin } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppLayout from '../../../../components/layout/layout';
import apiServices from '../../../../lib/services/api-services';
import storage from '../../../../lib/services/storage';
import CourseOverview from '../../../../components/course/overview';

export default function Page() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollParentRef = useRef(null);

  useEffect(() => {
    apiServices.getCourses(page).then((res) => {
      const { courses, total } = res.data;
      setTotal(total);
      setData(courses);
      console.log(res.data);
    });
  }, []);

  const fetchData = (page) => {
    console.log(data);
    console.log(page);
    setPage(page);
    apiServices.getCourses(page).then((res) => {
      const { courses } = res.data;
      console.log(data);
      const course = data.concat(courses);
      setData(course);
      console.log(res.data);
    });
  };

  return (
    <AppLayout>
      <div ref={scrollParentRef}>
        <InfiniteScroll
          dataLength={total}
          next={() => {
            fetchData(page + 1);
          }}
          hasMore={hasMore}
          loader={
            <div
              style={{
                position: 'relative',
                left: '50%',
                marginTop: '10px',
              }}
            >
              <Spin size="large" />
            </div>
          }
          endMessage={
            <div
              style={{
                position: 'relative',
                left: '50%',
                marginTop: '10px',
              }}
            >
              No more Course!
            </div>
          }
          scrollableTarget="contentLayout"
          style={{ overflow: 'hidden' }}
        >
          <List
            rowKey="courseList"
            id="courseList"
            grid={{
              gutter: 14,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <CourseOverview {...item}>
                  <Link
                    href={`/dashboard/${storage.getRole()}/course/${item.id}`}
                    passHref
                  >
                    <Button type="primary">Read More</Button>
                  </Link>
                </CourseOverview>
              </List.Item>
            )}
          ></List>
        </InfiniteScroll>
        <BackTop target={() => document.getElementById('contentLayout')} />
      </div>
    </AppLayout>
  );
}
