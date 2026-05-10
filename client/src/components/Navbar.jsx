import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationsDropdown from "./NotificationsDropdown";
import { 
  LogOut, 
  LayoutDashboard, 
  Search, 
  ShieldCheck, 
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Browse", path: "/", icon: Search, roles: ["student", "instructor", "admin"] },
    { name: "My Learning", path: "/dashboard", icon: LayoutDashboard, roles: ["student", "instructor", "admin"] },
    { name: "Teach", path: "/instructor", icon: BarChart3, roles: ["instructor", "admin"] },
    { name: "Moderation", path: "/admin/moderation", icon: ShieldCheck, roles: ["admin"] },
  ];

  const activeLink = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="Acadify Logo" 
                className="w-10 h-10 object-contain transition-transform group-hover:rotate-6 shadow-lg shadow-blue-500/10 rounded-xl"
              />
              <span className="text-2xl font-black text-gray-900 tracking-tighter transition-colors group-hover:text-blue-600">
                Acadify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              (!link.roles || (user && link.roles.includes(user.role))) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeLink(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${activeLink(link.path) ? "animate-pulse" : ""}`} />
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* User Actions Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <NotificationsDropdown />
                <div className="h-6 w-px bg-gray-200 mx-1" />
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {user.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-black/5 hover:shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user && <NotificationsDropdown />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              (!link.roles || (user && link.roles.includes(user.role))) && (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    activeLink(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              )
            ))}
            {user ? (
               <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-red-600 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-2xl border border-gray-200 font-bold text-gray-700">Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-2xl bg-gray-900 text-white font-bold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
