import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserRoleManagement = () => {
  const navigate = useNavigate();
  
  const roles = [
    {
      id: '1',
      name: 'Administrator',
      description: 'Full access to all system features',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Can manage properties, bookings, and view reports',
    },
    {
      id: '3',
      name: 'Front Desk',
      description: 'Can manage bookings and check-ins/outs',
    },
    {
      id: '4',
      name: 'Cleaning Staff',
      description: 'Can update room cleaning status',
    },
    {
      id: '5',
      name: 'Owner',
      description: 'Property owner with access to their properties',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Management</CardTitle>
        <CardDescription>
          Manage user roles and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left font-medium p-3">Role Name</th>
                <th className="text-left font-medium p-3">Description</th>
                <th className="text-right font-medium p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-t">
                  <td className="p-3">{role.name}</td>
                  <td className="p-3">{role.description}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          variant="default"
          onClick={() => navigate('/AddUserRole')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Role
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserRoleManagement;