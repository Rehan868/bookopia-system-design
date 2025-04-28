import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, FileEdit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useExpenses, useDeleteExpense } from '@/hooks/useExpenses';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Expenses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const { data: expenses, isLoading, error } = useExpenses();
  const deleteExpenseMutation = useDeleteExpense();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const filteredExpenses = expenses?.filter(expense => {
    const matchesSearch = searchQuery === '' || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.property.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Handle date filtering
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      if (dateFilter === 'this-month') {
        matchesDate = expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      } else if (dateFilter === 'last-month') {
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        matchesDate = expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      } else if (dateFilter === 'this-year') {
        matchesDate = expenseDate.getFullYear() === thisYear;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleAddNew = () => {
    navigate('/expenses/add');
  };

  const handleViewExpense = (id: string) => {
    navigate(`/expenses/${id}`);
  };

  const handleEditExpense = (id: string) => {
    navigate(`/expenses/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    
    try {
      await deleteExpenseMutation.mutateAsync(expenseToDelete);
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const getCategoryBadge = (category: string) => {
    const colorMap: Record<string, string> = {
      'Maintenance': 'bg-blue-100 text-blue-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Personnel': 'bg-purple-100 text-purple-800',
      'Supplies': 'bg-green-100 text-green-800',
      'default': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colorMap[category] || colorMap.default}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">Manage all property expenses</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Expense
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search expenses..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="personnel">Personnel</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading || deleteExpenseMutation.isPending ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">
            {deleteExpenseMutation.isPending ? "Deleting expense..." : "Loading expenses..."}
          </span>
        </div>
      ) : error ? (
        <div className="text-center p-8 border rounded-lg bg-red-50">
          <p className="text-red-600">Error loading expenses data.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {filteredExpenses && filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                      {expense.vendor && (
                        <div className="text-sm text-muted-foreground">{expense.vendor}</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      {getCategoryBadge(expense.category)}
                    </TableCell>
                    <TableCell>{expense.property}</TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleViewExpense(expense.id)}
                          title="View expense details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditExpense(expense.id)}
                          title="Edit expense"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteClick(expense.id)}
                          title="Delete expense"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No expenses found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
