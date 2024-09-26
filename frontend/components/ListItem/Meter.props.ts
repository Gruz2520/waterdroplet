import { ColumnSearchData, IMeter } from '@/models/models';

export interface IMeterProps {
  item: IMeter;
  susp: boolean;
  query?: ColumnSearchData;
}
