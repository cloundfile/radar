FROM node:22-slim

# Instala dependências para o Chrome headless
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    xdg-utils \
    --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cria diretório da aplicação
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia código
COPY . .

# Compila TypeScript
RUN npm run build

# Expõe a porta usada
EXPOSE 3333

# Executa app
CMD ["node", "dist/index.js"]