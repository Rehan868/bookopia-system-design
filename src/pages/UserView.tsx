import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileEdit, Clock, Plus, X } from 'lucide-react';
import { useUser } from '@/hooks/useUsers';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRoles, fetchUserRoles, assignRoleToUser, removeRoleFromUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserView = () => {
  const { id } = useParams();
  const { data: user, isLoading, error } = useUser(id || '');
  const { data: auditLogs } = useAuditLogs();
  const { toast } = useToast();
  
  const [userRoles, setUserRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const userLogs = auditLogs?.filter(log => log.user_id === id).slice(0, 5) || [];

  useEffect(() => {
    const loadRoleData = async () => {
      if (!id) return;
      
      try {
        setIsRolesLoading(true);
        
        // Load all roles and user's assigned roles
        const [allRoles, assignedRoles] = await Promise.all([
          fetchRoles(),
          fetchUserRoles(id)
        ]);
        
        setUserRoles(assignedRoles.map(ur => ({
          id: ur.role_id,
          name: ur.roles ? ur.roles.name : 'Unknown Role',
          description: ur.roles ? ur.roles.description : ''
        })));
        
        // Filter out roles that the user already has
        const assignedRoleIds = assignedRoles.map(ur => ur.role_id);
        setAvailableRoles(allRoles.filter(role => !assignedRoleIds.includes(role.id)));
      } catch (error) {
        console.error('Error loading role data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load role data',
          variant: 'destructive'
        });
      } finally {
        setIsRolesLoading(false);
      }
    };
    
    loadRoleData();
  }, [id, toast]);

  const handleAssignRole = async () => {
    if (!selectedRole) return;
    
    try {
      await assignRoleToUser(id, selectedRole);
      
      // Update local state to reflect the change
      const role = availableRoles.find(r => r.id === selectedRole);
      setUserRoles([...userRoles, { 
        id: role.id, 
        name: role.name,
        description: role.description 
      }]);
      setAvailableRoles(availableRoles.filter(r => r.id !== selectedRole));
      
      toast({
        title: 'Role Assigned',
        description: `${role.name} role assigned successfully`,
      });
      
      // Reset and close dialog
      setSelectedRole('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign role',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveRole = async (roleId) => {
    try {
      await removeRoleFromUser(id, roleId);
      
      // Update local state to reflect the change
      const role = userRoles.find(r => r.id === roleId);
      setUserRoles(userRoles.filter(r => r.id !== roleId));
      setAvailableRoles([...availableRoles, role]);
      
      toast({
        title: 'Role Removed',
        description: `${role.name} role removed successfully`,
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  if (error || !user) {
    return <div className="text-center py-8 text-red-500">Error loading user details</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-muted-foreground mt-1">View user information</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/users/edit/${user.id}`}>
            <FileEdit className="h-4 w-4 mr-2" />
            Edit User
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">User Roles</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Assign Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Role to User</DialogTitle>
                      <DialogDescription>
                        Select a role to assign to {user.name}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {availableRoles.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-muted-foreground">
                          No available roles to assign. This user has all available roles.
                        </p>
                      </div>
                    ) : (
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setSelectedRole('');
                        setIsDialogOpen(false);
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleAssignRole} disabled={!selectedRole}>
                        Assign Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {isRolesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : userRoles.length === 0 ? (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No roles assigned</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userRoles.map(role => (
                    <Badge 
                      key={role.id} 
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {role.name}
                      <button
                        onClick={() => handleRemoveRole(role.id)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                        aria-label={`Remove ${role.name} role`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Legacy Role (deprecated)</p>
                <Badge className="mt-1">{user.role}</Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge 
                variant="secondary"
                className="mt-1"
              >
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium">{user.last_active ? new Date(user.last_active).toLocaleString() : 'Never'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{user.created_at ? new Date(user.created_at).toLocaleString() : new Date().toISOString().split('T')[0]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Two-Factor Auth</p>
              <Badge variant="secondary">
                Disabled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/audit">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {userLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={log.action === 'create' ? 'outline' : 
                                        log.action === 'update' ? 'secondary' : 'default'}>
                          {log.action}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">No activity found for this user</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserView;
