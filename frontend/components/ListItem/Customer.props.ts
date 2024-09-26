import { ColumnSearchData, ICustomer } from '@/models/models';

export interface ICustomerProps {
  customer: ICustomer;
  query?: ColumnSearchData;
}
