# 📊 Integração Google Sheets - Cálculo de Notas

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Google Sheets](https://img.shields.io/badge/google_sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

## 💻 Sobre o projeto

Uma aplicação Back-end desenvolvida em **Node.js** que interage com a **API do Google Sheets**. O sistema lê uma planilha de notas de alunos, processa as regras de negócio (aprovação, reprovação e exame final) e atualiza a planilha automaticamente com os resultados.

O objetivo foi criar uma automação eficiente para processamento de dados externos via API.

## ⚙️ Regras de Negócio Implementadas

O sistema aplica a seguinte lógica para cada aluno:

1.  **Cálculo da Média:** Baseado em 3 provas (P1, P2, P3).
2.  **Verificação de Faltas:**
    *   Faltas > 25% do total de aulas: **Reprovado por Falta**.
3.  **Situação Final (baseada na média):**
    *   `Média < 50`: **Reprovado por Nota**.
    *   `50 <= Média < 70`: **Exame Final**.
    *   `Média >= 70`: **Aprovado**.
4.  **Cálculo de Nota para Exame Final:**
    *   Para alunos em exame, o sistema calcula exatamente quanto ele precisa tirar para atingir a média final 50.

## 🛠 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** - Ambiente de execução.
- **[Google Sheets API](https://developers.google.com/sheets/api)** - Leitura e escrita de dados.
- **OAuth 2.0** - Autenticação segura.

## 🚀 Como executar o projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina o [Git](https://git-scm.com) e o [Node.js](https://nodejs.org/en/).

### 🔐 Configuração das Credenciais
Para que o projeto funcione, você precisa das credenciais da API do Google:
1. Obtenha o arquivo `credentials.json` no Google Cloud Console.
2. Coloque o arquivo na **raiz** do projeto.
*(Nota: Por segurança, este arquivo não é versionado no repositório).*

### 🎲 Rodando a Aplicação

```bash
# Clone este repositório
$ git clone <https://github.com/IAmCarlosRibeiro/NOME-DO-REPO>

# Acesse a pasta do projeto no terminal
$ cd NOME-DO-REPO

# Instale as dependências
$ npm install

# Execute a aplicação
$ node index.js
```
### 📝 Licença
##### Este projeto está sob a licença MIT.
---
Feito com 💜 por Carlos Ribeiro
