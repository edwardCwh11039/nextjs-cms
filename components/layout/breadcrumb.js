import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import storage from '../../lib/services/storage';

const AppBreadCrumb = () => {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').splice(3);
  const root = '/' + path.split('/').splice(1).slice(0, 2).join('/');
  const role = storage.getRole() || path.split('/')[2];

  // useEffect(() => {
  //   console.log(paths);
  //   console.log(root);
  // }, []);

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${role.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {paths.map((path) => {
        if (paths.length == 0) {
          return <Breadcrumb.Item key={'detail'}>Detail</Breadcrumb.Item>;
        }
        return <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
};

export default AppBreadCrumb;
