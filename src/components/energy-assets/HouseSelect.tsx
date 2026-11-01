import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { House } from '#/features/iot/api';
import { gridLabel } from '#/features/iot/view-model';

/** Lets owners of more than one house choose which one the page shows. */
export function HouseSelect({
  houses,
  value,
  onChange,
}: {
  houses: Array<House>;
  value?: string;
  onChange: (houseId: string) => void;
}) {
  if (houses.length < 2) return null;

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (typeof next === 'string') onChange(next);
      }}
    >
      <SelectTrigger aria-label="Choose house" className="w-full sm:w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {houses.map((house) => (
            <SelectItem key={house.houseId} value={house.houseId}>
              {house.houseId} · {gridLabel(house)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
