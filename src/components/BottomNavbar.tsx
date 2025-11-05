import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, LayoutDashboard, Tags } from "lucide-react";

const BottomNavbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-800 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2 text-sm text-accent">
        <NavItem to="/" icon={<Home className="h-5 w-5" />} label="Home" active={isActive("/")} />
        <NavItem to="/blog" icon={<BookOpen className="h-5 w-5" />} label="Blog" active={isActive("/blog")} />
        <NavItem to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active={isActive("/dashboard")} />
        <NavItem to="/categories" icon={<Tags className="h-5 w-5" />} label="Categories" active={isActive("/categories")} />
      </div>
    </nav>
  );
};

const NavItem = ({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center w-full gap-1 px-3 py-2 rounded-md transition-all ${
      active
        ? "text-white bg-accent shadow-md"
        : "text-black hover:text-accent"
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Link>
);

export default BottomNavbar;
