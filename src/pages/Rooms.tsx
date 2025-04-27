
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { SearchAndFilter } from '@/components/ui/SearchAndFilter';
import { RoomList } from '@/components/rooms/RoomList';
import { useRoomsFilter } from '@/hooks/useRoomsFilter';

export default function Rooms() {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const { searchQuery, setSearchQuery, filterValue, setFilterValue, clearFilters } = useRoomsFilter();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage all properties and rooms</p>
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link to="/rooms/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Link>
        </Button>
      </div>

      <SearchAndFilter
        searchPlaceholder="Search rooms..."
        filterOptions={[
          { value: 'available', label: 'Available' },
          { value: 'occupied', label: 'Occupied' },
          { value: 'maintenance', label: 'Maintenance' },
          { value: 'cleaning', label: 'Cleaning' }
        ]}
        filterLabel="Status"
        onSearch={setSearchQuery}
        onFilter={setFilterValue}
        onClearFilters={clearFilters}
      />

      <RoomList 
        view={view} 
        onViewChange={setView}
        searchQuery={searchQuery}
        filterValue={filterValue}
      />
    </div>
  );
}
