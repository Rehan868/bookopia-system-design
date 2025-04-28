import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileEdit, Building, DollarSign, Percent } from 'lucide-react';
import { useOwner } from '@/hooks/useOwners';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { OwnerRoomsList } from '@/components/owners/OwnerRoomsList';

const OwnerView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: owner, isLoading, error } = useOwner(id || '');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="mr-4">
              <Link to="/owners">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Owners
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Owner Profile</h1>
              <p className="text-muted-foreground mt-1">Loading owner information...</p>
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !owner) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Owner</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Owner information could not be loaded"}
        </p>
        <Button asChild>
          <Link to="/owners">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Owners List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/owners">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Owners
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Owner Profile</h1>
            <p className="text-muted-foreground mt-1">View owner information</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/owners/edit/${owner.id}`}>
            <FileEdit className="h-4 w-4 mr-2" />
            Edit Owner
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={owner.avatar || undefined} />
                <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{owner.name}</h2>
                <p className="text-muted-foreground">{owner.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Properties</p>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{owner.properties} Properties</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Occupancy</p>
                <div className="flex items-center gap-2 mt-1">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span>{owner.occupancy}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
              <p className="font-medium">{formatCurrency(owner.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="font-medium">{owner.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Details</p>
              <p className="font-medium">{owner.paymentDetails?.bank || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined Date</p>
              <p className="font-medium">{owner.joinedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge variant="outline" className="mt-1">
                Up to date
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <OwnerRoomsList ownerId={owner.id} />
    </div>
  );
};

export default OwnerView;
