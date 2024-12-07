# Deploy na Azure

1. Depois de acessar o container de desenvolvimento faça login na conta Azure:

    ```shell
    azd auth login
    ```

2. Crie o novo Ambiente de Deploy. Esse nome será utilizado para criar resource group e detectar alterações de infraestrutura quando fizer o redeploy:

    ```shell
    azd env new
    ```

    Será criado um diretório `.azure/` para armazenar as configurações do ambiente.

3. Setar valores de variaveis de ambiente que serão utilizadas na automação de deploy.

    1. Execute `azd env set DEPLOY_AZURE_OPENAI false`
    2. Execute `azd env set OPENAI_CHAT_HOST openaicom`
    3. Execute `azd env set OPENAI_EMBED_HOST openaicom`


4. Conta Openai.com 

    Use a API Key gerada na [plataforma OpenAI](https://platform.openai.com/account/api-keys). Evite subir essa chave no github.

    4.1. Execute `azd env set OPENAICOM_KEY {Sua chave API}`
    
        Exemplo OPENAICOM_KEY="sk-proj-2J5zLvEbiC_FFV35n8oOYj8bpdrfN7kXUQy2TsbLjQt"

    4.2 Execute `azd env set OPENAI_CHAT_HOST="openaicom"`

    4.3 Execute `azd env set OPENAI_EMBED_HOST="openaicom"`

    Este projeto usa os modelos gpt 3.5 turbo e text-embedding-ada-002


5. Execute o Deploy:

    Verifique as variáveis de ambiente depois execute o comando de deploy

    ```shell
    azd env get-values
    ```

    ```shell
    azd up
    ```

    Quando executar `azd up` será perguntado a localização para armazenar em `openAiResourceGroupLocation`, selecione US-EAST2 porque lá tem free tier do Postgres.

## Custos

* Azure Container Apps: Baseado em vCPU e memory utilizados. [Custo](https://azure.microsoft.com/pricing/details/container-apps/)

* OpenAI: Modelos GPT e Ada embedding. Preço por tokens usados, sao utilizados ao menos 1K de tokens por perguntas. [Custo](https://openai.com/api/pricing/)

* Azure PostgreSQL Flexible Server: Burstable Tier with 1 CPU core, 32GB storage. Preço por Horas UP. [Custo](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/)

* Azure Monitor: Pay-as-you-go tier. Custos baseados nos dados ingeridos. [Custo](https://azure.microsoft.com/pricing/details/monitor/)

