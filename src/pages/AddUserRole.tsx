import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const AddUserRole = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  
  // Permissions object with exact names from database schema
  const [permissions, setPermissions] = useState({
    manage_users: false,
    view_users: false,
    manage_roles: false,
    manage_bookings: false,
    view_bookings: false,
    manage_rooms: false,
    view_rooms: false,
    manage_properties: false,
    view_properties: false,
    manage_expenses: false,
    view_expenses: false,
    view_reports: false,
    manage_settings: false,
    view_settings: false,
    update_cleaning_status: false,
    view_cleaning_status: false,
    manage_owners: false,
    view_owners: false,
    view_audit_logs: false,
    manage_staff: false
  });

  // Group permissions by category
  const permissionCategories = {
    users: ['manage_users', 'view_users', 'manage_roles', 'manage_staff'],
    bookings: ['manage_bookings', 'view_bookings'],
    rooms: ['manage_rooms', 'view_rooms'],
    properties: ['manage_properties', 'view_properties'],
    finances: ['manage_expenses', 'view_expenses', 'view_reports'],
    settings: ['manage_settings', 'view_settings'],
    cleaning: ['update_cleaning_status', 'view_cleaning_status'],
    owners: ['manage_owners', 'view_owners'],
    security: ['view_audit_logs']
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive'
      });
      return;
    }

    // Logic to save the role to the database
    toast({
      title: 'Role Added',
      description: `The role '${roleName}' has been successfully added.`,
    });
    
    // Navigate back to settings page
    navigate('/settings');
  };

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  // Format permission name for display
  const formatPermissionName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="animate-fade-in p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Role</h1>
        <p className="text-muted-foreground mt-1">Create a new user role with specific permissions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Define the basic information for this user role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name*</Label>
              <Input
                id="role-name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Role Description</Label>
              <Input
                id="role-description"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Define what this role can access and modify in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(permissionCategories).map(([category, permissionList]) => (
            <div key={category} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium capitalize">{category}</h3>
                <Separator className="my-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissionList.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <Label className="cursor-pointer" htmlFor={permission}>{formatPermissionName(permission)}</Label>
                    <Switch
                      id={permission}
                      checked={permissions[permission]}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="px-6 py-4 flex justify-end gap-4 border-t">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveRole} className="flex items-center gap-2">
            Save Role
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddUserRole;