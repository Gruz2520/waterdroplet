import ProtectedRoute from '@/hok/protectedRoute/ProtectedRoute';
import Account from '@/components/Account/Account';

export default function AccountPage() {
  return (
    <ProtectedRoute
      metaKeyWords='личный кабинет, личный кабинет пользователя, аккаунт'
      title='Личный кабинет'
      withForm={false}
    >
      <Account />
    </ProtectedRoute>
  );
}
