import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Lock, Mail, User, Key, ShieldCheck, Kanban, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    trelloApiKey: '',
    trelloToken: '',
    trelloBoardId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTrelloHelp, setShowTrelloHelp] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Validação de campos obrigatórios do Trello
        if (!formData.trelloApiKey || !formData.trelloToken || !formData.trelloBoardId) {
          throw new Error('Preencha obrigatoriamente a API Key, Token e ID do Quadro do Trello.');
        }

        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro na autenticação:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Erro ao realizar autenticação. Verifique os dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl overflow-hidden my-6">
        
        {/* Glows de Fundo */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho da Autenticação */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-cosmic shadow-lg shadow-purple-500/30 mb-2">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            {isRegister ? 'Criar Conta no Pedidos UP' : 'Acessar o Painel'}
          </h1>
          <p className="text-sm text-purple-300/80 max-w-md mx-auto">
            {isRegister
              ? 'Conecte seu quadro do Trello e automatize o acompanhamento de pedidos.'
              : 'Gerencie seus quadros e pedidos com visualização Kanban em tempo real.'}
          </p>
        </div>

        {/* Abas Alternadoras (Login / Cadastro) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass-card border border-purple-500/20 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
              !isRegister
                ? 'bg-gradient-cosmic text-white shadow-md glow-purple'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
              isRegister
                ? 'bg-gradient-cosmic text-white shadow-md glow-purple'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            Cadastrar-se
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome ou nome da empresa"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Credenciais OBRIGATÓRIAS do Trello no Cadastro */}
          {isRegister && (
            <div className="pt-4 border-t border-purple-500/20 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Kanban className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    Credenciais do Trello (Obrigatórias)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTrelloHelp(!showTrelloHelp)}
                  className="text-[11px] text-purple-400 hover:text-purple-200 flex items-center gap-1 underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Como obter?</span>
                </button>
              </div>

              {/* Guia de Ajuda do Trello */}
              {showTrelloHelp && (
                <div className="p-4 rounded-2xl bg-purple-950/90 border border-purple-500/30 text-xs text-purple-200 space-y-2 animate-fade-in">
                  <p className="font-bold text-white">Como pegar suas chaves do Trello:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-purple-300">
                    <li>Acesse <a href="https://trello.com/app-key" target="_blank" rel="noreferrer" className="text-purple-400 underline font-semibold">trello.com/app-key</a> para copiar sua <strong>API Key</strong>.</li>
                    <li>Na mesma página, clique em <em>"Token"</em> para gerar e autorizar seu <strong>Token de Acesso</strong>.</li>
                    <li>Abra seu quadro no Trello e copie o ID da URL (ex: <code>trello.com/b/<strong>BOARD_ID</strong>/meu-quadro</code>).</li>
                  </ol>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  Trello API Key *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="trelloApiKey"
                    required
                    value={formData.trelloApiKey}
                    onChange={handleChange}
                    placeholder="Cole sua API Key do Trello"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  Trello Token *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="trelloToken"
                    required
                    value={formData.trelloToken}
                    onChange={handleChange}
                    placeholder="Cole seu Token do Trello"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  ID do Quadro (Board ID) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <Kanban className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="trelloBoardId"
                    required
                    value={formData.trelloBoardId}
                    onChange={handleChange}
                    placeholder="Ex: 658d913eb379bcf13f13e1ac"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-6 rounded-xl bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white font-bold text-sm shadow-xl shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              <>
                <span>{isRegister ? 'Finalizar Cadastro' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-purple-400/80">
          Deseja apenas consultar um pedido?{' '}
          <Link to="/track" className="text-purple-300 font-bold underline hover:text-white">
            Acessar a Consulta Pública
          </Link>
        </div>

      </div>
    </div>
  );
};
