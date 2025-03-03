import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@rewind-ui/core";

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">cogvisAI Alarm System</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button color="white" size="sm">
                Alarms
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
