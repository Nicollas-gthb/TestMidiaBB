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