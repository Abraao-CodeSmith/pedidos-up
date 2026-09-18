import React from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';

export const CommentSection = ({ comments = [] }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl glass-card border border-purple-500/20 text-purple-400/60 my-4">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50 stroke-1" />
        <p className="text-sm font-medium">Nenhum comentário registrado para este pedido até o momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="font-heading font-bold text-lg text-purple-100">
          Comentários e Atualizações ({comments.length})
        </h3>
      </div>

      <div className="space-y-3">
        {comments.map((comment, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl glass-card border-l-4 border-l-purple-500 border-purple-500/20 shadow-md transition-all hover:border-purple-400/40"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-900/80 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-purple-200">{comment.author}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-purple-400/80 font-mono">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{comment.date}</span>
              </div>
            </div>

            <p className="text-sm text-purple-100/90 whitespace-pre-line leading-relaxed pl-1">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
