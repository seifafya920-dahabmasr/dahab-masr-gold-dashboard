import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreHorizontal, Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { mockUsers } from "@/data/mockData";
import { AccountStatus, AccountType, User } from "@/types/user";

type Mode = "create" | "edit";

interface FormState {
  name: string;
  email: string;
  accountType: AccountType | "";
  accountStatus: AccountStatus | "";
}

const initialFormState: FormState = {
  name: "",
  email: "",
  accountType: "",
  accountStatus: "",
};

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedUser(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setMode("edit");
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      accountStatus: user.accountStatus,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Missing information",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (!form.accountType || !form.accountStatus) {
      toast({
        title: "Select account details",
        description: "Please choose account type and status.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "edit" && selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: form.name.trim(),
              email: form.email.trim(),
              accountType: form.accountType as AccountType,
              accountStatus: form.accountStatus as AccountStatus,
            }
          : u,
      );
      setUsers(updatedUsers);

      const globalIndex = mockUsers.findIndex((u) => u.id === selectedUser.id);
      if (globalIndex !== -1) {
        mockUsers[globalIndex] = {
          ...mockUsers[globalIndex],
          name: form.name.trim(),
          email: form.email.trim(),
          accountType: form.accountType as AccountType,
          accountStatus: form.accountStatus as AccountStatus,
        };
      }

      toast({
        title: "User updated",
        description: `Changes saved for ${form.name}.`,
      });
    } else if (mode === "create") {
      const newUser: User = {
        id: `u${users.length + 1}`,
        name: form.name.trim(),
        email: form.email.trim(),
        created_at: new Date().toISOString(),
        createdById: "u1",
        createdByName: "Admin User",
        accountType: form.accountType as AccountType,
        accountStatus: form.accountStatus as AccountStatus,
      };

      const updatedUsers = [newUser, ...users];
      setUsers(updatedUsers);
      mockUsers.unshift(newUser);

      toast({
        title: "User created",
        description: `${newUser.name} has been added.`,
      });
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.id.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-foreground">Users</h1>
          <p className="text-muted-foreground font-body mt-1">
            Manage dashboard user accounts and permissions
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-xl">All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 font-body"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">ID</TableHead>
                  <TableHead className="font-body font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Created At
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Created By
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Account Type
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-body font-semibold text-right">
                    Options
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <TableCell className="font-body text-muted-foreground">
                      {user.id}
                    </TableCell>
                    <TableCell className="font-body font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {new Date(user.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className="font-body text-gold hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users/${user.createdById}`);
                        }}
                      >
                        {user.createdByName}
                      </button>
                    </TableCell>
                    <TableCell className="font-body">
                      {user.accountType}
                    </TableCell>
                    <TableCell className="font-body">
                      {user.accountStatus}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(user);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground font-body">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredUsers.length,
                )}{" "}
                of {filteredUsers.length} users
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1),
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {mode === "edit" ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="font-body text-sm">Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Account Type</Label>
                <Select
                  value={form.accountType}
                  onValueChange={(value: AccountType) =>
                    setForm((f) => ({ ...f, accountType: value }))
                  }
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Account Status</Label>
                <Select
                  value={form.accountStatus}
                  onValueChange={(value: AccountStatus) =>
                    setForm((f) => ({ ...f, accountStatus: value }))
                  }
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {mode === "edit" && selectedUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body text-muted-foreground">
                <div>
                  <span className="block text-xs uppercase tracking-wide">
                    Created At
                  </span>
                  <span>
                    {new Date(
                      selectedUser.created_at,
                    ).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide">
                    Created By
                  </span>
                  <span>{selectedUser.createdByName}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;


