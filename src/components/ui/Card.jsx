export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.01] overflow-hidden ${hover ? 'hover:shadow-md hover:shadow-black/[0.02] hover:-translate-y-0.5 transition-all duration-200' : ''} ${padding} ${className}`}>
      {children}
    </div>
  );
}
