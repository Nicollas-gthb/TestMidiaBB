#====== Imagem para desenvolvimento ======#

# Imagem Node oficial "slim"
FROM node:20-slim

# Diretorio onde codigo vai rodar dentro do container
# Docker cria a pasta se não existir, a partir de onde o dockerfile estiver
WORKDIR /app

# Copia arquivos de configuração de pacotes
COPY package*.json ./

# Instala as dependências do Node
RUN npm install

# Copia o codigo do React
COPY . .

# Expõe a porta que o React costuma usar
EXPOSE 5173

# Comando para rodar o Vite
# O "--host" permite que o Docker mapeie a porta para fora do container
CMD ["npm", "run", "dev", "--", "--host"]


#====== Imagem para produção ======#

# # Stage 1: build
# FROM node:20-slim AS builder

# WORKDIR /app

# COPY package*.json ./

# # ci é mais rápido e determinístico que install
# RUN npm ci    

# COPY . .

# # gera a pasta /app/dist
# RUN npm run build           

# # Stage 2: serve apenas o estático
# FROM nginx:alpine

# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
