export function BigNumber({ label, value, unit, color = 'text-cyan-400', size = 'large' }) {
  const sizeClasses = size === 'large'
    ? 'text-6xl md:text-7xl'
    : 'text-4xl md:text-5xl';

  const formattedValue = value !== null && value !== undefined
    ? typeof value === 'number' ? value.toFixed(1) : value
    : '--';

  return (
    <div className="flex flex-col items-center p-4">
      <span className="text-slate-400 text-sm uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className={`${sizeClasses} font-bold ${color} tabular-nums`}>
        {formattedValue}
        <span className="text-2xl ml-1 text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
