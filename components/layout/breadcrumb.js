import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import storage from '../../lib/services/storage';
import { getPathByName } from '../../lib/util/routes';

const AppBreadCrumb = ({ activePath, roleRoute }) => {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').splice(3);
  const root = '/' + path.split('/').splice(1).slice(0, 2).join('/');
  const role = activePath.splice(0, 1)[0];
  if (activePath.length === 0) {
    activePath.push('');
  }
  const routes = activePath
    .map((item) => getPathByName(roleRoute, item, activePath.length > 1))
    .flat();

  useEffect(() => {
    console.log(paths);
    console.log(activePath);
    console.log(routes);
  }, []);

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={'testing'}>
        <Link href={root}>{`CMS ${role.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {routes.map((route, index) => {
        if (index === routes.length - 1 || index === 0) {
          return (
            <Breadcrumb.Item key={route.name}>{route.name}</Breadcrumb.Item>
          );
        }

        if (!!route.path) {
          return (
            <Breadcrumb.Item key={route.name}>
              <Link href={`${root}/${route.path}`}>{route.name}</Link>
            </Breadcrumb.Item>
          );
        } else {
          return (
            <Breadcrumb.Item key={route.name}>{route.name}</Breadcrumb.Item>
          );
        }
      })}
    </Breadcrumb>
  );
};

export default AppBreadCrumb;
