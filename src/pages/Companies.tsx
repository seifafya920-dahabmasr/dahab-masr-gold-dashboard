import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Edit, MoreHorizontal } from "lucide-react";
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
import { mockCompanies } from "@/data/mockData";

const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-foreground">Companies</h1>
          <p className="text-muted-foreground font-body mt-1">
            Manage company markup values
          </p>
        </div>
        <Button variant="gold">Add Company</Button>
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
    </div>
  );
};

export default Companies;
