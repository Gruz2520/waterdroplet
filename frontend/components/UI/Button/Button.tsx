import { FC } from 'react';
import cn from 'classnames';
import { ButtonProps } from './Button.types';

import styles from './Button.module.scss';

const Button: FC<ButtonProps> = ({
  children,
  type,
  colorText,
  className,
  colorBkg,
  onClick,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      styles.button,
      type && styles[type],
      colorText && styles[colorText + 'Text'],
      colorBkg && styles[colorBkg + 'Bkg'],
      className && [className]
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default Button;
