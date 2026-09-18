import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { trelloService } from '../services/trelloService';
import { KanbanColumn } from '../components/KanbanColumn';
import { CardModal } from '../components/CardModal';
import { Toast } from '../components/Toast';
import { SkeletonKanban } from '../components/LoadingSpinner';
import { RefreshCw, LayoutDashboard, Kanban, AlertCircle, Sparkles } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Estado do Modal e Toast
  const [selectedCard, setSelectedCard] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchBoardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await trelloService.getBoardColumns();
      setBoardData(data);
    } catch (err) {
      console.error('Erro ao carregar quadro do Trello:', err);
      const msg = err.response?.data?.error || err.message || 'Falha ao carregar as colunas do quadro. Verifique suas chaves do Trello.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Cálculo de total de cartões em todas as colunas
  const totalCardsCount = boardData?.columns?.reduce((acc, col) => acc + (col.totalCards || 0), 0) || 0;

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Barra de Status e Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-cosmic shadow-lg shadow-purple-500/30">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Quadro de Pedidos
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-900/80 border border-purple-500/30 text-purple-300">
                Trello Sync
              </span>
            </div>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Visualização Kanban em colunas. Clique em qualquer cartão para ver o ID e gerar a URL de rastreio para o cliente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Métricas rápidas */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-2xl glass-card border border-purple-500/20 text-xs font-semibold text-purple-200">
            <div>
              <span className="text-purple-400 block text-[10px]">Colunas</span>
              <span className="text-sm font-bold text-white">{boardData?.totalColumns || 0}</span>
            </div>
            <div className="w-px h-6 bg-purple-500/20" />
            <div>
              <span className="text-purple-400 block text-[10px]">Total de Pedidos</span>
              <span className="text-sm font-bold text-white">{totalCardsCount}</span>
            </div>
          </div>

          <button
            onClick={() => fetchBoardData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-bold text-purple-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-purple-300 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Atualizando...' : 'Atualizar Quadro'}</span>
          </button>
        </div>
      </div>

      {/* Exibição de Erro */}
      {error && (
        <div className="p-6 rounded-3xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-start gap-4 shadow-2xl">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-rose-100">Não foi possível carregar os pedidos</h3>
            <p className="text-xs text-rose-300/90">{error}</p>
            <button
              onClick={() => fetchBoardData(false)}
              className="mt-3 px-4 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-500/40 text-xs font-bold text-white transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal do Kanban */}
      {loading ? (
        <SkeletonKanban />
      ) : boardData?.columns && boardData.columns.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 items-start custom-scrollbar">
          {boardData.columns.map((column) => (
            <KanbanColumn
              key={column.listId}
              column={column}
              onCardClick={(card) => setSelectedCard(card)}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-purple-500/30 my-8 space-y-4">
          <Kanban className="w-12 h-12 mx-auto text-purple-400/50 stroke-1" />
          <h3 className="text-lg font-bold text-white">Nenhuma coluna ou cartão encontrado</h3>
          <p className="text-xs text-purple-300/70 max-w-md mx-auto">
            Verifique se o seu quadro no Trello possui listas com cartões cadastrados.
          </p>
        </div>
      ) : null}

      {/* Modal de Detalhes do Cartão */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onShowToast={showToast}
        />
      )}

      {/* Notificações Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

    </div>
  );
};
