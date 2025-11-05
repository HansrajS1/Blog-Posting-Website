import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PenTool, Home, BookOpen, LayoutDashboard, Tags } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              InkWell
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={isActive("/blog") ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/blog">
                <BookOpen className="h-4 w-4 mr-2" />
                Blog
              </Link>
            </Button>
            
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              variant={isActive("/categories") ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/categories">
                <Tags className="h-4 w-4 mr-2" />
                Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;