# Use uma imagem oficial do Node.js
FROM node:22-slim

# Instala dependências do sistema necessárias para o Chromium funcionar com o Puppeteer
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libxss1 \
  libasound2 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libxcomposite1 \
  libxrandr2 \
  libgbm1 \
  libgtk-3-0 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libatspi2.0-0 \
  libx11-xcb1 \
  libxdamage1 \
  libxshmfence1 \
  libnspr4 \
  wget \
  ca-certificates \
  fonts-liberation \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências do projeto
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