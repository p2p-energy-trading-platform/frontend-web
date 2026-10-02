import { LayoutGrid, List, Plus } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'

export type AssetCategory =
  'All assets' | 'Solar' | 'Battery' | 'EV' | 'Charger' | 'Flex loads'
export type AssetSort = 'name' | 'output' | 'status'

const CATEGORIES: Array<AssetCategory> = [
  'All assets',
  'Solar',
  'Battery',
  'EV',
  'Charger',
  'Flex loads',
]

const SORT_LABELS: Record<AssetSort, string> = {
  name: 'Sort by name',
  output: 'Sort by output',
  status: 'Sort by status',
}

export interface AssetFilterBarProps {
  category: AssetCategory
  onCategoryChange: (category: AssetCategory) => void
  deviceCount: number
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  sort: AssetSort
  onSortChange: (sort: AssetSort) => void
  onAddAsset?: () => void
}

export function AssetFilterBar({
  category,
  onCategoryChange,
  deviceCount,
  view,
  onViewChange,
  sort,
  onSortChange,
  onAddAsset,
}: AssetFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4">
      <ToggleGroup
        spacing={0}
        variant="outline"
        size="sm"
        aria-label="Asset category"
        value={[category]}
        onValueChange={(values) => {
          const next = values[0]
          if (next) onCategoryChange(next as AssetCategory)
        }}
      >
        {CATEGORIES.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Select
        value={sort}
        onValueChange={(value) => {
          if (value === 'name' || value === 'output' || value === 'status') {
            onSortChange(value)
          }
        }}
      >
        <SelectTrigger aria-label="Sort assets">
          <SelectValue>{SORT_LABELS[sort]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Sort by name</SelectItem>
            <SelectItem value="output">Sort by output</SelectItem>
            <SelectItem value="status">Sort by status</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <span className="text-xs text-text-tertiary">{deviceCount} devices</span>

      <div className="flex items-center gap-2 sm:ml-auto">
        <ToggleGroup
          spacing={0}
          variant="outline"
          size="sm"
          aria-label="Asset layout"
          value={[view]}
          onValueChange={(values) => {
            const next = values[0]
            if (next === 'grid' || next === 'list') onViewChange(next)
          }}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button type="button" size="sm" onClick={onAddAsset}>
          <Plus data-icon="inline-start" />
          Add asset
        </Button>
      </div>
    </div>
  )
}
