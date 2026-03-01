import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {

  
  const baseStyles = "px-6 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50"
  };

  return (
    <button 
    type='submit'
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};