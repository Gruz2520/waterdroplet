import { InputProps } from './Input.props';
import s from './Input.module.scss';
import cn from 'classnames';

export default function Input(props: InputProps) {
  const { value, onChange, classN, useFor = 'contactForm' } = props;
  return (
    <input
      className={cn(classN && [classN], s.input, useFor && s[useFor])}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
