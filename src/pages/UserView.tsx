import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader, User as UserIcon, Mail, Phone, Calendar, Clock, ShieldCheck, 
  BellRing, Edit, Trash2, Lock, AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/hooks/useUsers';
import { supabase } from '@/integrations/supabase/client';

const UserView = () => {
  const { id } = useParams();
  const { data: user, isLoading, error } = useUser(id || '');
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isRemovingRole, setIsRemovingRole] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        if (!id) return;
        
        const { data: userRoles, error: userRolesError } = await supabase
          .from('user_roles')
          .select('*, roles(*)')
          .eq('user_id', id);
        
        if (userRolesError) throw userRolesError;
        
        const formattedRoles = userRoles?.map(ur => ({
          id: ur.roles.id,
          name: ur.roles.name,
          description: ur.roles.description
        })) || [];
        
        setRoles(formattedRoles);
        
        const { data: allRoles, error: allRolesError } = await supabase
          .from('roles')
          .select('*');
        
        if (allRolesError) throw allRolesError;
        
        const userRoleIds = formattedRoles.map(r => r.id);
        const availableRolesFiltered = allRoles?.filter(r => !userRoleIds.includes(r.id)) || [];
        setAvailableRoles(availableRolesFiltered);
      } catch (err) {
        console.error("Error fetching user roles:", err);
      }
    };
    
    fetchUserRoles();
  }, [id]);

  const handleAddRole = async () => {
    if (!selectedRole || !id) return;
    
    try {
      setIsAddingRole(true);
      
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: id, role_id: selectedRole }]);
      
      if (error) throw error;
      
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', selectedRole)
        .single();
      
      if (roleError) throw roleError;
      
      setRoles([...roles, roleData]);
      
      setAvailableRoles(availableRoles.filter(r => r.id !== selectedRole));
      
      setSelectedRole('');
    } catch (err) {
      console.error("Error adding role:", err);
    } finally {
      setIsAddingRole(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!id) return;
    
    try {
      setIsRemovingRole(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id)
        .eq('role_id', roleId);
      
      if (error) throw error;
      
      const removedRole = roles.find(r => r.id === roleId);
      
      setRoles(roles.filter(r => r.id !== roleId));
      
      if (removedRole) {
        setAvailableRoles([...availableRoles, removedRole]);
      }
    } catch (err) {
      console.error("Error removing role:", err);
    } finally {
      setIsRemovingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!id) return;
      
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);
      
      if (rolesError) throw rolesError;
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      navigate('/users');
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error loading user details</div>
        <Button variant="outline" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/users/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
          {deleteConfirm ? (
            <>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Confirm Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : (
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
            
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.position || 'No position specified'}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-amber-600 bg-amber-50">
                  {user.role}
                </Badge>
                {user.two_factor_enabled && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    2FA Enabled
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone || 'No phone number'}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created At</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDate(user.updated_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t flex justify-end py-4 px-6">
              <Button variant="outline" onClick={() => navigate(`/users/${id}/edit`)}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Change Password</div>
                    <div className="text-muted-foreground text-sm">Update user's password</div>
                  </div>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Two Factor Authentication</div>
                    <div className="text-muted-foreground text-sm">
                      {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <Button variant={user.two_factor_enabled ? "outline" : "default"}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {user.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {user.notification_preferences ? (
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                    {JSON.stringify(user.notification_preferences, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground">No notification preferences set</div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t flex justify-end py-4 px-6">
              <Button variant="outline">
                <BellRing className="h-4 w-4 mr-2" />
                Update Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User Roles</h3>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border rounded p-2 text-sm"
                    disabled={availableRoles.length === 0}
                  >
                    <option value="">Select a role</option>
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={handleAddRole}
                    disabled={!selectedRole || isAddingRole}
                  >
                    {isAddingRole ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add Role'
                    )}
                  </Button>
                </div>
              </div>
              
              {roles.length > 0 ? (
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div 
                      key={role.id} 
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                      <Button 
                        variant="warning"
                        size="sm" 
                        onClick={() => handleRemoveRole(role.id)}
                        disabled={isRemovingRole}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  User has no assigned roles
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Permissions</h3>
              
              <div className="p-4 border rounded-md bg-yellow-50 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Permissions are managed via roles</p>
                  <p className="text-sm text-yellow-700">
                    This user's permissions are determined by their assigned roles. 
                    Add or remove roles to change their permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  Activity logs not available
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserView;
