import Logs from '@/components/Logs/Logs';
import ProtectedRoute from '@/hok/protectedRoute/ProtectedRoute';

export default function MetersPage() {
  return (
    <ProtectedRoute
      metaKeyWords='Показания клиентов'
      title='Показания клиентов'
      withForm={false}
    >
      <Logs />
    </ProtectedRoute>
  );
}
