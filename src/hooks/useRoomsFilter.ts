
import { useState } from 'react';

export function useRoomsFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterValue('all');
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    clearFilters
  };
}
