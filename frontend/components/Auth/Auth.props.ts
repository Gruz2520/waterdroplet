import { AccountType } from '@/models/models';

export interface IAuthProps {
  onNameChange: (e: string) => void;
  onPasswordChange: (e: string) => void;
  onSubmit: (e: any, accountType: AccountType) => Promise<void>;
}
