import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";
import type { TradeSide } from "./types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function SidePill({ side }: { side: TradeSide }) {
  return side === 'sell' ? (
    <Badge variant={"default"}>
      <ArrowUpRight size={9} />
      Sell
    </Badge>
  ) : (
    <Badge variant={"destructive"}>
      <ArrowDownLeft size={9} />
      Sell
    </Badge>
  )
}

export function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: Array<{ v: string; l: string }>
}) {
  const selected = options.find((option) => option.v === value)

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next)
      }}
    >
      <SelectTrigger aria-label={label}>
        <SelectValue>{selected?.l}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.v} value={option.v}>
              {option.l}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}