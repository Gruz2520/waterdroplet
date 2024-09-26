import { Dispatch, SetStateAction } from 'react';

export type HeaderProps = {
  onSideBarOpen: Dispatch<SetStateAction<boolean>>;
};
