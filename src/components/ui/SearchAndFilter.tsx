
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "./date-picker-with-range";
import { DateRange } from "react-day-picker";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  showDateFilter?: boolean;
  onSearch: (value: string) => void;
  onFilter: (value: string) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onClearFilters: () => void;
}

export function SearchAndFilter({
  searchPlaceholder = "Search...",
  filterOptions = [],
  filterLabel = "Filter by",
  showDateFilter = false,
  onSearch,
  onFilter,
  onDateRangeChange,
  onClearFilters
}: SearchAndFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border mb-4 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-8"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {filterOptions.length > 0 && (
        <div className="flex-initial min-w-[200px]">
          <Select onValueChange={onFilter}>
            <SelectTrigger>
              <SelectValue placeholder={filterLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {showDateFilter && onDateRangeChange && (
        <div className="flex-initial min-w-[240px]">
          <DatePickerWithRange onChange={onDateRangeChange} />
        </div>
      )}
      
      <Button variant="outline" onClick={onClearFilters}>
        Clear
      </Button>
    </div>
  );
}
