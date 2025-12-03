import { Building2, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCompanies } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Companies",
    value: mockCompanies.length.toString(),
    icon: Building2,
    change: "+2 this month",
    trend: "up",
  },
  {
    title: "Avg Gold Buy Markup",
    value: "2.48%",
    icon: TrendingUp,
    change: "+0.15% from last week",
    trend: "up",
  },
  {
    title: "Avg Gold Sell Markup",
    value: "2.98%",
    icon: TrendingDown,
    change: "-0.05% from last week",
    trend: "down",
  },
  {
    title: "Markup Changes Today",
    value: "3",
    icon: Activity,
    change: "Active trading day",
    trend: "neutral",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  
  function handleCompanyId(company: { id: string }): void {
    console.log("Company ID:", company.id);
    navigate(`/companies/${company.id}`);
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">
          Overview of your companies and markup values
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="border-border shadow-elegant hover:shadow-gold transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Companies */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Recent Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCompanies.slice(0, 5).map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors"
                onClick={() => handleCompanyId({ id: company.id })}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={company.imageurl ?? "/placeholder-dm.png"}
                    className="w-12 contain rounded-sm"
                  ></img>
                  <div>
                    <p className="font-body font-medium text-foreground">
                      {company.name}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      Last updated:{" "}
                      {new Date(company.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-body text-muted-foreground">
                    Gold Markup
                  </p>
                  <p className="font-display font-semibold text-gold">
                    {company.currentMarkup.goldBuy} LE |{" "}
                    {company.currentMarkup.goldSell} LE
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
