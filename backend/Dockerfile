# Imagem Python oficial 
FROM python:3.14-slim

# Diretorio onde codigo vai rodar dentro do container
# Docker cria a pasta se não existir, a partir de onde o dockerfile estiver
WORKDIR /app

# Instala dependências do sistema necessárias para pacotes Python (como bcrypt)
# O "rm -rf" limpa o lixo para a imagem não ficar pesada
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requisitos primeiro
COPY ./requirements.txt .

# Instala as bibliotecas do Python
RUN pip install --no-cache-dir -r requirements.txt

#Copia todo o conteúdo da pasta /backend da sua máquina para /app no container
COPY . .

# Expõe a porta que o FastAPI/Uvicorn costuma usar
EXPOSE 8000

# Comando para rodar o servidor (Uvicorn)
# '--host 0.0.0.0' é OBRIGATÓRIO para o Docker conseguir acessar o serviço
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]