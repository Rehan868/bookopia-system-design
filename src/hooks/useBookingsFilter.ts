
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export function useBookingsFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterValue('all');
    setDateRange(undefined);
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    dateRange,
    setDateRange,
    clearFilters
  };
}
