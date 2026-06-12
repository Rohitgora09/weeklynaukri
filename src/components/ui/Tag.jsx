export default function Tag({ children, color = 'blue', className = '' }) {
  const colorClasses = {
    purple: 'text-purple-700 bg-purple-50 border border-purple-100',
    green: 'text-green-700 bg-green-50 border border-green-100',
    orange: 'text-orange-700 bg-orange-50 border border-orange-100',
    blue: 'text-blue-700 bg-blue-50 border border-blue-100',
    amber: 'text-amber-700 bg-amber-50 border border-amber-100',
    red: 'text-red-700 bg-red-50 border border-red-100',
    gray: 'text-gray-700 bg-gray-50 border border-gray-100'
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold leading-4 tracking-wide uppercase shrink-0 ${selectedColor} ${className}`}>
      {children}
    </span>
  );
}
