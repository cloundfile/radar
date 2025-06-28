# Use uma imagem oficial do Node.js
FROM node:22

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do projeto
COPY public ./public
COPY . .

# Compila os arquivos TypeScript para JavaScript na pasta dist
RUN npm run build

# Expõe a porta que a aplicação irá escutar
EXPOSE 3333

# Define o comando para iniciar a aplicação (usando dist)
CMD ["node", "dist/index.js"]