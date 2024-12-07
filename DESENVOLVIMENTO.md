### Executando o frontend e backend local

1. Configure o arquivo `.env` ou crie um novo usando o exemplo `.env.sample`.

2. Configure as variaveis `OPENAI_CHAT_HOST` e `OPENAI_EMBED_HOST` para "openai". depois coloque sua chave de API em  `OPENAICOM_KEY`.

    2.1. Para usar o Ollama, configure `OPENAI_CHAT_HOST` com "ollama". e atualize, caso necessário os valores de `OLLAMA_ENDPOINT` e `OLLAMA_CHAT_MODEL`. Usamos o "llama3.1" para modelo de chat porque tem suporte a chamadas de função compatíveis com OpenAI e "nomic-embed-text" para o modelo de embedding. Caso utilize algum modelo que não suporte chamadas de função, desative a opção de fluxo avançado na aplicação. Caso não possa usar o banco de dados vetorial, desative busca vetorial.

3. Execute esses comandos para instalar a aplicacao como pacote local ( `fastapi_app`), set up the local database, and seed it with test data:
    ```bash
    python -m pip install -r src/backend/requirements.txt

    python -m pip install -e src/backend
    ```
    
    O Backend serve um arquivo estatico do diretorio src/backend/static


4. Configure a base de dados utilizando o comando abaixo:
    ```bash
    python ./src/backend/fastapi_app/setup_postgres_database.py

    python ./src/backend/fastapi_app/setup_postgres_seeddata.py
    ```

5. Compie o frontend:
    ```bash
    cd src/frontend

    npm install

    npm run build

    cd ../../
    ```

6. Execute o backend FastAPI de dentro do diretorio raiz do projeto:
    ```shell
    python -m uvicorn fastapi_app:create_app --factory --reload
    ```

    Ou use o menu Run & Debug do VS Code.

7. Caso Precise executar somente o frontend:
    ```bash
    cd src/frontend

    npm run dev
    ```

    Ou use as opções "Frontend" / "Frontend & Backend" do menu Run & Debug no VS Code.

    Abra no Navegador: `http://localhost:5173/` 

8. Execute o modelo do llama local
    ```bash
    ollama run llama3.1 &
    ```

    Verifique se o modelo esta executando com:
    ```bash
    ollama ps
    ```

    Teste com:
    ```bash
    curl http://localhost:11434/v1/chat/completions -H "Content-Type: application/json"     -d '{
        "model": "llama3.1",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
    ```

**Fontes:** 
    
    https://github.com/ollama/ollama/blob/main/docs/openai.md
    
    https://github.com/ollama/ollama/blob/main/docs/api.md
    
    https://ollama.com/blog/functions-as-tools