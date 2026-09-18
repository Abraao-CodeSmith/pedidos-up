import React from 'react';
import { Package } from 'lucide-react';

export const KanbanCard = ({ card, onClick }) => {
  return (
    <div
      onClick={() => onClick(card)}
      className="group relative cursor-pointer p-4 rounded-xl glass-card transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-400 group-hover:text-purple-200 group-hover:border-purple-400/40 transition-colors">
          <Package className="w-4 h-4" />
        </div>

        {/* Exibe APENAS o Nome do Cartão como especificado nos requisitos */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-purple-100 group-hover:text-white transition-colors leading-snug break-words">
            {card.name}
          </h4>
        </div>
      </div>
    </div>
  );
};
