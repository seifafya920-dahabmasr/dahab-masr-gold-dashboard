import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, Download, Edit, MoreHorizontal, UserPlus, Copy as CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { mockCompanies, mockUsers } from "@/data/mockData";
import { Company } from "@/types/company";
import { AccountStatus, AccountType, User } from "@/types/user";

const MarkupCard = ({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "gold" | "silver";
}) => (
  <Card className={`border-border shadow-elegant ${type === "gold" ? "border-l-4 border-l-gold" : "border-l-4 border-l-muted-foreground"}`}>
    <CardContent className="pt-6">
      <p className="text-sm font-body text-muted-foreground mb-1">{title}</p>
      <p className={`text-3xl font-display font-bold ${type === "gold" ? "text-gold" : "text-foreground"}`}>
        {value} LE
      </p>
    </CardContent>
  </Card>
);

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(searchParams.get("edit") === "true");
  const [editValues, setEditValues] = useState({
    goldBuy: 0,
    goldSell: 0,
    silverBuy: 0,
    silverSell: 0,
  });
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [activeTab, setActiveTab] = useState<"users" | "markups">("markups");

  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userMode, setUserMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<{
    name: string;
    email: string;
    accountType: AccountType | "";
    accountStatus: AccountStatus | "";
    password: string;
  }>({
    name: "",
    email: "",
    accountType: "",
    accountStatus: "",
    password: "",
  });
  const [externalId, setExternalId] = useState<string | null>(null);
  const [isExternalIdModalOpen, setIsExternalIdModalOpen] = useState(false);

  useEffect(() => {
    const found = mockCompanies.find((c) => c.id === id);
    if (found) {
      setCompany(found);
      setEditValues(found.currentMarkup);
      const usersForCompany = mockUsers.filter((u) => u.companyId === found.id);
      setCompanyUsers(usersForCompany);
    }
  }, [id]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground font-body">Company not found</p>
      </div>
    );
  }

  const handleSaveMarkups = () => {
    // In a real app, this would make an API call
    toast({
      title: "Markups Updated",
      description: `Successfully updated markups for ${company.name}`,
    });
    setIsEditOpen(false);
  };

  const handleGenerateExternalId = () => {
    const segment = () =>
      Array.from({ length: 4 })
        .map(
          () =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
              Math.floor(Math.random() * 36)
            ],
        )
        .join("");
    const idValue = `${segment()}-${segment()}-${segment()}`;
    setExternalId(idValue);
    setIsExternalIdModalOpen(true);
  };

  const handleCopyExternalId = async () => {
    if (!externalId) return;
    try {
      await navigator.clipboard.writeText(externalId);
      toast({
        title: "Copied",
        description: "External ID copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy External ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenCreateUser = () => {
    setUserMode("create");
    setSelectedUser(null);
    setUserForm({
      name: "",
      email: "",
      accountType: "",
      accountStatus: "",
      password: "",
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setUserMode("edit");
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      accountStatus: user.accountStatus,
      password: "",
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast({
        title: "Missing information",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (!userForm.accountType || !userForm.accountStatus) {
      toast({
        title: "Select account details",
        description: "Please choose account type and status.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (userMode === "create" && !userForm.password.trim()) {
      toast({
        title: "Missing password",
        description: "Password is required when creating a new user.",
        variant: "destructive",
      });
      return;
    }

    if (!company) return;

    if (userMode === "edit" && selectedUser) {
      const updated = companyUsers.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: userForm.name.trim(),
              email: userForm.email.trim(),
              accountType: userForm.accountType as AccountType,
              accountStatus: userForm.accountStatus as AccountStatus,
            }
          : u,
      );
      setCompanyUsers(updated);

      const globalIndex = mockUsers.findIndex((u) => u.id === selectedUser.id);
      if (globalIndex !== -1) {
        mockUsers[globalIndex] = {
          ...mockUsers[globalIndex],
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          accountType: userForm.accountType as AccountType,
          accountStatus: userForm.accountStatus as AccountStatus,
        };
      }

      toast({
        title: "User updated",
        description: `Changes saved for ${userForm.name}.`,
      });
    } else if (userMode === "create") {
      const newUser: User = {
        id: `u${mockUsers.length + 1}`,
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        companyId: company.id,
        created_at: new Date().toISOString(),
        createdById: "u1",
        createdByName: "Admin User",
        accountType: userForm.accountType as AccountType,
        accountStatus: userForm.accountStatus as AccountStatus,
      };

      setCompanyUsers((prev) => [newUser, ...prev]);
      mockUsers.unshift(newUser);

      toast({
        title: "User created",
        description: `${newUser.name} has been added to ${company.name}.`,
      });
    }

    setIsUserModalOpen(false);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Gold Buy  LE", "Gold Sell  LE", "Silver Buy  LE", "Silver Sell  LE", "Timestamp", "Changed By"];
    const rows = company.markupHistory.map((entry) => [
      entry.goldBuy,
      entry.goldSell,
      entry.silverBuy,
      entry.silverSell,
      new Date(entry.timestamp).toLocaleString(),
      entry.changedBy,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${company.name.replace(/\s+/g, "_")}_markup_history.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Markup history has been downloaded as CSV",
    });
  };

  const filteredHistory = company.markupHistory.filter((entry) => {
    if (!dateFilter.from && !dateFilter.to) return true;
    const entryDate = new Date(entry.timestamp);
    const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
    const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
    if (fromDate && entryDate < fromDate) return false;
    if (toDate && entryDate > toDate) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/companies")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display text-foreground">{company.name}</h1>
            <p className="text-muted-foreground font-body mt-1">
              Last updated: {new Date(company.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateExternalId}
          >
            Generate External ID
          </Button>
          <Button
            variant="gold-outline"
            size="sm"
            onClick={() => navigate(`/documentation/${company.id}`)}
          >
            Open Documentation
          </Button>
        </div>
      </div>

      {/* Company Base Information */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-body">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Company Name</p>
            <p className="mt-1 text-foreground">{company.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tax Number</p>
            <p className="mt-1 text-foreground">{company.taxNumber ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
            <p className="mt-1 text-foreground">{company.location ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Created At</p>
            <p className="mt-1 text-foreground">
              {company.createdAt ? new Date(company.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Created By</p>
            <p className="mt-1 text-foreground">{company.createdByName ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Company Status</p>
            <p className="mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted text-xs uppercase tracking-wide">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    company.companyStatus === "Closed" ? "bg-destructive" : "bg-emerald-500"
                  }`}
                />
                {company.companyStatus ?? "Active"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="markups"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "users" | "markups")}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="markups">Markups</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users">
          <Card className="border-border shadow-elegant mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-xl">Company Users</CardTitle>
                <Button variant="gold" size="sm" onClick={handleOpenCreateUser}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-body font-semibold">ID</TableHead>
                      <TableHead className="font-body font-semibold">Name</TableHead>
                      <TableHead className="font-body font-semibold">Email</TableHead>
                      <TableHead className="font-body font-semibold">Account Type</TableHead>
                      <TableHead className="font-body font-semibold">Status</TableHead>
                      <TableHead className="font-body font-semibold">Created At</TableHead>
                      <TableHead className="font-body font-semibold">Created By</TableHead>
                      <TableHead className="font-body font-semibold text-right">Options</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <TableCell className="font-body text-muted-foreground">{user.id}</TableCell>
                        <TableCell className="font-body font-medium">{user.name}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="font-body">{user.accountType}</TableCell>
                        <TableCell className="font-body">{user.accountStatus}</TableCell>
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
                                  handleOpenEditUser(user);
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
                    {companyUsers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground font-body py-6"
                        >
                          No users found for this company.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markups">
          {/* Current Markup Cards */}
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="text-xl font-display text-foreground mb-4">Current Markups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MarkupCard title="Gold Buy" value={company.currentMarkup.goldBuy} type="gold" />
                <MarkupCard title="Gold Sell" value={company.currentMarkup.goldSell} type="gold" />
                <MarkupCard title="Silver Buy" value={company.currentMarkup.silverBuy} type="silver" />
                <MarkupCard title="Silver Sell" value={company.currentMarkup.silverSell} type="silver" />
              </div>
            </div>

            {/* Markup History */}
            <Card className="border-border shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="font-display text-xl">Markup History</CardTitle>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        placeholder="From"
                        value={dateFilter.from}
                        onChange={(e) => setDateFilter((f) => ({ ...f, from: e.target.value }))}
                        className="w-36 font-body"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="date"
                        placeholder="To"
                        value={dateFilter.to}
                        onChange={(e) => setDateFilter((f) => ({ ...f, to: e.target.value }))}
                        className="w-36 font-body"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="gold-outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button variant="gold" onClick={() => setIsEditOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Markups
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-body font-semibold text-center">Gold Buy  LE</TableHead>
                        <TableHead className="font-body font-semibold text-center">Gold Sell  LE</TableHead>
                        <TableHead className="font-body font-semibold text-center">Silver Buy  LE</TableHead>
                        <TableHead className="font-body font-semibold text-center">Silver Sell  LE</TableHead>
                        <TableHead className="font-body font-semibold">Timestamp</TableHead>
                        <TableHead className="font-body font-semibold">Changed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-muted/30">
                          <TableCell className="text-center font-body text-gold font-semibold">
                            {entry.goldBuy} LE
                          </TableCell>
                          <TableCell className="text-center font-body text-gold font-semibold">
                            {entry.goldSell} LE
                          </TableCell>
                          <TableCell className="text-center font-body text-muted-foreground">
                            {entry.silverBuy} LE
                          </TableCell>
                          <TableCell className="text-center font-body text-muted-foreground">
                            {entry.silverSell} LE
                          </TableCell>
                          <TableCell className="font-body text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-body">{entry.changedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Markups Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Markups</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-gold">Gold Buy  LE</Label>
              <Input
                type="number"
                step="0.1"
                value={editValues.goldBuy}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, goldBuy: parseFloat(e.target.value) || 0 }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm text-gold">Gold Sell  LE</Label>
              <Input
                type="number"
                step="0.1"
                value={editValues.goldSell}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, goldSell: parseFloat(e.target.value) || 0 }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Silver Buy  LE</Label>
              <Input
                type="number"
                step="0.1"
                value={editValues.silverBuy}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, silverBuy: parseFloat(e.target.value) || 0 }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Silver Sell  LE</Label>
              <Input
                type="number"
                step="0.1"
                value={editValues.silverSell}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, silverSell: parseFloat(e.target.value) || 0 }))
                }
                className="font-body"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSaveMarkups}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit User Dialog */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {userMode === "edit" ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="font-body text-sm">Name</Label>
              <Input
                value={userForm.name}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, name: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Email</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, email: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">
                Password{userMode === "create" ? "" : " (leave blank to keep current)"}
              </Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm((f) => ({ ...f, password: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Account Type</Label>
                <select
                  className="font-body h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={userForm.accountType}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, accountType: e.target.value as AccountType }))
                  }
                >
                  <option value="">Select type</option>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Account Status</Label>
                <select
                  className="font-body h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={userForm.accountStatus}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, accountStatus: e.target.value as AccountStatus }))
                  }
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            {userMode === "edit" && selectedUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body text-muted-foreground">
                <div>
                  <span className="block text-xs uppercase tracking-wide">
                    Created At
                  </span>
                  <span>
                    {new Date(selectedUser.created_at).toLocaleString()}
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
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSaveUser}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* External ID Dialog */}
      <Dialog open={isExternalIdModalOpen} onOpenChange={setIsExternalIdModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              External ID
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm font-body text-muted-foreground">
              This External ID can be shared with the partner&apos;s technical team
              for integration and synchronization.
            </p>
            <div className="space-y-2">
              <Label className="font-body text-sm">Generated External ID</Label>
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-body text-sm">
                    <span className="text-muted-foreground mr-2">
                      External ID:
                    </span>
                    <span className="font-mono tracking-wider text-foreground">
                      {externalId}
                    </span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyExternalId}
                    className="mt-1 sm:mt-0"
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="gold"
              onClick={() => setIsExternalIdModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetails;
