import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Edit, MoreHorizontal, Copy as CopyIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { mockCompanies } from "@/data/mockData";
import type { Company, CooperationType } from "@/types/company";

interface CreateCompanyState {
  companyName: string;
  taxNumber: string;
  location: string;
  cooperationType: CooperationType | "";
  goldBuy: number;
  goldSell: number;
  silverBuy: number;
  silverSell: number;
}

const initialCreateState: CreateCompanyState = {
  companyName: "",
  taxNumber: "",
  location: "",
  cooperationType: "",
  goldBuy: 0,
  goldSell: 0,
  silverBuy: 0,
  silverSell: 0,
};

const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [companies, setCompanies] = useState<Company[]>([...mockCompanies]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createForm, setCreateForm] =
    useState<CreateCompanyState>(initialCreateState);
  const [externalId, setExternalId] = useState<string | null>(null);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setCreateForm(initialCreateState);
    setCreateStep(1);
    setExternalId(null);
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const validateStepOne = () => {
    if (!createForm.companyName.trim()) {
      toast({
        title: "Missing company name",
        description: "Company name is required to continue.",
        variant: "destructive",
      });
      return false;
    }
    if (!createForm.cooperationType) {
      toast({
        title: "Select cooperation type",
        description: "Please choose a cooperation type to continue.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStepOne()) return;
    setCreateStep(2);
  };

  const handleCreateCompany = () => {
    if (!validateStepOne()) return;

    const newCompany: Company = {
      id: String(companies.length + 1),
      name: createForm.companyName.trim(),
      taxNumber: createForm.taxNumber.trim() || undefined,
      location: createForm.location.trim() || undefined,
      cooperationType: createForm.cooperationType || undefined,
      currentMarkup: {
        goldBuy: createForm.goldBuy || 0,
        goldSell: createForm.goldSell || 0,
        silverBuy: createForm.silverBuy || 0,
        silverSell: createForm.silverSell || 0,
      },
      lastUpdated: new Date().toISOString(),
      markupHistory: [],
    };

    const updatedCompanies = [newCompany, ...companies];
    setCompanies(updatedCompanies);
    mockCompanies.unshift(newCompany);

    toast({
      title: "Company created",
      description: `${newCompany.name} has been added.`,
    });

    setIsCreateOpen(false);
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
    const id = `${segment()}-${segment()}-${segment()}`;
    setExternalId(id);
    toast({
      title: "External ID created",
      description: "A new External ID has been generated for this company.",
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-foreground">Companies</h1>
          <p className="text-muted-foreground font-body mt-1">
            Manage company markup values
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate}>
          Add Company
        </Button>
      </div>

      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-xl">All Companies</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <TableHead className="font-body font-semibold">Company Name</TableHead>
                  <TableHead className="font-body font-semibold text-center">Gold Buy  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Gold Sell  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Silver Buy  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Silver Sell  LE</TableHead>
                  <TableHead className="font-body font-semibold">Last Updated</TableHead>
                  <TableHead className="font-body font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company) => (
                  <TableRow
                    key={company.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    <TableCell className="font-body font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell className="text-center font-body text-gold font-semibold">
                      {company.currentMarkup.goldBuy} LE
                    </TableCell>
                    <TableCell className="text-center font-body text-gold font-semibold">
                      {company.currentMarkup.goldSell} LE
                    </TableCell>
                    <TableCell className="text-center font-body text-muted-foreground">
                      {company.currentMarkup.silverBuy} LE
                    </TableCell>
                    <TableCell className="text-center font-body text-muted-foreground">
                      {company.currentMarkup.silverSell} LE
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {new Date(company.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/companies/${company.id}`);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/companies/${company.id}?edit=true`);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Markups
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground font-body">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of{" "}
                {filteredCompanies.length} companies
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Create Company
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {createStep === 1
                ? "Step 1 of 2 — Company basic information"
                : "Step 2 of 2 — Starting markup setup"}
            </p>
          </DialogHeader>

          {createStep === 1 ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="font-body text-sm">
                  Company Name
                </Label>
                <Input
                  value={createForm.companyName}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      companyName: e.target.value,
                    }))
                  }
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Cooperation Type</Label>
                <Select
                  value={createForm.cooperationType}
                  onValueChange={(value: CooperationType) =>
                    setCreateForm((f) => ({
                      ...f,
                      cooperationType: value,
                    }))
                  }
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select cooperation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Tax Number</Label>
                <Input
                  value={createForm.taxNumber}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      taxNumber: e.target.value,
                    }))
                  }
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Location</Label>
                <Input
                  value={createForm.location}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      location: e.target.value,
                    }))
                  }
                  className="font-body"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {(createForm.cooperationType === "Gold" ||
                createForm.cooperationType === "Both") && (
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-sm font-body font-medium text-gold">
                    Gold Markups
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm text-gold">
                        Gold Buy Markup
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={createForm.goldBuy}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            goldBuy: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm text-gold">
                        Gold Sell Markup
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={createForm.goldSell}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            goldSell: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="font-body"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(createForm.cooperationType === "Silver" ||
                createForm.cooperationType === "Both") && (
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-sm font-body font-medium">
                    Silver Markups
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm">
                        Silver Buy Markup
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={createForm.silverBuy}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            silverBuy: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm">
                        Silver Sell Markup
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={createForm.silverSell}
                        onChange={(e) =>
                          setCreateForm((f) => ({
                            ...f,
                            silverSell: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="font-body"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Label className="font-body text-sm">External ID</Label>
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  {!externalId ? (
                    <p className="text-sm text-muted-foreground font-body">
                      Generate an External ID for this company after setting the starting markups.
                    </p>
                  ) : (
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
                  )}
                  <div>
                    <Button
                      type="button"
                      variant="gold-outline"
                      size="sm"
                      onClick={handleGenerateExternalId}
                    >
                      Create External ID
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseCreate}>
              Cancel
            </Button>
            {createStep === 2 && (
              <Button
                variant="outline"
                onClick={() => setCreateStep(1)}
              >
                Back
              </Button>
            )}
            {createStep === 1 ? (
              <Button variant="gold" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button variant="gold" onClick={handleCreateCompany}>
                Create Company
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
