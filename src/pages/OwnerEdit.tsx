import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchOwnerById, updateOwner } from '@/services/api';
import { Owner } from '@/types/owner';
import { Loader2 } from 'lucide-react';

interface OwnerFormData extends Omit<Owner, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

const OwnerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [formData, setFormData] = useState<OwnerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    birthdate: '',
    commission_rate: 0,
    payment_details: {
      method: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOwner = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'Owner ID not provided.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsLoading(true);
        const ownerData = await fetchOwnerById(id);
        if (ownerData) {
          setFormData({
            id: ownerData.id,
            name: ownerData.name,
            email: ownerData.email,
            phone: ownerData.phone || '',
            address: ownerData.address || '',
            city: ownerData.city || '',
            country: ownerData.country || '',
            birthdate: ownerData.birthdate || '',
            commission_rate: ownerData.commission_rate || 0,
            payment_details: ownerData.payment_details || {
              method: '',
              accountNumber: '',
              bankName: '',
              routingNumber: '',
            },
          });
        } else {
          toast({
            title: 'Error',
            description: 'Owner not found.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading owner:', error);
        toast({
          title: 'Error',
          description: 'Failed to load owner. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOwner();
  }, [id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the usage of payment_details instead of paymentDetails
  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      payment_details: {
        ...prev.payment_details,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast({
        title: 'Error',
        description: 'Owner ID not provided.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Ensure commission_rate is not null
      const commissionRate = formData.commission_rate !== null ? formData.commission_rate : 0;
      await updateOwner(id, { ...formData, commission_rate: commissionRate });
      toast({
        title: 'Success',
        description: 'Owner updated successfully.',
      });
      navigate('/owners');
    } catch (error) {
      console.error('Error updating owner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update owner. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading owner details...</span>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Owner</h1>
        <p className="text-muted-foreground mt-1">Update owner details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update basic owner information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter owner's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter owner's email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter owner's phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Enter owner's address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  placeholder="Enter owner's city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  placeholder="Enter owner's country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Update financial details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Rate</Label>
              <Input
                id="commission_rate"
                name="commission_rate"
                type="number"
                value={formData.commission_rate?.toString() || ''}
                onChange={handleInputChange}
                placeholder="Enter commission rate"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Update payment information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input
                id="payment_method"
                name="method"
                value={formData.payment_details?.method || ''}
                onChange={handlePaymentDetailsChange}
                placeholder="Enter payment method"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.payment_details?.accountNumber || ''}
                  onChange={handlePaymentDetailsChange}
                  placeholder="Enter account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.payment_details?.bankName || ''}
                  onChange={handlePaymentDetailsChange}
                  placeholder="Enter bank name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                name="routingNumber"
                value={formData.payment_details?.routingNumber || ''}
                onChange={handlePaymentDetailsChange}
                placeholder="Enter routing number"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/owners')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Update Owner
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OwnerEdit;
