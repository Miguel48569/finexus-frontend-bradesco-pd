# 💳 Finexus — Plataforma de Crédito Colaborativo

Frontend desenvolvido durante a **Residência Tecnológica Porto Digital** em parceria com o **Bradesco** e o **SENAC PE**.  
A **Finexus** conecta **microempreendedores (MEI)** que precisam de crédito a **investidores** que desejam aplicar com impacto social e retorno justo.

---

## 🌐 Aplicação em Produção

**🔗 URL do Site (Vercel):** `https://finexus-frontend-bradesco-pd-ejhy.vercel.app`

**🔗 URL do Backend (Render):** `https://finexus-backend.onrender.com`

> Acesse a aplicação completa através do link acima. O backend está hospedado no Render e o frontend na Vercel.

---

## 🚀 Tecnologias

- **Next.js 14** • Framework React moderno com App Router
- **TypeScript** • Tipagem estática para mais segurança
- **Tailwind CSS** • Estilização rápida e responsiva
- **Framer Motion** • Animações fluidas
- **Lucide React** e **Heroicons** • Ícones modernos
- **Recharts** • Biblioteca de gráficos responsivos
- **Axios** • Cliente HTTP para integração com backend

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** versão 18.x ou superior ([Download aqui](https://nodejs.org/))
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** ([Download aqui](https://git-scm.com/))

---

## 🔧 Passo a Passo para Execução do MVP

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/Miguel48569/finexus-frontend-bradesco-pd.git
cd finexus-frontend-bradesco-pd
```

### 2️⃣ Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL do Backend em Produção (Render) - Recomendado para testes
NEXT_PUBLIC_API_URL=https://finexus-backend.onrender.com/api

# Para desenvolvimento local, comente a linha acima e descomente abaixo:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Outras configurações
NEXT_PUBLIC_APP_NAME=Finexus
```

> **💡 Dica para Avaliadores:**  
> A configuração acima já está pronta para uso! Com a URL do backend em produção ativa, você pode **testar o Frontend imediatamente** sem precisar configurar ou executar o Backend localmente. Basta clonar o projeto, instalar as dependências e rodar `npm run dev`.
>
> **Para Desenvolvedores:** Se você estiver desenvolvendo localmente e precisar testar com o backend local, comente a URL de produção e descomente a URL localhost.
### 4️⃣ Execute o Backend (Opcional)

> **⚠️ ATENÇÃO:**  
> **Se você configurou a URL de Produção no passo anterior** (`.env.local` com `https://finexus-backend.onrender.com/api`), **pule esta etapa**.  
> O backend já está rodando em produção e você não precisa configurá-lo localmente.

**Apenas para desenvolvedores que escolheram rodar o backend localmente:**

A aplicação frontend depende do backend para funcionar corretamente. Certifique-se de que o backend está rodando:

1. Clone o repositório do backend (se ainda não fez)
2. Configure o banco de dados PostgreSQL
3. Execute o backend na porta 8080 (padrão)

Para mais detalhes, consulte o README do backend.

### 5️⃣ Inicie o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 6️⃣ Acesse a Aplicação

Abra seu navegador e acesse:

- **Frontend:** http://localhost:3000
- **Backend API (Local):** http://localhost:8080/api
- **Backend API (Produção):** https://finexus-backend.onrender.com/api

### 7️⃣ Credenciais de Teste (Opcional)

Para testar a aplicação, você pode criar usuários através da tela de cadastro ou usar credenciais pré-cadastradas no banco de dados.

**Exemplo de usuário MEI (Tomador):**

- CPF: 888.888.888-88 
- Senha: 123456

**Exemplo de usuário Investidor:**

- Email: 555.555.555-55
- Senha: 123456

> **Atenção:** o BACKEND demora para acordar então depois de logar vai dar erro de conexão, então é so esperar uns minutos e vai funcionar

---

## 🏗️ Build para Produção

Para criar uma build otimizada para produção:

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

Isso criará uma versão otimizada da aplicação na pasta `.next` e iniciará o servidor em modo de produção.

---

## 📁 Estrutura do Projeto

```
finexus_frontend/
├── src/
│   ├── app/                    # Páginas e rotas (Next.js App Router)
│   │   ├── (auth)/            # Rotas de autenticação (login, cadastro)
│   │   ├── (interno)/         # Rotas internas (dashboard, carteira, etc)
│   │   ├── layout.tsx         # Layout global
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes reutilizáveis
│   │   └── sidebar.tsx        # Sidebar de navegação
│   ├── services/              # Serviços de API (Axios)
│   │   ├── api.ts            # Configuração base do Axios
│   │   ├── users.ts          # Serviço de usuários
│   │   ├── saldo.ts          # Serviço de saldo
│   │   ├── investimento.ts   # Serviço de investimentos
│   │   ├── proposta.ts       # Serviço de propostas
│   │   ├── divida.ts         # Serviço de dívidas
│   │   └── parcela.ts        # Serviço de parcelas
│   └── lib/                   # Utilitários e configurações
├── public/                    # Arquivos estáticos (imagens, logos)
├── .env.local                # Variáveis de ambiente (criar manualmente)
├── package.json              # Dependências do projeto
├── tailwind.config.js        # Configuração do Tailwind CSS
└── tsconfig.json             # Configuração do TypeScript
```

---

## 🔌 Integração com Backend

A aplicação frontend consome as seguintes APIs do backend:

### **Autenticação**

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Cadastro de novo usuário

### **Usuários**

- `GET /usuarios/{id}` - Buscar dados do usuário
- `PUT /usuarios/{id}` - Atualizar perfil do usuário

### **Saldo**

- `GET /saldos/usuario/{id}` - Buscar saldo do usuário
- `POST /saldos/resgatar` - Resgatar saldo disponível

### **Investimentos**

- `GET /investimentos/investidor/{id}` - Listar investimentos do investidor
- `GET /investimentos/proposta/{id}` - Listar investimentos de uma proposta
- `POST /investimentos` - Criar novo investimento

### **Propostas**

- `GET /propostas/abertas` - Listar propostas abertas (marketplace)
- `GET /propostas/{id}` - Buscar detalhes de uma proposta
- `GET /propostas/usuario/{id}` - Listar propostas do MEI
- `POST /propostas` - Criar nova proposta de empréstimo

### **Dívidas e Parcelas**

- `GET /dividas/tomador/{id}` - Buscar dívidas do tomador
- `GET /dividas/proposta/{id}` - Buscar dívida por proposta
- `GET /parcelas/divida/{id}` - Listar parcelas de uma dívida
- `POST /parcelas/{id}/pagar` - Pagar parcela

---

## 🧪 Testando a Aplicação

### **1. Cadastro de Usuário**

1. Acesse http://localhost:3000/cadastro
2. Escolha o tipo de usuário (MEI ou Investidor)
3. Preencha os dados e confirme

### **2. Login**

1. Acesse http://localhost:3000/login
2. Entre com suas credenciais
3. Você será redirecionado para o dashboard correspondente

### **3. Fluxo MEI (Tomador)**

- **Dashboard:** Visualize resumo financeiro e propostas
- **Solicitar Empréstimo:** Crie uma nova proposta de crédito
- **Pagamentos:** Gerencie e pague parcelas pendentes
- **Extrato:** Acompanhe movimentações financeiras
- **Perfil:** Edite suas informações pessoais

### **4. Fluxo Investidor**

- **Carteira:** Visualize seus investimentos e saldo
- **Marketplace:** Browse e invista em propostas abertas
- **Extrato:** Acompanhe investimentos e retornos
- **Perfil:** Edite suas informações pessoais

---

## 🛠️ Troubleshooting

### **Erro de conexão com API**

- Verifique se o backend está rodando em http://localhost:8080
- Confirme a variável `NEXT_PUBLIC_API_URL` no arquivo `.env.local`
- Verifique as configurações de CORS no backend

### **Erro 404 ao buscar dados**

- Certifique-se de que existem dados no banco de dados
- Verifique se o userId está correto no localStorage
- Confirme que as rotas da API estão corretas

### **Problemas com autenticação**

- Limpe o localStorage do navegador
- Verifique se o token JWT está sendo gerado corretamente no backend
- Confirme que as credenciais estão corretas

### **Erros de build**

```bash
# Limpe o cache e reinstale dependências
rm -rf node_modules .next
npm install
npm run dev
```

---

## 👥 Equipe de Desenvolvimento

Desenvolvido durante a Residência Tecnológica Porto Digital em parceria com Bradesco e SENAC PE.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais durante a Residência Tecnológica.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento ou consulte a documentação do backend.
