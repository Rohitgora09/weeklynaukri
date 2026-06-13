import { Loader2 } from 'lucide-react';

export default function Spinner({ className = '', size = 'md', color = 'text-blue-900', label = 'Loading' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <Loader2 
      className={`animate-spin shrink-0 ${selectedSize} ${color} ${className}`} 
      role="status" 
      aria-label={label}
    />
  );
}
