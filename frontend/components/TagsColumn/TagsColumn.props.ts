export type TagsColumnProps = {
  children: any;
  onLoadMore?: () => void;
  onSearchChange?: (any) => void;
  withSearch?: boolean;
  btnDisabled: boolean;
  title: string;
  suspicious?: boolean;
  withoutDate?: boolean;
  totalQty?: number;
  isSearchApplied?: boolean;
};
