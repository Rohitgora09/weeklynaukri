export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm shadow-black/[0.02] overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-300 ${hover ? 'hover:shadow-md hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-200' : 'transition-colors duration-200'} ${padding} ${className}`}>
      {children}
    </div>
  );
}
