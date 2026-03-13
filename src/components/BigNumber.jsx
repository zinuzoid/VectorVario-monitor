export function BigNumber({ label, value, unit, color = 'text-cyan-400', size = 'large' }) {
  const sizeClasses = size === 'large'
    ? 'text-3xl sm:text-5xl md:text-7xl'
    : 'text-2xl sm:text-3xl md:text-5xl';

  const formattedValue = value !== null && value !== undefined
    ? typeof value === 'number' ? value.toFixed(1) : value
    : '--';

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 min-w-0">
      <span className="text-slate-400 text-sm uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className={`${sizeClasses} font-bold ${color} tabular-nums truncate max-w-full`}>
        {formattedValue}
        <span className="text-xs sm:text-lg md:text-2xl ml-1 text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
