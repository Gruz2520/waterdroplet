import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';



export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  cn?: string;
  type?: string;
  useFor?: string;
  classN?: string;
}

