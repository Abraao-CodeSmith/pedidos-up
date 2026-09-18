import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 text-center">
      <div className="max-w-md p-8 rounded-3xl glass-panel border border-purple-500/30 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-cosmic flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
          <Rocket className="w-8 h-8 text-white rotate-45" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold font-heading text-white">404</h1>
          <h2 className="text-lg font-bold text-purple-200">Página não encontrada</h2>
          <p className="text-xs text-purple-300/70">
            A rota que você tentou acessar não existe ou foi movida no sistema.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white text-xs font-bold shadow-lg transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </Link>
      </div>
    </div>
  );
};
