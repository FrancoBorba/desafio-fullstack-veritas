# 🚀 Desafio Fullstack - Mini Kanban (Veritas)

Este projeto é uma solução completa para o Desafio Fullstack da Veritas Consultoria. Ele implementa um quadro Kanban 100% funcional com um backend em **Go** e um frontend em **React**.

A aplicação cumpre todos os requisitos do MVP e implementa todas as funcionalidades bônus, incluindo:
* Backend RESTful (CRUD) em Go.
* Frontend em React com gerenciamento de estado e componentes modulares.
* Funcionalidade completa de "Arrastar e Soltar" (Drag and Drop) entre colunas.
* Filtragem, Busca e Ordenação de tarefas (processadas pelo backend).
* Documentação de API interativa com Swagger.
* Projeto 100% containerizado com Docker e Docker Compose.

---

## 📦 Como Rodar o Projeto

Existem duas formas de rodar esta aplicação: a forma simples (com Docker) ou a forma manual (rodando cada serviço individualmente).

### Cenário 1: Com Docker (Recomendado)

Este método é o mais simples e recomendado. Ele não exige a instalação do Go ou Node.js na sua máquina, apenas do Docker.

#### Pré-requisitos
* **Docker:** É necessário ter o Docker e o Docker Compose instalados.
    * **Windows/Mac:** [Instalar Docker Desktop](https://docs.docker.com/desktop/)
    * **Linux:**
    ```bash
        # 1. Instala o Docker Engine (usando o script de conveniência oficial)
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        
        # 2. Instala o Docker Compose 
        sudo apt-get update
        sudo apt-get install docker-compose-plugin
    ```

#### Passos para Rodar

1.  **Clone o Repositório**
    Abra seu terminal e clone o projeto:
    ```bash
    git clone https://github.com/FrancoBorba/desafio-fullstack-veritas.git
    ```

2.  **Navegue até a Raiz do Projeto**
    ```bash
    cd desafio-fullstack-veritas
    ```

3.  **Execute o Docker Compose**

    * **Na primeira vez (ou se você mudar o código):**
        Use o comando `--build`. Isso força o Docker a reconstruir as "imagens" (os "moldes") do Go e do React do zero.
        ```bash
        docker-compose up --build
        ```
    * **Para todas as vezes seguintes:**
        Se você só quer "ligar" os containers que já foram construídos, use:
        ```bash
        docker compose up
        ```
    * **Para desligar:**
        Pressione `Ctrl+C` no terminal, e depois rode:
        ```bash
        docker compose down
        ```

4.  **Acesse a Aplicação**
    Com os containers rodando, acesse os seguintes endereços no seu navegador:
    * **Frontend (Aplicação):** `http://localhost:3000`
    * **Backend (API Go):** `http://localhost:8080`
    * **Documentação (Swagger):** `http://localhost:8080/swagger/index.html`


### Cenário 2: Rodando Manualmente (Modo de Desenvolvimento)

**Nota sobre Ambientes:** O ecossistema Go é primariamente desenvolvido e testado em ambientes Linux. Para usuários de Windows, é **altamente recomendado** usar o **WSL (Windows Subsystem for Linux)** para garantir 100% de compatibilidade e performance.

### A. Backend (Go)

**1. Instalação (Linux / WSL - Ubuntu)**

```bash
    # Atualiza os pacotes
    sudo apt update
    # Instala o Go
    sudo apt install golang-go
    # Verifica a instalação
    go version
```

**1. Instalação (Windows)**
Link do instalador: [Instalador GO Oficial](https://go.dev/doc/install)

**2. Instalação (Swagger CLI)**
    Para gerar a documentação, rode este comando em qualquer terminal:
```bash
   go install github.com/swaggo/swag/cmd/swag@latest
```

(Nota: Se o comando swag não for encontrado, adicione o GOPATH ao seu PATH do terminal. Ex: export PATH=$PATH:$(go env GOPATH)/bin)

**3. Rodando o Backend**
```bash
    # 1. Navegue até a pasta do backend
    cd backend

    # 2. Baixe as dependências (listadas no go.mod)
    go mod tidy

    # 3.(Opcional se quiser acessar a documentação com Swagger)
    # Gera a pasta /docs da documentação
    # (Use 'go run github.com/swaggo/swag/cmd/swag init' se 'swag init' falhar)
    swag init

    # 4. Rode o servidor
    go run .
```

✅ Sucesso: O terminal mostrará Servidor Go rodando na porta :8080.

### B. Frontend(React)

**1. Instalação (Linux / WSL - Recomendado) Recomendamos usar o nvm (Node Version Manager) para gerenciar as versões do Node.**

### Instala o NVM
```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Recarrega o terminal
    source ~/.bashrc
    # Instala a versão LTS (Estável) mais recente do Node.js
    nvm install --lts

```

**1. Instalação (Windows) Link do instalador: [Instalador Node.js (LTS) Oficial:](https://nodejs.org/en/download)**



**2. Rodando o Frontend Abra um segundo terminal (deixe o backend rodando no primeiro).**

```bash
    # 1. Navegue até a pasta do frontend
    cd frontend

    # 2. Instale as dependências (listadas no package.json)
    npm install

    # 3. Rode o servidor de desenvolvimento
    npm start

```

---

## 🧠 Decisões Técnicas

Este projeto foi construído com foco em boas práticas de arquitetura, escalabilidade e uma experiência de usuário fluida.

### Backend (Go)
* **Arquitetura Limpa:** O backend segue o **Padrão Repositório** (Repository Pattern). A lógica de negócios (`handlers.go`) depende de uma *interface* (`store.go`), não da implementação. Isso torna o código fácil de testar e permite trocar o "banco de dados em memória" por um banco real (como PostgreSQL) no futuro sem alterar os handlers.
* **Segurança de Concorrência:** Como o armazenamento é em memória e o Go lida com requisições concorrentes (goroutines), foi utilizado um `sync.RWMutex` no repositório. Isso previne "race conditions", garantindo que o mapa de tarefas possa ser lido ou escrito por múltiplos usuários de forma segura.
* **Validação Robusta:** O backend utiliza a biblioteca `go-playground/validator` para validar *payloads* de entrada (DTOs). Regras como `required,min=3` (para o título) e `oneof` (para status e prioridade) garantem a integridade dos dados antes que eles cheguem à lógica de negócios.
* **Filtragem e Ordenação (Server-Side):** A lógica de filtragem, busca e ordenação é feita **inteiramente no backend**. O Go recebe *Query Params* (ex: `?priority=Alta&sort=priority_desc`) e faz o trabalho pesado. Isso é uma decisão de arquitetura escalável, que mantém o frontend rápido.
* **Documentação (Bônus):** A API está documentada com `swaggo`, gerando uma UI interativa do Swagger.

### Frontend (React)
* **Modularização:** A UI foi quebrada em **Componentes** reutilizáveis (ex: `Navbar`, `ActionBar`, `TaskCollumn`, `TaskCard`), mantendo o `App.js` como o "cérebro" principal que gerencia o estado.
* **Drag and Drop (Bônus):** Foi implementada a funcionalidade de "arrastar e soltar" usando a biblioteca `@hello-pangea/dnd`. Esta é uma **atualização otimista**: o usuário move o card (a UI atualiza instantaneamente) e uma chamada `axios.PUT` é enviada ao backend para persistir a mudança de status.
* **Gerenciamento de Estado:** O estado principal (lista de tarefas, filtros, modal) é centralizado no `App.js` e passado para os componentes filhos via *props*. A comunicação de "filho para pai" é feita através de *callbacks* (ex: `onTaskCreated`, `onOpenModal`).
* **Debouncing:** A barra de busca (`Search`) utiliza um "debounce" de 300ms. Isso evita que o frontend envie uma requisição para a API a cada tecla digitada, melhorando a performance.

### Infraestrutura (Docker)
* **Docker Compose:** O projeto é orquestrado com um `docker-compose.yml`, permitindo que o backend e o frontend subam (e se comuniquem) com um único comando.
* **Multi-Stage Builds:** Os `Dockerfiles` (tanto do Go quanto do React) utilizam **multi-stage builds**. Isso gera imagens finais de produção minúsculas, seguras e otimizadas (sem código-fonte, compiladores ou dependências de build).

---

## ⚠️ Limitações Conhecidas

* **Armazenamento Volátil:** O backend usa armazenamento em memória, como pedido no escopo. Todas as tarefas são perdidas quando o container do Docker é reiniciado.
* **Sem Autenticação:** Não há sistema de usuários. O Kanban é público.
* **Reordenação Local:** A reordenação de tarefas *dentro* da mesma coluna (via Drag and Drop) é apenas visual (otimista) e não é persistida no backend. A ordem é "resetada" pela ordenação do backend (ex: por data ou prioridade) ao recarregar a página.

---

## 💡 Melhorias Futuras

O design da aplicação foi intencionalmente inspirado em aplicações mais robustas, pensando em acomodar melhorias futuras:

* **Atribuir Usuários:** Implementar um sistema de autenticação e permitir que tarefas sejam associadas a avatares/usuários específicos (o design do `TaskCard` já prevê isso).
* **Datas e Prazos:** Implementar a lógica para `DueDate` (prazo), permitindo que o `TaskCard` mostre "12 days" (como no design de inspiração) e o `ActionBar` filtre por "Calendar" ou "Deadlines" (Prazos).
* **Quadros Múltiplos:** Implementar a funcionalidade `+ Novo Quadro` (do `ActionBar`), transformando o backend para suportar múltiplos quadros, cada um com suas próprias colunas customizáveis (ex: "Backlog", "Revisão", etc.).


