import {
  DashboardOutlined,
  EditTwoTone,
  FileAddOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const overview = {
  path: '',
  label: 'Overview',
  icon: <DashboardOutlined />,
};

const students = {
  path: 'student',
  label: 'Student',
  icon: <SolutionOutlined />,
  subNav: [{ path: '', label: 'Student List', icon: <TeamOutlined /> }],
};

const courses = {
  path: 'course',
  label: 'Course',
  icon: <ReadOutlined />,
  subNav: [
    { path: '', label: 'All Courses', icon: <ProjectOutlined /> },
    { path: 'add-course', label: 'Add Course', icon: <FileAddOutlined /> },
    { path: 'edit-course', label: 'Edit Course', icon: <EditTwoTone /> },
  ],
};

export const Routes = {
  // [ role : [route] ]
  manager: [overview, students, courses],
  teacher: [overview],
  student: [overview],
};
