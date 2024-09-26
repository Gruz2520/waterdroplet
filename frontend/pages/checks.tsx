// import Checks from '@/components/Checks/Checks';
import Logs from '@/components/Logs/Logs';
import ProtectedRoute from '@/hok/protectedRoute/ProtectedRoute';

export default function ChecksPage() {
  return (
    <ProtectedRoute
      metaKeyWords='Сотрудники'
      title='Сотрудники'
      withForm={false}
    >
      <Logs />
    </ProtectedRoute>
  );
}
