import { ICheck } from '@/models/models';
import { ColumnSearchData } from '@/models/models';

export interface ICheckProps {
  check: ICheck;
  susp: boolean;
  query?: ColumnSearchData;
}
