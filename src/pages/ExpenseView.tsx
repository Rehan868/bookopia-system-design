
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader, CalendarIcon, FileText, DollarSign, Home, Tag, CreditCard, User, Trash2, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const ExpenseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedExpenses, setRelatedExpenses] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        if (!id) {
          throw new Error("Expense ID is required");
        }
        
        setLoading(true);
        
        // Fetch the expense details
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setExpense(data);
        
        // Fetch related expenses (same property and category)
        if (data) {
          const { data: related, error: relatedError } = await supabase
            .from('expenses')
            .select('*')
            .eq('property', data.property)
            .eq('category', data.category)
            .neq('id', id)
            .order('date', { ascending: false })
            .limit(5);
          
          if (relatedError) throw relatedError;
          setRelatedExpenses(related || []);
        }
      } catch (err) {
        console.error("Error fetching expense:", err);
        setError("Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      // Delete the expense
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Redirect to expenses list
      navigate('/expenses', { replace: true });
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error || "Expense not found"}</div>
        <Button variant="outline" onClick={() => navigate('/expenses')}>
          Back to Expenses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expense Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/expenses/${id}/edit`)}>
            <PenLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {deleteConfirm ? (
            <>
              <Button variant="destructive" onClick={handleDelete}>
                Confirm Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{expense.description}</h2>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(expense.date), 'PPP')}
                </div>
              </div>
              <div className="text-2xl font-bold">${expense.amount.toFixed(2)}</div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Property</h3>
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{expense.property}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
                <Badge variant="outline" className="flex items-center w-fit">
                  <Tag className="mr-2 h-4 w-4" />
                  {expense.category}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{expense.payment_method || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Vendor</h3>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{expense.vendor || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {expense.notes && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm">{expense.notes}</p>
                </div>
              </>
            )}
            
            {expense.receipt_url && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Receipt</h3>
                  <Button variant="outline" className="flex items-center" asChild>
                    <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      View Receipt
                    </a>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button variant="outline" onClick={() => navigate('/expenses')}>
              Back to Expenses
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Related Expenses</h2>
            
            {relatedExpenses.length > 0 ? (
              <div className="space-y-4">
                {relatedExpenses.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/expenses/${item.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="font-medium">${item.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No related expenses found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Expense History</h2>
          <Table>
            <TableCaption>Expense audit trail</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{format(new Date(expense.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>Expense Created</TableCell>
                <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
              </TableRow>
              {expense.created_at !== expense.updated_at && (
                <TableRow>
                  <TableCell>{format(new Date(expense.updated_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>Expense Updated</TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseView;
