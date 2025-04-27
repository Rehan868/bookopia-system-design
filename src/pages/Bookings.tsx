
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookingList } from '@/components/bookings/BookingList';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { SearchAndFilter } from '@/components/ui/SearchAndFilter';
import { DateRange } from 'react-day-picker';
import { useBookingsFilter } from '@/hooks/useBookingsFilter';

export default function Bookings() {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const { searchQuery, setSearchQuery, filterValue, setFilterValue, dateRange, setDateRange, clearFilters } = useBookingsFilter();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all your bookings in one place</p>
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link to="/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Booking
          </Link>
        </Button>
      </div>

      <SearchAndFilter
        searchPlaceholder="Search bookings..."
        filterOptions={[
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'checked-in', label: 'Checked In' },
          { value: 'checked-out', label: 'Checked Out' },
          { value: 'cancelled', label: 'Cancelled' },
          { value: 'pending', label: 'Pending' }
        ]}
        filterLabel="Status"
        showDateFilter={true}
        onSearch={setSearchQuery}
        onFilter={setFilterValue}
        onDateRangeChange={setDateRange}
        onClearFilters={clearFilters}
      />

      <BookingList 
        view={view} 
        onViewChange={setView}
        searchQuery={searchQuery}
        filterValue={filterValue}
        dateRange={dateRange}
      />
    </div>
  );
}
