# Customizando Dados np PostgreSQL



##  Schema de Tabela

1. Atualize seed_data.json 
2. Atualize os modelos SQLAlchemy em postgres_models.py 
3. Adicione a nova tabela usando:

    ```shell
    python src/backend/fastapi_app/setup_postgres_database.py
    ```

## Adicionando embeddings em seed_data.json

1. Atualize as referencias dos modelos em update_embeddings.py
2. Gere os novos embeddings com:

    ```shell
        python src/backend/fastapi_app/update_embeddings.py  --in_seed_data
    ```

    O script utiliza as configurações definidas no arquivo `.env`.
    Por isso é necessário rodar 2 vezes para gerar os modelos OpenAI e Ollama, pois cada um utiliza um embedding model diferente.

    Mude a config `OPENAI_EMBED_HOST` entre Ollama e OpenAI.

## Adicione os dados na base

Com a tabela tendo o schema correto e os dados em `seed_data.json` populados com os embeddings, use:

```shell
    python src/backend/fastapi_app/setup_postgres_seeddata.py
```

## Atualize os prompts LLM 

1. Atualize os prompts de respota em `src/backend/fastapi_app/prompts/answer.txt` para refletir o novo domínio.
2. Atualize as chamadas de função em `src/backend/fastapi_app/query_rewriter.py` para refletir o schema. 
3. Verifique os filtros de query `_filter`.
4. Atualize a forma de rescrever os prompts em `src/backend/fastapi_app/prompts/query.txt` e `query_fewshots.json`.

## Atualize as APIs

Rotas FastAPI usando anotações para definir o schema de dados aceitados no retorno.

1. Modifique `ItemPublic` em `src/backend/fastapi_app/api_models.py` .
2. Modifique `RAGContext` se mudar o tipo de ID para string ao invés de inteiros.

## Atualize o Frontend

1. Modifique o componente de resposta em `src/frontend/src/components/Answer/Answer.tsx` com os dados do novo schema.
2. Modifique os exemplos em `/workspace/src/frontend/src/components/Example/ExampleList.tsx`.
