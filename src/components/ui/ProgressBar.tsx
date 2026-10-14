interface ProgressBarProps {
  value: number
  max: number
  className?: string
  label?: string
  showPercentage?: boolean
}

/**
 * Accessible progress bar that shows a value as a percentage of a maximum.
 * The bar color changes based on completion percentage.
 */
export function ProgressBar({
  value,
  max,
  className = '',
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const getBarColor = () => {
    if (percentage >= 100) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-emerald-400'
    if (percentage >= 30) return 'bg-amber-400'
    return 'bg-rose-400'
  }

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        {label && <span className="text-slate-600">{label}</span>}
        {showPercentage && (
          <span className="font-semibold text-slate-800">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
