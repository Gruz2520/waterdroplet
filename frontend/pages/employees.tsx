import Employees from '@/components/Employees/Employees';
import ProtectedRoute from '@/hok/protectedRoute/ProtectedRoute';

export default function Docs() {
  return (
    <ProtectedRoute
      metaKeyWords='Сотрудники'
      title='Сотрудники'
      withForm={false}
    >
      <Employees />
    </ProtectedRoute>
  );
}
