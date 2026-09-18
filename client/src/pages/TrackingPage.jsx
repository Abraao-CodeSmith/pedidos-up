import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trelloService } from '../services/trelloService';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { CommentSection } from '../components/CommentSection';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Toast } from '../components/Toast';
import { Search, Package, Sparkles, Copy, Check, AlertCircle, RefreshCw, Radio, ShieldCheck } from 'lucide-react';

export const TrackingPage = () => {
  const { cardId: routeCardId } = useParams();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(routeCardId || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrder = async (idToFetch, isBackgroundRefresh = false) => {
    if (!idToFetch || !idToFetch.trim()) return;

    const cleanId = idToFetch.trim();
    if (isBackgroundRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorState(false);
    setErrorMessage('');

    try {
      const data = await trelloService.getPublicOrderCard(cleanId);
      if (data && data.id) {
        setOrderData(data);
      } else {
        throw new Error('Dados do pedido não puderam ser processados.');
      }
    } catch (err) {
      console.error('Erro ao rastrear pedido:', err);
      // Se não for um refresh em segundo plano, exibe o estado de erro
      if (!isBackgroundRefresh) {
        setErrorState(true);
        setErrorMessage('Pedido não encontrado ou ID inválido. Por favor, verifique o código e tente novamente.');
        setOrderData(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Se a rota possui o parâmetro /track/:cardId, busca automaticamente
  useEffect(() => {
    if (routeCardId) {
      setSearchInput(routeCardId);
      fetchOrder(routeCardId, false);
    }
  }, [routeCardId]);

  // Polling / Auto-atualização a cada 15 segundos se houver um pedido carregado e a opção ativa
  useEffect(() => {
    let interval = null;
    const currentId = routeCardId || searchInput;

    if (autoRefreshEnabled && orderData && currentId) {
      interval = setInterval(() => {
        fetchOrder(currentId, true);
      }, 15000); // 15 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled, orderData, routeCardId, searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/track/${searchInput.trim()}`);
  };

  const handleManualRefresh = () => {
    const currentId = routeCardId || searchInput;
    if (currentId) {
      fetchOrder(currentId, true);
      setToastMessage('Status atualizado em tempo real!');
    }
  };

  const copyTrackingLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setToastMessage('Link de acompanhamento copiado com sucesso!');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto flex flex-col justify-center gap-8">
      
      {/* Seção Superior - Barra de Pesquisa Estilizada */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Portal do Cliente Final</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide">
          Acompanhe seu Pedido
        </h1>

        <p className="text-sm text-purple-300/80 max-w-md mx-auto">
          Insira abaixo o código ou ID do cartão do seu pedido para visualizar a linha do tempo e status em tempo real.
        </p>

        {/* Barra de Pesquisa Cósmica */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Digite o ID do pedido (ex: 658d913e...)"
              className="w-full pl-12 pr-36 py-4 rounded-2xl glass-input text-sm font-mono shadow-2xl focus:ring-2 focus:ring-purple-500/50"
            />

            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Consultar'}
            </button>
          </div>
        </form>
      </div>

      {/* Estado 1: Carregando Inicial */}
      {loading && (
        <div className="py-12 glass-panel rounded-3xl border border-purple-500/30">
          <LoadingSpinner size="large" text="Consultando status do pedido no sistema..." />
        </div>
      )}

      {/* Estado 2: Tratamento de Erro (ID Inexistente / Inválido) */}
      {!loading && errorState && (
        <div className="p-8 sm:p-12 text-center rounded-3xl glass-panel border border-rose-500/30 bg-rose-950/20 shadow-2xl space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold font-heading text-rose-100">
            Pedido Não Encontrado
          </h3>

          <p className="text-sm text-rose-200/80 max-w-md mx-auto leading-relaxed">
            {errorMessage}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { setErrorState(false); setSearchInput(''); }}
              className="px-6 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-xs font-bold text-white transition-all"
            >
              Limpar e Buscar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Estado 3: Sucesso - Exibição dos Dados do Pedido */}
      {!loading && orderData && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Card Principal do Pedido */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/30 shadow-2xl space-y-6">
            
            {/* Header do Pedido */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                    Pedido #{orderData.shortId || '---'}
                  </span>

                  {/* Indicador de Auto-Atualização em Tempo Real */}
                  <div
                    onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                    title="Clique para alternar a atualização automática a cada 15s"
                    className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-semibold text-purple-300 cursor-pointer hover:border-purple-400 transition-all"
                  >
                    <span className={`w-2 h-2 rounded-full ${autoRefreshEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                    <span>{autoRefreshEnabled ? 'Auto 15s' : 'Auto Off'}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold font-heading text-white">
                  {orderData.name}
                </h2>
              </div>

              {/* Status Badge + Botões de Ação */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-400/40 text-purple-200 text-xs font-bold glow-purple">
                  Status: <span className="text-white">{orderData.status}</span>
                </div>

                {/* Botão de Atualização Manual */}
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  title="Atualizar status agora"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-xs font-bold text-purple-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>

                {/* Botão de Copiar Link */}
                <button
                  onClick={copyTrackingLink}
                  title="Copiar link desta consulta"
                  className="p-2.5 rounded-xl glass-card border border-purple-500/30 text-purple-300 hover:text-white transition-all hover:scale-105"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Linha do Tempo de Rastreio */}
            <div className="py-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">
                Evolução do Pedido
              </h3>
              <TrackingTimeline
                currentStep={orderData.step}
                listDates={orderData.listDates}
                dueDate={orderData.dueDate}
              />
            </div>

            {/* Seção de Comentários e Atualizações */}
            <div className="pt-4 border-t border-purple-500/20">
              <CommentSection comments={orderData.comments} />
            </div>

          </div>

        </div>
      )}

      {/* Estado 4: Tela Inicial Sem Pesquisa */}
      {!loading && !orderData && !errorState && (
        <div className="p-8 text-center rounded-3xl glass-panel border border-purple-500/20 space-y-4">
          <ShieldCheck className="w-12 h-12 mx-auto text-purple-400/50 stroke-1" />
          <h3 className="text-base font-bold text-purple-200">Consultas com Proteção e Atualização em Tempo Real</h3>
          <p className="text-xs text-purple-300/60 max-w-md mx-auto">
            Digite o ID fornecido no comprovante para acompanhar o progresso das etapas de produção e entrega.
          </p>
        </div>
      )}

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

    </div>
  );
};
