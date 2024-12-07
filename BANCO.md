# Acesso ao banco de dados 

A infra desse projeto, cria um banco de dados - Azure Database for PostgreSQL Flexible Server - com autenticação sem senha. Para conectar no banco de dados é necessário utilizar um token. Esse token é administrado pelo serviço Microsoft Entra, e é baseado na cota de login utilizada pelo Azure Developer CLI, comando `azd login`.

No momento de criação da infraestrutura, o login é atrelado ao banco, e precisa ser utilizado para acesso.


## Usando Microsoft Entra auth e psql

1. Loge com a mesma senha de criação da aplicação, usando o Azure Developer CLI.

    ```shell
    azd auth login
    ```

2. Gere o token de acesso para o Azure Database for PostgreSQL Flexible Server.

    ```shell
    azd auth token --scope https://ossrdbms-aad.database.windows.net/.default --output json
    ```

    O arquivo JSON gerado terá o token no campo "token".

3. Coloque o valor do token na variavel de ambiente `PGPASSWORD`.

    ```shell
    export PGPASSWORD=token
    ```

4. Conecte usando `psql`, e variaveis `POSTGRES_HOST`, `POSTGRES_USERNAME`, e `POSTGRES_DATABASE` armazenadas no ambiente azure.

    ```shell
    psql -h $(azd env get-value POSTGRES_HOST) -U $(azd env get-value POSTGRES_USERNAME) -d $(azd env get-value POSTGRES_DATABASE) -p 5432
    ```

5. No psql, use `\d` para listar as tabelas. Quando usar o `SELECT`, indique as colunas para evitar trazer o vetor de embeddings no terminal.

    ```
    SELECT categoria FROM oraculo;

    SELECT texto FROM oraculo WHERE categoria = 'CLT Art. 129';
    ```

Se aparecer mensagem de erro de autenticação, será necessário gerar um novo token, porque ele tem tempo de expiração.

para sai digite: exit

## Usando pgAdmin

1. Depois de executar os passos de gerar token abra o pgAdmin e crie uma nova conexão com o Banco.

2. Coloque o nome da conexão na tab "General".

3. Na tab "Connection", coloque no campo host o conteúdo da váriavel `POSTGRES_HOST` obtido pelo comando:

    ```shell
    azd env get-value POSTGRES_HOST
    ```

4. Coloque em database o valor de `POSTGRES_DATABASE`:

    ```shell
    azd env get-value POSTGRES_DATABASE
    ```

5. Coloque em username o conteúdo de `POSTGRES_USERNAME`:

    ```shell
    azd env get-value POSTGRES_USERNAME
    ```

6. Coloque o valor do token no campo password.


## Referências

* [Microsoft Entra ID para autenticação no  Azure Database for PostgreSQL - Flexible Server](https://learn.microsoft.com/azure/postgresql/flexible-server/how-to-configure-sign-in-azure-ad-authentication).
