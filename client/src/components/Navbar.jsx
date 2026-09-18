import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, LayoutDashboard, Search, LogOut, UserCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-500/20 backdrop-blur-xl bg-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Marca */}
        <Link to={isAuthenticated ? "/dashboard" : "/track"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-cosmic flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-violet-400 tracking-wider">
              PEDIDOS <span className="text-purple-400 font-extrabold glow-text">UP</span>
            </span>
            <span className="text-[10px] text-purple-400/70 tracking-widest uppercase font-medium">
              Gestão & Rastreamento
            </span>
          </div>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'text-purple-300/80 hover:text-white hover:bg-purple-900/30 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          <Link
            to="/track"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              location.pathname.startsWith('/track')
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'text-purple-300/80 hover:text-white hover:bg-purple-900/30 border border-transparent'
            }`}
          >
            <Search className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Rastreio Público</span>
          </Link>

          {/* Área do Usuário / Ações */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-3 border-l border-purple-500/20">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-purple-200">{user?.name}</span>
                <span className="text-[10px] text-purple-400/80 truncate max-w-[140px]">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                title="Sair do sistema"
                className="flex items-center justify-center p-2.5 rounded-xl text-purple-300/80 hover:text-rose-300 hover:bg-rose-950/30 border border-purple-500/20 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-cosmic text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Entrar</span>
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};
