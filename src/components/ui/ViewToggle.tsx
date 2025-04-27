
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as 'grid' | 'list')}>
      <ToggleGroupItem value="list" aria-label="List view">
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
