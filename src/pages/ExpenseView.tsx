import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileEdit, CreditCard } from 'lucide-react';
import { useExpense } from '@/hooks/useExpenses';
import { Badge } from '@/components/ui/badge';

const ExpenseView = () => {
  const { id } = useParams();
  const { data: expense, isLoading, error } = useExpense(id || '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !expense) {
    return <div>Error loading expense details</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/expenses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expenses
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Expense Details</h1>
            <p className="text-muted-foreground mt-1">View expense information</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/expenses/edit/${expense.id}`}>
            <FileEdit className="h-4 w-4 mr-2" />
            Edit Expense
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{expense.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${expense.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{expense.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline">{expense.category}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">{expense.property}</p>
            </div>
            {expense.vendor && (
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-medium">{expense.vendor}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge 
                variant={expense.payment_method === 'Paid' ? 'secondary' : 'outline'}
                className="mt-1"
              >
                {expense.payment_method || 'Pending'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{expense.payment_method || 'Not specified'}</span>
              </div>
            </div>
            {expense.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{expense.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseView;
