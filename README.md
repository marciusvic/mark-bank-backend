### Mark Bank Backend

- Descrição do desafio no arquivo `mark-bank.txt`

## Como rodar o projeto

1. Clone o repositório
2. Entre na pasta `mark-bank-backend`
3. Configura o arquivo `.env` com as variáveis de ambiente

```env
{
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bankdb"
JWT_SECRET='mark-bank'
JWT_EXPIRES_IN='8h'
}
```

4. Execute o comando `sudo docker-compose up --build` ou `docker-compose up --build` caso esteja no Windows

## Tecnologias utilizadas

- TypeScript
- Node.js
- Nest.js
- Prisma
- Docker
- Postgres
