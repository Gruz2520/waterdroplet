import { ColumnSearchData } from '@/models/models';

export type SearchBlockProps = {
  susp?: boolean;
  onSearchChange: (searchData: ColumnSearchData) => void;
  withoutDate?: boolean
};
