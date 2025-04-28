import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Mail,
  Phone,
  User,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Copy,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchUser, fetchRoles, assignRoleToUser, removeRoleFromUser } from "@/services/api";
import { format } from 'date-fns';

const UserView = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [assigningRole, setAssigningRole] = useState<boolean>(false);
  const [removingRole, setRemovingRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "User ID is missing.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUser(id);
        setUser(userData);

        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, toast]);

  const handleAssignRole = async () => {
    if (!selectedRole) {
      toast({
        title: "Warning",
        description: "Please select a role to assign.",
        variant: "warning",
      });
      return;
    }

    setAssigningRole(true);
    try {
      await assignRoleToUser(id as string, selectedRole);
      toast({
        title: "Success",
        description: "Role assigned successfully.",
      });
      // Refresh user data after assigning role
      const userData = await fetchUser(id as string);
      setUser(userData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role.",
        variant: "destructive",
      });
    } finally {
      setAssigningRole(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setRemovingRole(true);
    try {
      await removeRoleFromUser(id as string, roleId);
      toast({
        title: "Success",
        description: "Role removed successfully.",
      });
      // Refresh user data after removing role
      const userData = await fetchUser(id as string);
      setUser(userData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove role.",
        variant: "destructive",
      });
    } finally {
      setRemovingRole(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Information about the user</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.avatar_url || "/avatars/01.png"} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm font-medium">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-sm font-medium">{user.role || 'N/A'}</p>
              </div>
              <div>
                <Label>Position</Label>
                <p className="text-sm font-medium">{user.position || 'N/A'}</p>
              </div>
              <div>
                <Label>Joined</Label>
                <p className="text-sm font-medium">
                  {user && (user.updated_at ? format(new Date(user.updated_at), 'PPP') : 'Never')}
                </p>
              </div>
              <div>
                <Label>Last Active</Label>
                <p className="text-sm font-medium">
                  {user && (user.updated_at ? format(new Date(user.updated_at), 'PPP') : 'Never')}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate(`/users/edit/${user.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </CardContent>
        </Card>

        {/* Roles and Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Roles and Permissions</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRemoveRole(role.id)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Remove Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center space-x-2">
              <Label htmlFor="role">Assign Role:</Label>
              <Input
                type="text"
                id="role"
                placeholder="Select Role ID"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <Button onClick={handleAssignRole} disabled={assigningRole}>
                {assigningRole ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserView;
