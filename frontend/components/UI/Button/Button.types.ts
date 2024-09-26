import { MouseEventHandler, ReactNode } from 'react';

export interface ButtonProps {
  type: string;
  colorText?: string;
  colorBkg?: string;
  children: ReactNode | string;
  onClick: any;
  className?: string;
}
