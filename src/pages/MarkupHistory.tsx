import { useState } from "react";
import { Download, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { mockCompanies } from "@/data/mockData";

interface FlattenedHistory {
  companyId: string;
  companyName: string;
  goldBuy: number;
  goldSell: number;
  silverBuy: number;
  silverSell: number;
  timestamp: string;
  changedBy: string;
}

const MarkupHistory = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  // Flatten all history entries
  const allHistory: FlattenedHistory[] = mockCompanies.flatMap((company) =>
    company.markupHistory.map((entry) => ({
      companyId: company.id,
      companyName: company.name,
      ...entry,
    }))
  );

  // Sort by timestamp (most recent first)
  allHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Filter
  const filteredHistory = allHistory.filter((entry) => {
    if (selectedCompany !== "all" && entry.companyId !== selectedCompany) return false;
    if (!dateFilter.from && !dateFilter.to) return true;
    const entryDate = new Date(entry.timestamp);
    const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
    const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
    if (fromDate && entryDate < fromDate) return false;
    if (toDate && entryDate > toDate) return false;
    return true;
  });

  const handleExport = () => {
    const headers = ["Company", "Gold Buy  LE", "Gold Sell  LE", "Silver Buy  LE", "Silver Sell  LE", "Timestamp", "Changed By"];
    const rows = filteredHistory.map((entry) => [
      entry.companyName,
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
    a.download = `markup_history_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filteredHistory.length} records exported to CSV`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display text-foreground">Markup History</h1>
        <p className="text-muted-foreground font-body mt-1">
          View and export historical markup changes across all companies
        </p>
      </div>

      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="font-display text-xl">All History Records</CardTitle>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Company Filter */}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48 font-body">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter((f) => ({ ...f, from: e.target.value }))}
                  className="w-36 font-body"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter((f) => ({ ...f, to: e.target.value }))}
                  className="w-36 font-body"
                />
              </div>

              <Button variant="gold-outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Company</TableHead>
                  <TableHead className="font-body font-semibold text-center">Gold Buy  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Gold Sell  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Silver Buy  LE</TableHead>
                  <TableHead className="font-body font-semibold text-center">Silver Sell  LE</TableHead>
                  <TableHead className="font-body font-semibold">Timestamp</TableHead>
                  <TableHead className="font-body font-semibold">Changed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry, index) => (
                  <TableRow key={`${entry.companyId}-${index}`} className="hover:bg-muted/30">
                    <TableCell className="font-body font-medium">{entry.companyName}</TableCell>
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

          <p className="text-sm text-muted-foreground font-body mt-4">
            Showing {filteredHistory.length} of {allHistory.length} records
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkupHistory;
