# 🚀 Pedidos UP - Sistema Inteligente de Gestão & Rastreamento de Pedidos

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Trello API](https://img.shields.io/badge/Trello-API_Integration-0052CC?style=for-the-badge&logo=trello&logoColor=white)

O **Pedidos UP** é um sistema web moderno, robusto e intuitivo projetado para transformar o acompanhamento e a gestão de pedidos utilizando quadros do **Trello** em tempo real.

O projeto une um backend escalável em Node.js/Express (com banco SQLite e suporte multi-usuário) a um frontend em React + Vite com design cósmico de alto padrão (*glassmorphism*, tons profundos de violeta/roxo e brilhos neon).

---

## 🌟 Funcionalidades Principais

### 🔒 1. Autenticação & Gestão Multi-Usuário
- Cadastro de conta vinculando credenciais próprias do Trello (**API Key**, **Token** e **ID do Quadro**).
- Criptografia de senhas com `bcryptjs` e emissão de tokens seguros `JWT`.
- Isolamento de dados: cada usuário visualiza e gerencia apenas seu próprio quadro e pedidos.

### 📋 2. Dashboard Kanban Interativo (`/dashboard`)
- **Organização em Colunas:** Sincronização automática com as listas do quadro do Trello.
- **Visualização Limpa:** Exibe apenas o nome do pedido em cada cartão para máxima clareza.
- **Modal de Detalhes (`CardModal`):**
  - Exibe o **ID do Cartão** com cópia rápida em 1 clique.
  - Link direto para abrir o cartão no site oficial do Trello.
  - **Gerador de Link de Rastreio Direto para o Cliente Final** (`/track/:cardId`).
  - Carregamento de datas de previsão, status e comentários da equipe.

### 🔍 3. Portal de Rastreamento Público para o Cliente Final (`/track`)
- **Acesso Aberto (Sem Login):** O cliente final pode consultar seu pedido via barra de pesquisa ou pelo link direto recebido (`/track/ID_DO_CARTAO`).
- **Timeline Interativa de Status:** Visualização do progresso pelas etapas:
  1. *Em Análise*
  2. *Em Produção*
  3. *Disponível Para Retirada*
  4. *Finalizado*
- **Histórico de Comentários:** Exibe observações e atualizações do pedido registradas no Trello.
- **Tratamento de Erros Amigável:** IDs inexistentes ou inválidos exibem um estado limpo e informativo (*"Pedido Não Encontrado"*), orientando o cliente a verificar o código.

---

## 🏗️ Arquitetura do Projeto

```text
cardTrello/
├── .env.example               # Modelo de variáveis de ambiente
├── .gitignore                 # Regras de segurança para versionamento Git
├── package.json               # Dependências do backend e scripts de execução
├── database.sqlite            # Banco de dados local SQLite (gerado automaticamente)
├── schema.sql                 # Schema inicial da tabela de usuários
├── src/                       # Backend Node.js / Express
│   ├── server.js              # Ponto de entrada do servidor HTTP (Porta 3004)
│   ├── app.js                 # Middlewares globais e rotas Express
│   ├── config/                # Variáveis de ambiente e constantes
│   ├── controllers/           # Controllers (authController, trelloController)
│   ├── services/              # Serviços de negócio (authService, trelloService, userService)
│   ├── middlewares/           # Autenticação JWT e tratamento global de erros
│   └── routes/                # Definição de rotas da API
└── client/                    # Frontend React 18 + Vite + Tailwind CSS
    ├── index.html             # HTML principal com fontes Google (Plus Jakarta Sans & Space Grotesk)
    ├── vite.config.js         # Configuração do Vite com Tailwind v4 e proxy de desenvolvimento
    └── src/
        ├── index.css          # Design system cósmico, utilitários glassmorphism e temas
        ├── App.jsx            # Roteamento de páginas públicas e privadas
        ├── context/           # Contexto global de autenticação (AuthContext)
        ├── services/          # Clientes HTTP Axios (api.js, authService, trelloService)
        ├── components/        # Componentes reutilizáveis (Navbar, KanbanColumn, CardModal, etc.)
        └── pages/             # Telas principais (AuthPage, DashboardPage, TrackingPage, NotFoundPage)
```

---

## ⚡ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js** (versão `18.0.0` ou superior)
- **npm** (gerenciador de pacotes padrão do Node)

---

## 🔧 Passo a Passo de Instalação

### 1. Clonar o Repositório
```bash
git clone https://github.com/Abraao-CodeSmith/pedidos-up.git
cd pedidos-up
```

### 2. Instalar Dependências do Backend e Frontend
Na raiz do projeto, execute:
```bash
# Instala as dependências do backend
npm install

# Instala as dependências do frontend React
cd client
npm install
cd ..
```

### 3. Configurar as Variáveis de Ambiente (`.env`)
Copie o arquivo `.env.example` para `.env` na raiz do projeto:
```bash
cp .env.example .env
```
Edite o arquivo `.env` ajustando o `JWT_SECRET` e, opcionalmente, as credenciais padrão do Trello para o rastreio público:
```env
PORT=3004
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
DATABASE_PATH=./database.sqlite

# Opcional - Credenciais padrão para fallback do rastreio público
API_KEY=sua_trello_api_key
TOKEN=seu_trello_token
BOARD_ID=seu_trello_board_id
```

---

## 🚀 Como Executar a Aplicação

### Modo de Desenvolvimento Conjunto (Recomendado)
Execute ambos os servidores (Backend Express na porta `3004` e Frontend Vite na porta `5173`) simultaneamente com um único comando na raiz:

```bash
npm run dev:all
```

- **Painel / Web App:** [http://localhost:5173](http://localhost:5173)
- **API Backend:** [http://localhost:3004/api](http://localhost:3004/api)

### Executando em Comandos Separados
Se preferir rodar em terminais distintos:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

---

## 📡 Endpoints da API REST

### Autenticação (`/api/auth`)
| Método | Rota | Descrição | Requer Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Cadastro de novo usuário com credenciais do Trello | ❌ |
| `POST` | `/api/auth/login` | Autenticação e geração de token JWT | ❌ |
| `GET` | `/api/auth/me` | Retorna dados do usuário autenticado |  |

### Trello & Pedidos (`/api`)
| Método | Rota | Descrição | Requer Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/board/columns` | Lista as colunas e cartões do quadro do usuário logado |  |
| `GET` | `/api/orders/:cardId` | Busca detalhes completos de um cartão do usuário |  |
| `GET` | `/api/public/orders/:cardId` | Busca pública de pedido para o cliente final | ❌ |

---

## 🌐 Guia de Deploy na VPS (Produção)

1. **Compilar o Frontend:**
   ```bash
   cd client
   npm run build
   cd ..
   ```
   *(O backend Express já está programado para servir estaticamente os arquivos de `client/dist`).*

2. **Gerenciador de Processos (PM2):**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "pedidos-up"
   pm2 save
   ```

3. **Configuração Nginx & SSL (Certbot):**
   Redirecione as requisições na porta 80/443 para `http://localhost:3004`. O link de rastreamento do cliente final se adaptará automaticamente ao seu domínio (`https://seu-dominio.com/track/ID_DO_CARTAO`).

---

## 📄 Licença

Este projeto é desenvolvido sob a licença **ISC**. Sinta-se livre para utilizar, modificar e distribuir.
