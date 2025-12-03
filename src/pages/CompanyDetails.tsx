import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Edit, Calendar } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { mockCompanies } from "@/data/mockData";
import { Company } from "@/types/company";

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

  useEffect(() => {
    const found = mockCompanies.find((c) => c.id === id);
    if (found) {
      setCompany(found);
      setEditValues(found.currentMarkup);
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
        <Button variant="gold" onClick={() => setIsEditOpen(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Markups
        </Button>
      </div>

      {/* Current Markup Cards */}
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
            <div className="flex items-center gap-4">
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
    </div>
  );
};

export default CompanyDetails;
