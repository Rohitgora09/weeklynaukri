import JobCard from './JobCard';
import Card from '../ui/Card';

export default function JobList({
  title,
  subtitle,
  icon: Icon,
  items = [],
  variant = 'grid', // 'grid', 'list', 'private'
  color = 'bg-blue-500',
  limit = 10,
  emptyText = 'No active listings found.'
}) {
  const displayedItems = items.slice(0, limit);

  return (
    <Card padding="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex-1">
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-gray-400">{emptyText}</p>
          </div>
        ) : variant === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedItems.map((item, idx) => (
              <JobCard
                key={item.id || idx}
                variant={variant}
                {...item}
              />
            ))}
          </div>
        ) : (
          <div className={variant === 'private' ? "space-y-1" : "space-y-0 divide-y divide-gray-100"}>
            {displayedItems.map((item, idx) => (
              <JobCard
                key={item.id || idx}
                variant={variant}
                {...item}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
