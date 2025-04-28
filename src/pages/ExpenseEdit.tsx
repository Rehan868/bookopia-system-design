import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createExpense, updateExpense, fetchExpenseById } from '@/services/api';
import { Expense } from '@/services/supabase-types';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  category: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  property: Yup.string().required('Property is required'),
  vendor: Yup.string().nullable(),
  payment_method: Yup.string().nullable(),
  notes: Yup.string().nullable(),
  receipt_url: Yup.string().nullable().url('Invalid URL'),
});

const ExpenseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const loadExpense = async () => {
      if (id) {
        try {
          const expenseData = await fetchExpenseById(id);
          setExpense(expenseData);
        } catch (error: any) {
          toast({
            title: "Error loading expense",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    loadExpense();
  }, [id, toast]);

  const initialValues: Omit<Expense, 'id' | 'created_at' | 'updated_at'> = {
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    property: '',
    vendor: null,
    payment_method: null,
    notes: null,
    receipt_url: null,
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Expense' : 'Create Expense'}</CardTitle>
          <CardDescription>Enter the details for the expense.</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={expense || initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                setSubmitting(true);
                if (id) {
                  await updateExpense(id, values);
                  toast({
                    title: "Expense updated",
                    description: "Expense has been updated successfully.",
                  });
                } else {
                  await createExpense(values);
                  toast({
                    title: "Expense created",
                    description: "Expense has been created successfully.",
                  });
                  resetForm();
                }
                navigate('/expenses');
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field as={Input} type="text" id="description" name="description" />
                  <ErrorMessage name="description" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Field as={Input} type="number" id="amount" name="amount" />
                  <ErrorMessage name="amount" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Field as={Input} type="text" id="category" name="category" />
                  <ErrorMessage name="category" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !values.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {values.date ? format(new Date(values.date), "PPP") : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={values.date ? new Date(values.date) : undefined}
                        onSelect={(date) => setFieldValue('date', date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage name="date" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="property">Property</Label>
                  <Field as={Input} type="text" id="property" name="property" />
                  <ErrorMessage name="property" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Field as={Input} type="text" id="vendor" name="vendor" />
                  <ErrorMessage name="vendor" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select onValueChange={(value) => setFieldValue('payment_method', value)} defaultValue={values.payment_method || ''}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      {values.payment_method && (
                        <SelectItem value={values.payment_method || ''}>{values.payment_method}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="payment_method" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Field as={Textarea} id="notes" name="notes" />
                  <ErrorMessage name="notes" component="p" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="receipt_url">Receipt URL</Label>
                  <Field as={Input} type="url" id="receipt_url" name="receipt_url" />
                  <ErrorMessage name="receipt_url" component="p" className="text-red-500 text-sm" />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseEdit;
