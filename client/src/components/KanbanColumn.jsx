import React from 'react';
import { KanbanCard } from './KanbanCard';
import { Layers } from 'lucide-react';

export const KanbanColumn = ({ column, onCardClick }) => {
  return (
    <div className="flex flex-col w-80 min-w-[320px] max-w-sm rounded-2xl glass-panel p-4 border border-purple-500/25 shadow-xl max-h-[calc(100vh-200px)]">
      
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 glow-purple" />
          <h3 className="font-heading font-bold text-base text-purple-100 tracking-wide truncate max-w-[200px]" title={column.listName}>
            {column.listName}
          </h3>
        </div>
        
        {/* Badge do total de cartões */}
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-900/60 border border-purple-500/30 text-purple-300">
          {column.totalCards}
        </span>
      </div>

      {/* Lista de Cartões da Coluna */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {column.cards && column.cards.length > 0 ? (
          column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} onClick={onCardClick} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-purple-400/50 border border-dashed border-purple-500/20 rounded-xl my-2">
            <Layers className="w-8 h-8 mb-2 stroke-1" />
            <p className="text-xs font-medium">Nenhum cartão nesta lista</p>
          </div>
        )}
      </div>
      
    </div>
  );
};
