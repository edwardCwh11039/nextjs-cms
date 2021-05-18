import { useRouter } from 'next/router';
import storage from '../services/storage';
import { deepSearchRecordFactory } from './deepSearch';

export const generateKey = (data, index) =>
  `${data.label}_${data.path}_${index}`;

const generatePath = (data) => data.path;

const generateFactory = (fn, data, current = '') => {
  const keys = data.map((item, index) => {
    let key = fn(item, index);
    if (current) {
      key = [current, key].join('/');
    }

    if (item.subNav && !!item.subNav.length) {
      return generateFactory(fn, item.subNav, key);
    } else {
      return [key];
    }
  });

  return keys.flat();
};

const getKeyPathInfo = (data) => {
  const { pathname } = useRouter();
  const role = storage.getRole() || pathname.split('/')[2];
  const paths = generateFactory(generatePath, data).map((item) =>
    ['/dashboard', role, item].join('/')
  );
  const keys = generateFactory(generateKey, data);

  return { paths, keys };
};

const isDetailPath = (path) => {
  const paths = path.split('/');
  const reg = /\[id\]/;

  return reg.test(paths[paths.length - 1]);
};

const isPathEqual = (paths, target) =>
  paths.findIndex((path) => {
    path = path.endsWith('/') ? path.slice(0, -1) : path;

    return path === target;
  });

export const getActiveKeyPath = (data) => {
  const { pathname } = useRouter();
  const isDetail = isDetailPath(pathname); // true / false
  const path = isDetail
    ? pathname.slice(0, pathname.lastIndexOf('/'))
    : pathname; // dashboard/manager/student/[id] ==> dashboard/manager/student
  const { paths, keys } = getKeyPathInfo(data);
  const index = isPathEqual(paths, path);
  const activePath = paths[index]
    .split('/')
    .slice(2)
    .filter((item) => item !== '');
  const activeKey = keys[index] || '';

  return { activePath, activeKey };
};

const getPathAndName = (data, index, hasSub, current = '') => {
  const nav = data[data.length + index[0]];
  let key = current ? [current, nav.path].join('/') : nav.path;

  //   if (nav.subNav && !!nav.subNav.length && index.length > 1) {
  //     return getPathAndName(nav.subNav, index.slice(1), key);
  //   } else {
  //     if (nav.subNav && !!nav.subNav.length) {
  //       return [
  //         { name: nav.label },
  //         { name: nav.subNav.find((item) => item.path === '').label, path: key },
  //       ];
  //     } else {
  //       return { name: nav.label, path: key };
  //     }
  //   }
  if (index.length > 1) {
    return getPathAndName(nav.subNav, index.slice(1), hasSub, key);
  } else {
    if (nav.subNav && !!nav.subNav.length && !hasSub) {
      return [
        { name: nav.label },
        {
          name: nav.subNav.find((item) => item.path === '').label,
          path: key,
        },
      ];
    } else {
      return [{ name: nav.label, path: key }];
    }
  }
};

export const getPathByName = (roleRoute, name, hasSub) => {
  const { pathname } = useRouter();
  const isDetail = isDetailPath(pathname); // true / false
  const records = deepSearchRecordFactory(
    (data, value) => data.path === value,
    name,
    'subNav'
  )(roleRoute);
  const route = getPathAndName(roleRoute, records, hasSub);

  return isDetail ? [...route, { name: 'Detail' }] : route;
};
