import { Button, List, BackTop, Spin } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import AppLayout from '../../../../components/layout/layout';
import apiServices from '../../../../lib/services/api-services';
import storage from '../../../../lib/services/storage';
import CourseOverview from '../../../../components/course/overview';

export default function Page() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiServices.getCourses(page).then((res) => {
      const { courses } = res.data;
      if (courses.length < 20) {
        setHasMore(false);
      }
      const course = data.concat(courses);
      setData(course);
      setLoading(false);
    });
  }, [page]);

  return (
    <AppLayout>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            console.log('loadmore-----', page);
            setLoading(true);
            setPage(++page);
          }}
          hasMore={!loading && hasMore}
          loader={
            <div
              style={{
                position: 'relative',
                left: '50%',
                marginTop: '10px',
                transfrom: 'translateX(50%)',
              }}
            >
              <Spin size="large" />
            </div>
          }
          useWindow={false}
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
    </AppLayout>
  );
}
