import { LayoutGrid, List, Plus } from 'lucide-react'

import { cn } from '#/lib/utils'

export type AssetCategory =
  | 'All assets'
  | 'Solar'
  | 'Battery'
  | 'EV'
  | 'Charger'
  | 'Flex loads'

const CATEGORIES: Array<AssetCategory> = [
  'All assets',
  'Solar',
  'Battery',
  'EV',
  'Charger',
  'Flex loads',
]

export interface AssetFilterBarProps {
  category: AssetCategory
  onCategoryChange: (category: AssetCategory) => void
  deviceCount: number
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  onAddAsset?: () => void
}

export function AssetFilterBar({
  category,
  onCategoryChange,
  deviceCount,
  view,
  onViewChange,
  onAddAsset,
}: AssetFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4">
      <div className="inline-flex rounded-xl bg-bg-overlay p-0.5 text-xs font-semibold">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            className={cn(
              'rounded-[10px] px-2.5 py-1.5 transition',
              c === category
                ? 'bg-bg-surface text-text-primary shadow-sm'
                : 'text-text-disabled hover:text-text-secondary',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <select
        aria-label="Sort assets"
        className="h-[30.5px] rounded-xl border border-border-subtle bg-bg-surface px-2.5 text-xs font-medium text-text-secondary"
      >
        <option>Sort by name</option>
        <option>Sort by output</option>
        <option>Sort by status</option>
      </select>

      <span className="text-xs text-text-disabled">{deviceCount} devices</span>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-xl bg-bg-overlay p-0.5">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
            className={cn(
              'flex size-7 items-center justify-center rounded-[10px] transition',
              view === 'grid'
                ? 'bg-bg-surface text-text-primary shadow-sm'
                : 'text-text-disabled hover:text-text-secondary',
            )}
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            aria-label="List view"
            className={cn(
              'flex size-7 items-center justify-center rounded-[10px] transition',
              view === 'list'
                ? 'bg-bg-surface text-text-primary shadow-sm'
                : 'text-text-disabled hover:text-text-secondary',
            )}
          >
            <List className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onAddAsset}
          className="inline-flex h-[30.5px] items-center gap-1.5 rounded-xl bg-brand-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-brand-primary/90"
        >
          <Plus className="size-3.5" />
          Add asset
        </button>
      </div>
    </div>
  )
}