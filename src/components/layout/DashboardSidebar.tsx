import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, History, Settings, LogOut, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/dahab-masr-logo.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Building2, label: "Companies", path: "/companies" },
  { icon: UsersIcon, label: "Users", path: "/users" },
  { icon: History, label: "Markup History", path: "/markup-history" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <img src={logo} alt="Dahab Masr" className="h-12 mx-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-gold border-l-2 border-gold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-gold"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-gold")} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </NavLink>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
