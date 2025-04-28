
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOwners } from '@/services/api';
import { Owner } from '@/types/owner';
import OwnerCard from '@/components/owners/OwnerCard';

const Owners = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOwners = async () => {
      try {
        setIsLoading(true);
        const data = await fetchOwners();
        // Convert Supabase Owners to our Owner type
        const typedOwners: Owner[] = data.map(owner => ({
          ...owner,
          id: owner.id.toString(),
          payment_details: owner.payment_details || {}
        }));
        setOwners(typedOwners);
        setFilteredOwners(typedOwners);
      } catch (error) {
        console.error('Error fetching owners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getOwners();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = owners.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.phone && owner.phone.includes(searchTerm))
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(owners);
    }
  }, [searchTerm, owners]);

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Property Owners</h1>
          <p className="text-muted-foreground mt-1">Manage property owners and their information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-8"
            />
          </div>
          <Button onClick={() => navigate('/owners/add')}>Add Owner</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading owners...</span>
        </div>
      ) : filteredOwners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map((owner) => (
            <OwnerCard key={owner.id} owner={owner} />
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>No Owners Found</CardTitle>
            <CardDescription>
              {searchTerm
                ? `No owners match the search term "${searchTerm}"`
                : "You haven't added any owners yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button onClick={() => navigate('/owners/add')}>Add Your First Owner</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Owners;
