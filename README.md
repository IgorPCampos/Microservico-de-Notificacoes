# Microserviço de Notificações

Um sistema distribuído baseado em microsserviços para o disparo assíncrono de notificações (E-mails) validado por comunicação gRPC. O projeto foca em alta disponibilidade, mensageria e observabilidade.

## Tecnologias Utilizadas

- **Backend:** Node.js, NestJS, TypeScript
- **Mensageria:** RabbitMQ
- **Comunicação entre Serviços:** gRPC
- **Banco de Dados:** PostgreSQL, TypeORM
- **Monitoramento / DevOps:** Docker, Prometheus, Grafana
- **Documentação:** Swagger
- **Testes:** Jest

---

## Arquitetura

O projeto é dividido em 3 camadas principais:

1. **API Gateway:** Recebe requisições HTTP e publica mensagens na fila.
2. **Notification Service:** Consome mensagens do RabbitMQ, valida o usuário via gRPC e dispara o e-mail (Nodemailer/SMTP).
3. **User Service:** Gerencia a base de dados de usuários para validação.

---

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Docker Compose)

---

## Documentação

```bash
http://localhost:3000/docs
```

## Como Executar o Projeto

### Passo 1: Configurar Variáveis de Ambiente (.env)

Dentro da pasta do `notification-service, api-gateway e user-service`, crie um arquivo chamado `.env` e configure suas credenciais de e-mail baseado no `.env.example`

### Passo 2: Configurar Docker

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para subir o Banco de Dados e a Fila de Mensagens:

```bash
docker compose up -d
```

(Opcional) Se quiser subir também o painel de Monitoramento (Grafana/Prometheus):

```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml up -d
```

### Passo 3: Instalar Dependências e Rodar os Microsserviços

Terminal 1: User Service (Gerencia os usuários via gRPC)

```bash
cd user-service
npm install
npm run start:dev
```

Terminal 2: Notification Service (Consome a fila e envia os e-mails)

```bash
cd notification-service
npm install
npm run start:dev
```

Terminal 3: API Gateway (Porta de entrada HTTP e Swagger)

```bash
cd api-gateway
npm install
npm run start:dev
```

Rodar testes

```bash
npm run test
npm run test:cov
```
