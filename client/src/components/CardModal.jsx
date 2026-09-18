import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Hash, Link2, Calendar, MessageSquare, Check, Sparkles } from 'lucide-react';
import { trelloService } from '../services/trelloService';
import { LoadingSpinner } from './LoadingSpinner';

export const CardModal = ({ card, onClose, onShowToast }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!card?.id) return;
    
    let isMounted = true;
    setLoading(true);

    trelloService.getOrderCard(card.id)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar detalhes do cartão:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [card?.id]);

  if (!card) return null;

  // URL pública de rastreamento enviada ao cliente
  const trackingLink = `${window.location.origin}/track/${card.id}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      onShowToast('ID do cartão copiado para a área de transferência!', 'success');
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShowToast('Link de rastreio copiado para enviar ao cliente!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-purple-500/20 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Detalhes do Cartão
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-tight">
              {card.name}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 border border-purple-500/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-6 pr-1 custom-scrollbar">
          
          {/* Seção 1: ID do Cartão */}
          <div className="p-4 rounded-2xl glass-card border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-300">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-purple-400 font-medium block">ID do Cartão (Trello)</span>
                <code className="text-sm font-mono font-bold text-purple-200 select-all">{card.id}</code>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(card.id, 'id')}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-semibold text-purple-200 transition-all hover:scale-105"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId ? 'Copiado!' : 'Copiar ID'}</span>
            </button>
          </div>

          {/* Seção 2: Link de Rastreio Público do Cliente */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/90 to-violet-950/80 border border-purple-500/40 shadow-lg shadow-purple-900/20 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-white">Link Direto de Rastreamento (Cliente Final)</span>
            </div>
            <p className="text-xs text-purple-300/80">
              Copie este link para enviar ao seu cliente. Ele poderá acompanhar todo o progresso do pedido sem precisar se autenticar.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={trackingLink}
                className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono select-all text-purple-200"
              />
              <button
                onClick={() => copyToClipboard(trackingLink, 'link')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>

          {/* Seção 3: Link direto do Trello */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-300">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-purple-400 font-medium block">Quadro do Trello</span>
                <span className="text-sm font-semibold text-purple-200">Acessar no Trello Oficial</span>
              </div>
            </div>
            <a
              href={card.shortUrl || card.url || `https://trello.com/c/${card.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 text-xs font-semibold text-purple-200 transition-all hover:scale-105"
            >
              <span>Abrir no Trello</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Seção 4: Status do Pedido & Comentários (Carregamento assíncrono) */}
          {loading ? (
            <LoadingSpinner size="medium" text="Carregando detalhes adicionais..." />
          ) : details ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl glass-card border border-purple-500/20">
                  <span className="text-xs text-purple-400 block mb-1">Status Atual</span>
                  <span className="text-sm font-bold text-white px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-500/30 inline-block">
                    {details.status}
                  </span>
                </div>
                <div className="p-3 rounded-xl glass-card border border-purple-500/20">
                  <span className="text-xs text-purple-400 block mb-1">Data Prevista</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-200">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{details.dueDate || 'Não definida'}</span>
                  </div>
                </div>
              </div>

              {/* Seção de comentários */}
              {details.comments && details.comments.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Últimos Comentários ({details.comments.length})
                    </span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {details.comments.map((comment, index) => (
                      <div key={index} className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs space-y-1">
                        <div className="flex justify-between text-purple-400 font-semibold">
                          <span>{comment.author}</span>
                          <span className="text-[10px] text-purple-400/60">{comment.date}</span>
                        </div>
                        <p className="text-purple-200">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

        </div>

        {/* Rodapé do Modal */}
        <div className="pt-4 border-t border-purple-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 text-xs font-bold text-purple-200 transition-all"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
