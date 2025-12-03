import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy as CopyIcon, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCompanies } from "@/data/mockData";

const tokensSuccessExample = `{
  "status": "success",
  "data": {
    "accesstoken": "",
    "refreshtoken": ""
  },
  "error": null
}`;

const tokensErrorExample = `{
  "status": "fail",
  "error": "invalid external ID"
}`;

const pricesSuccessExample = `{
  "status": "success",
  "data": {
    "gold": {
      "buy": 123,
      "sell": 231
    },
    "silver": {
      "buy": 123,
      "sell": 231
    }
  },
  "error": null
}`;

const pricesErrorExample = `{
  "status": "fail",
  "error": "token expired"
}`;

const regenerateBodyExample = `{
  "token": "Bearer <refreshtoken>"
}`;

const regenerateSuccessExample = `{
  "status": "success",
  "data": {
    "accesstoken": ""
  },
  "error": null
}`;

const regenerateErrorExample = `{
  "status": "fail",
  "error": "invalid or missing refresh token"
}`;

const Documentation = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const company = useMemo(
    () => mockCompanies.find((c) => c.id === companyId),
    [companyId],
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // silent fail; in a real app we might show a toast
    }
  };

  const handleDownloadPdf = () => {
    // Let the browser's print dialog handle "Save as PDF" with current layout
    window.print();
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground font-body">
          Company not found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display text-foreground">
              Integration Documentation
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              For partner:{" "}
              <span className="font-semibold text-foreground">
                {company.name}
              </span>
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button
            type="button"
            variant="gold-outline"
            size="sm"
            onClick={handleDownloadPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Section 1: Getting Tokens */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            1. Getting Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-body text-muted-foreground">
            Use this endpoint to obtain access and refresh tokens for
            synchronizing data with our system.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-body font-medium">Request</p>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
              GET /company/sync/:externalID
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body font-medium">
                  ✔ Success Response
                </p>
                <span className="text-xs font-body text-muted-foreground">
                  Status Code: 200
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(tokensSuccessExample)}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
              <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
                <code>{tokensSuccessExample}</code>
              </pre>
            </div>

            <div className="space-y-1 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body font-medium">
                  ❌ Error Response
                </p>
                <span className="text-xs font-body text-muted-foreground">
                  Status Code: 404
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(tokensErrorExample)}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
              <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
                <code>{tokensErrorExample}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Getting Prices */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            2. Getting Prices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-body text-muted-foreground">
            Use this endpoint to retrieve the latest gold and silver
            prices for your integration.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-body font-medium">Request</p>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
              GET /company/price/:accesstoken
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body font-medium">
                  ✔ Success Response
                </p>
                <span className="text-xs font-body text-muted-foreground">
                  Status Code: 200
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(pricesSuccessExample)}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
              <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
                <code>{pricesSuccessExample}</code>
              </pre>
            </div>
            <div className="space-y-1 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body font-medium">
                  ❌ Error Response
                </p>
                <span className="text-xs font-body text-muted-foreground">
                  Status Code: 401
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(pricesErrorExample)}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
              <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
                <code>{pricesErrorExample}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Regenerating Access Token */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            3. Regenerating Access Token
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-body text-muted-foreground">
            Use this endpoint to generate a new access token using a valid refresh token.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-body font-medium">Request</p>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs">
              POST /company/generate-refresh-token
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body font-medium">
                Example Body
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(regenerateBodyExample)}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
            </div>
            <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
              <code>{regenerateBodyExample}</code>
            </pre>
          </div>
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body font-medium">
                ✔ Success Response
              </p>
              <span className="text-xs font-body text-muted-foreground">
                Status Code: 200
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(regenerateSuccessExample)}
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
              <code>{regenerateSuccessExample}</code>
            </pre>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body font-medium">
                ❌ Error Response
              </p>
              <span className="text-xs font-body text-muted-foreground">
                Status Code: 400
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleCopy(regenerateErrorExample)}
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <pre className="mt-1 rounded-md border border-border bg-muted/40 p-4 font-mono text-xs overflow-x-auto">
              <code>{regenerateErrorExample}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;


