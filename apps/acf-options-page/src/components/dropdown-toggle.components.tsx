import React, { PropsWithChildren } from 'react';
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu

export type DropdownToggleProps = PropsWithChildren<{
  onClick: (e: Event) => void;
  className?: string;
}>;

export type DropdownToggleRef = HTMLButtonElement;

export const DropdownToggle = React.forwardRef<DropdownToggleRef, DropdownToggleProps>(({ children, onClick, className, ...args }, ref) => {
  const DropdownToggleOnclick = (e) => {
    e.preventDefault();
    onClick(e);
  };

  return (
    <button type='button' {...args} className={`btn border-0 ${className?.replace('dropdown-toggle', '')}`} data-toggle='dropdown' ref={ref} onClick={DropdownToggleOnclick}>
      {children}
    </button>
  );
});
