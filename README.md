O programa foi desenvolvido para processar e atualizar notas de alunos armazenadas em uma planilha do Google Sheets. Ele permite visualizar o conteúdo da planilha, calcular as notas dos alunos e atualizar a planilha com as notas calculadas.

Funcionalidades
1. Visualizar Planilha
Permite ao usuário visualizar o conteúdo completo da planilha.

2. Calcular Notas dos Alunos
Calcula as notas dos alunos com base nas informações contidas na planilha. Este cálculo inclui:

Verificação do número de faltas de cada aluno.
Cálculo da média das notas das três provas (P1, P2 e P3).
Classificação dos alunos de acordo com as seguintes regras:
Se o número de faltas for superior a 25% do total de aulas, o aluno é classificado como "Reprovado por Falta".
Se a média for inferior a 50, o aluno é classificado como "Reprovado por Nota".
Se a média estiver entre 50 e 70, o aluno é classificado como "Exame Final".
Se a média for igual ou superior a 70, o aluno é classificado como "Aprovado".
Cálculo da nota final para os alunos que estão na situação "Exame Final". A nota final é calculada de modo que a média final seja igual ou maior a 50.
3. Atualizar Planilha com as Notas Calculadas
Atualiza a planilha com as notas calculadas dos alunos, incluindo a situação de cada aluno e, quando aplicável, a nota final.

Configurações e Dependências
Google Sheets API: O programa utiliza a API do Google Sheets para acessar e manipular dados em planilhas do Google Sheets.
Node.js: É necessário ter o Node.js instalado para executar o programa.
Credenciais de Autenticação: O programa requer credenciais de autenticação OAuth 2.0 para acessar a API do Google Sheets. As credenciais devem ser fornecidas no formato JSON e armazenadas em um arquivo chamado `credentials.json`.
Token de Autorização: Após a primeira execução do programa, um token de autorização será gerado e armazenado no arquivo `token.json`. Esse token permite que o programa acesse a planilha em nome do usuário.
Instalação e Uso
Instalação de Dependências: Antes de executar o programa, é necessário instalar as dependências. Abra o terminal na pasta do projeto e execute o comando npm install para instalar as dependências listadas no arquivo `package.json`.

Configuração das Credenciais: As credenciais de autenticação devem ser fornecidas pelo Google Cloud Console e salvas no arquivo `credentials.json` na raiz do projeto.

Execução do Programa: Para iniciar o programa, execute o comando node `index.js` ou `node.js` no terminal. O programa exibirá um menu com as opções disponíveis. Basta selecionar a opção desejada e seguir as instruções fornecidas no console.

Autor
Carlos Ribeiro
crbrdev@gmail.com
