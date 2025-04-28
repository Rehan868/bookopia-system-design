import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileEdit, Trash2 } from 'lucide-react';
import { useExpense, useDeleteExpense } from '@/hooks/useExpenses';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ExpenseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: expense, isLoading, error } = useExpense(id || '');
  const deleteExpenseMutation = useDeleteExpense();

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteExpenseMutation.mutateAsync(id);
      toast.success("Expense deleted successfully");
      navigate("/expenses");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin mr-2 h-6 w-6 border-t-2 border-b-2 border-primary rounded-full"></div>
        <span>Loading expense data...</span>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="text-center p-8 border rounded-lg bg-red-50">
        <p className="text-red-600">Error loading expense data.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/expenses')}
        >
          Return to Expenses
        </Button>
      </div>
    );
  }

  // Format date if it's available
  const formattedDate = expense.date ? 
    format(typeof expense.date === 'string' ? parseISO(expense.date) : new Date(expense.date), 'PP') : 
    'Not specified';

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
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/expenses/edit/${expense.id}`}>
              <FileEdit className="h-4 w-4 mr-2" />
              Edit Expense
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this 
                  expense record from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                <TableCell>{parseFloat(expense.amount).toFixed(2)}</TableCell>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge variant="outline" className="mt-1">{expense.category}</Badge>
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
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{expense.payment_method || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {expense.created_at ? format(new Date(expense.created_at), 'PPp') : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {expense.updated_at ? format(new Date(expense.updated_at), 'PPp') : 'Not available'}
              </p>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Receipts & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          {/* This would be where you display receipt images or other documentation */}
          <div className="text-center p-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No receipts or documentation attached</p>
            <Button variant="outline" className="mt-4">Upload Receipt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseView;
