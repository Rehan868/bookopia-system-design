import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fetchOwnerById, updateOwner } from '@/services/api';
import { useEffect, useState } from 'react';
import { Owner } from '@/services/supabase-types';
import { Skeleton } from "@/components/ui/skeleton"

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Must be only digits').min(10, 'Must be at least 10 digits').required('Phone is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  birthdate: Yup.date().required('Birthdate is required'),
  commission_rate: Yup.number().min(0, 'Commission rate must be positive').max(100, 'Commission rate must be less than 100').required('Commission rate is required'),
  payment_details: Yup.string().required('Payment Details are required'),
});

const OwnerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOwner = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const ownerData = await fetchOwnerById(id);
          setOwner(ownerData);
        } catch (error) {
          toast({
            title: "Error fetching owner",
            description: "Failed to load owner details. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOwner();
  }, [id, toast]);

  const onSubmit = async (values: Owner) => {
    try {
      if (id) {
        await updateOwner(id, values);
        toast({
          title: "Owner updated",
          description: "Owner details have been updated successfully.",
        });
        navigate('/owners');
      } else {
        toast({
          title: "Error",
          description: "Owner ID is missing.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating owner",
        description: "Failed to update owner details. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading Owner...</CardTitle>
            <CardDescription>Fetching owner details, please wait.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Rate</Label>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_details">Payment Details</Label>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Owner</CardTitle>
          <CardDescription>Update owner details</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              country: '',
              birthdate: '',
              commission_rate: 0,
              payment_details: '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => (
              <Form className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...formik.getFieldProps('name')} />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500">{formik.errors.name}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...formik.getFieldProps('email')} />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" {...formik.getFieldProps('phone')} />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500">{formik.errors.phone}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...formik.getFieldProps('address')} />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-500">{formik.errors.address}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...formik.getFieldProps('city')} />
                  {formik.touched.city && formik.errors.city ? (
                    <div className="text-red-500">{formik.errors.city}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...formik.getFieldProps('country')} />
                  {formik.touched.country && formik.errors.country ? (
                    <div className="text-red-500">{formik.errors.country}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input id="birthdate" type="date" {...formik.getFieldProps('birthdate')} />
                  {formik.touched.birthdate && formik.errors.birthdate ? (
                    <div className="text-red-500">{formik.errors.birthdate}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission_rate">Commission Rate</Label>
                  <Input
                    id="commission_rate"
                    type="number"
                    step="0.01"
                    {...formik.getFieldProps('commission_rate')}
                  />
                  {formik.touched.commission_rate && formik.errors.commission_rate ? (
                    <div className="text-red-500">{formik.errors.commission_rate}</div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_details">Payment Details</Label>
                  <Input id="payment_details" {...formik.getFieldProps('payment_details')} />
                  {formik.touched.payment_details && formik.errors.payment_details ? (
                    <div className="text-red-500">{formik.errors.payment_details}</div>
                  ) : null}
                </div>
                <Button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Updating...' : 'Update Owner'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerEdit;
