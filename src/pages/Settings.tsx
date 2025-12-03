import { User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-display text-foreground">Settings</h1>
        <p className="text-muted-foreground font-body mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">Profile</CardTitle>
              <CardDescription className="font-body">
                Manage your personal information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body">First Name</Label>
              <Input defaultValue="Admin" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Last Name</Label>
              <Input defaultValue="User" className="font-body" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-body">Email Address</Label>
            <Input defaultValue="admin@dahabmasr.com" type="email" className="font-body" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">Notifications</CardTitle>
              <CardDescription className="font-body">
                Configure how you receive notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-medium">Markup Change Alerts</p>
              <p className="text-sm text-muted-foreground font-body">
                Get notified when markups are updated
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground font-body">
                Receive daily summary emails
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-medium">New Company Alerts</p>
              <p className="text-sm text-muted-foreground font-body">
                Get notified when new companies are added
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">Security</CardTitle>
              <CardDescription className="font-body">
                Manage your security preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="font-body" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body">New Password</Label>
              <Input type="password" placeholder="••••••••" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" className="font-body" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-body font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground font-body">
                Add an extra layer of security
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">Appearance</CardTitle>
              <CardDescription className="font-body">
                Customize the look and feel
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground font-body">
                Use smaller spacing and fonts
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-medium">Animations</p>
              <p className="text-sm text-muted-foreground font-body">
                Enable smooth transitions
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gold" size="lg" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
