import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  btnText,
  btnBg,
  btnColor,
  ariaLabel,
  customStyles,
  btnIcon,
  disabled,
  type = 'button',
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={twMerge(
        clsx(
          `w-full hover:brightness-75 py-2 uppercase rounded-md flex justify-center items-center gap-2`,
          btnBg,
          btnColor
        ),
        customStyles
      )}
      aria-label={ariaLabel}
    >
      {btnIcon}
      {btnText}
    </button>
  );
};

export default Button;
