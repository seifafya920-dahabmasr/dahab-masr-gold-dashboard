import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Shield, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/data/mockData";
import { User } from "@/types/user";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const found = mockUsers.find((u) => u.id === id);
    if (found) {
      setUser(found);
    }
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground font-body">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display text-foreground">
              {user.name}
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs font-body uppercase tracking-wide">
            {user.accountType}
          </span>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body uppercase tracking-wide"
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                user.accountStatus === "Active"
                  ? "bg-emerald-500"
                  : "bg-destructive"
              }`}
            />
            {user.accountStatus}
          </span>
        </div>
      </div>

      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">
                Account Details
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm font-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                User ID
              </p>
              <p className="mt-1">{user.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Email
              </p>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Created At
              </p>
              <p className="mt-1">
                {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Created By
              </p>
              <button
                className="mt-1 text-gold hover:underline"
                onClick={() => navigate(`/users/${user.createdById}`)}
              >
                {user.createdByName}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">
                Permissions & Access
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm font-body text-muted-foreground">
          <p>
            This section can be extended to show detailed role-based permissions,
            activity history, and security settings for the user.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;


