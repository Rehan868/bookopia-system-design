import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchPermissions, 
  fetchRolePermissions, 
  updateRole, 
  assignPermissionsToRole,
  fetchRoles
} from '@/services/api';
import { Loader2, ArrowLeft } from 'lucide-react';

const EditUserRole = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissions, setPermissions] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [roleNotFound, setRoleNotFound] = useState(false);
  
  // Group permissions by category
  const permissionCategories = {};

  useEffect(() => {
    const loadRoleData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // 1. Load all permissions
        const permissionsData = await fetchPermissions();
        setAllPermissions(permissionsData);
        
        // Initialize permissions state with all permissions set to false
        const permissionsState = {};
        permissionsData.forEach(permission => {
          permissionsState[permission.name] = false;
        });
        setPermissions(permissionsState);
        
        // 2. Load the role data
        const roles = await fetchRoles();
        const role = roles.find(r => r.id === id);
        
        if (!role) {
          setRoleNotFound(true);
          toast({
            title: 'Error',
            description: 'Role not found',
            variant: 'destructive',
          });
          return;
        }
        
        setRoleName(role.name);
        setRoleDescription(role.description || '');
        
        // 3. Load the role's current permissions
        const rolePermissions = await fetchRolePermissions(id);
        
        // Update permissions state based on the role's current permissions
        const updatedPermissionsState = { ...permissionsState };
        rolePermissions.forEach(rp => {
          const permission = permissionsData.find(p => p.id === rp.permission_id);
          if (permission) {
            updatedPermissionsState[permission.name] = true;
          }
        });
        
        setPermissions(updatedPermissionsState);
      } catch (error) {
        console.error('Error loading role data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load role data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRoleData();
  }, [id, toast]);

  // Group permissions by category once permissions are loaded
  allPermissions.forEach(permission => {
    if (!permissionCategories[permission.category]) {
      permissionCategories[permission.category] = [];
    }
    permissionCategories[permission.category].push(permission);
  });

  const handleUpdateRole = async () => {
    if (!roleName.trim()) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // 1. Update the role
      await updateRole(id, {
        name: roleName,
        description: roleDescription
      });
      
      // 2. Update role permissions
      const selectedPermissionIds = allPermissions
        .filter(permission => permissions[permission.name])
        .map(permission => permission.id);
      
      await assignPermissionsToRole(id, selectedPermissionIds);
      
      toast({
        title: 'Role Updated',
        description: `The role '${roleName}' has been successfully updated.`,
      });
      
      // Navigate back to settings page
      navigate('/settings');
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission.name]: !prev[permission.name],
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roleNotFound) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-2">Role Not Found</h2>
              <p className="text-muted-foreground mb-6">The role you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => navigate('/settings')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Role</h1>
        <p className="text-muted-foreground mt-1">Update role information and permissions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            Update the basic information for this user role
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
          {Object.keys(permissionCategories).map((category) => (
            <div key={category} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium capitalize">{category}</h3>
                <Separator className="my-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissionCategories[category].map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div>
                      <Label className="cursor-pointer" htmlFor={permission.name}>
                        {formatPermissionName(permission.name)}
                      </Label>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                      )}
                    </div>
                    <Switch
                      id={permission.name}
                      checked={permissions[permission.name]}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="px-6 py-4 flex justify-end gap-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>Cancel</Button>
          <Button onClick={handleUpdateRole} disabled={submitting} className="flex items-center gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Role
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditUserRole;