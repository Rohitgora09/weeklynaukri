export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  loading = false,
  icon: Icon
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-md shadow-black/10 rounded-xl px-5 py-3',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-xl px-5 py-3',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-5 py-3',
    pill: 'bg-black text-white hover:bg-gray-800 rounded-full px-5 py-2.5 text-sm',
    pillOutline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-5 py-2.5 text-sm',
    link: 'text-blue-600 hover:text-blue-800 font-semibold hover:underline bg-transparent p-0 border-none'
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${selectedVariant} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
}
