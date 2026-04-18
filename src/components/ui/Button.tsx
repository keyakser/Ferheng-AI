import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium' | 'outline' | 'grainy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-500 font-bold uppercase tracking-widest focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-black/10 hover:shadow-black/20",
    secondary: "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/50",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    premium: "premium-gradient text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]",
    outline: "bg-transparent border-2 border-foreground/10 hover:border-foreground/30 text-foreground",
    grainy: "grainy-blue-gradient text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] border-none"
  };

  const sizes = {
    sm: "px-5 py-2 text-[10px]",
    md: "px-8 py-3.5 text-[11px]",
    lg: "px-10 py-4.5 text-xs",
    xl: "px-12 py-5.5 text-sm"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
