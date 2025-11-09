# 🚀 Desafio Fullstack - Mini Kanban (Veritas)

Este projeto é uma solução para o Desafio Fullstack da Veritas Consultoria, implementando um quadro Kanban completo com um backend em **Go** e um frontend em **React**.

A aplicação permite o gerenciamento completo de tarefas (CRUD), incluindo criação, edição, exclusão, e movimentação entre colunas com "Drag and Drop", além de funcionalidades  de filtragem , ordenação por prioridade e busca.


---

## 📦 Como Rodar o Projeto

Existem duas formas de rodar esta aplicação: a forma simples (com Docker) ou a forma manual (rodando cada serviço individualmente).

### Cenário 1: Com Docker (Recomendado)

Este método é o mais simples, pois o `docker-compose` gerencia o backend, o frontend e a rede.

**Pré-requisitos:**
* **Docker Desktop:** [Instruções de instalação](https://docs.docker.com/desktop/)

**Passos:**
1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/desafio-fullstack-veritas.git](https://github.com/seu-usuario/desafio-fullstack-veritas.git)
    cd desafio-fullstack-veritas
    ```
2.  Suba os containers (o `--build` garante que tudo será construído do zero):
    ```bash
    docker-compose up --build
    ```
3.  Acesse os serviços:
    * **Frontend (React):** `http://localhost:3000`
    * **Backend (Go API):** `http://localhost:8080`
    * **Documentação (Swagger):** `http://localhost:8080/swagger/index.html`

---

### Cenário 2: Rodando Individualmente

Se você preferir rodar os serviços manualmente na sua máquina.

**Pré-requisitos:**
* **Go (Golang):** [Instruções de instalação](https://go.dev/doc/install)
* **Node.js (LTS):** [Instruções de instalação](https://nodejs.org/en)
* **Swag CLI** (Para a documentação):
    ```bash
    go install [github.com/swaggo/swag/cmd/swag@latest](https://github.com/swaggo/swag/cmd/swag@latest)
    ```

**Passos para o Backend (Go):**
    ```bash
    # 1. Navegue até a pasta do backend
    cd backend

    # 2. Instale as dependências
    go mod tidy

    # 3. Gere os arquivos da documentação Swagger
    # (Se o comando 'swag' não for encontrado, verifique seu $GOPATH)
    swag init

    # 4. Rode o servidor
    go run .
    # O backend estará rodando em http://localhost:8080
    Passos para o Frontend (React):

    Bash

    # 1. Em um NOVO terminal, navegue até a pasta do frontend
    cd frontend

    # 2. Instale as dependências
    npm install

    # 3. Rode o servidor de desenvolvimento
    npm start
    # O frontend estará rodando em http://localhost:3000
---

## 🧠 Decisões Técnicas
Este projeto foi construído com foco em boas práticas de arquitetura, escalabilidade e uma experiência de usuário fluida.

**Backend (Go)**

Arquitetura Limpa: O backend segue o Padrão Repositório (Repository Pattern). A lógica de negócios (handlers.go) depende de uma interface (store.go), não de uma implementação concreta. Isso torna o código fácil de testar e permite trocar o "banco de dados em memória" por um banco real no futuro sem alterar os handlers.

Validação Robusta: O backend utiliza a biblioteca go-playground/validator para validar payloads de entrada (DTOs). Regras como required,min=3 (para o título) e oneof (para status e prioridade) garantem a integridade dos dados antes que eles cheguem à lógica de negócios.

Filtragem e Ordenação: A lógica de filtragem, ordenação e busca (por prioridade, data, etc.) é feita inteiramente no backend. O Go recebe Query Params (ex: ?priority=Alta&sort=priority_desc) e faz o trabalho pesado, garantindo que o frontend seja rápido e escalável, mesmo com milhares de tarefas.

---

**Frontend (React)**

Modularização: A UI foi quebrada em Componentes reutilizáveis (ex: Navbar, ActionBar, TaskCollumn, TaskCard), mantendo o App.js como o "cérebro" principal que gerencia o estado.

Drag and Drop (Bônus): Foi implementada a funcionalidade de "arrastar e soltar" usando a biblioteca @hello-pangea/dnd. 

O usuário move o card (o estado do React é atualizado instantaneamente) , isso dá uma sensação de performance instantânea para o usuário..


Gerenciamento de Estado: O estado principal (lista de tarefas, filtros, modal) é centralizado no App.js (Componente Pai) e passado para os componentes filhos (ex: TaskCollumn, TaskModal) via props. A comunicação de "filho para pai" é feita através de callbacks (ex: onTaskCreated, onOpenModal).

---

### ⚠️ Limitações Conhecidas
Armazenamento Volátil: O backend usa armazenamento em memória, como pedido no escopo. Todas as tarefas são perdidas quando o container do Docker é reiniciado.

Sem Autenticação: Não há sistema de usuários. O Kanban é público.

Reordenação Local: A reordenação de tarefas dentro da mesma coluna (via Drag and Drop) é apenas visual (otimista) e não é persistida no backend. A ordem é "resetada" pela ordenação do backend (ex: por data ou prioridade) ao recarregar a página.

## 💡 Melhorias Futuras
O design da aplicação foi intencionalmente inspirado em aplicações mais robustas, pensando em acomodar melhorias futuras:

Atribuir Usuários: Implementar um sistema de autenticação e permitir que tarefas sejam associadas a avatares/usuários específicos.

Datas e Prazos: Implementar a lógica para prazo, permitindo que o TaskCard mostre a estimativa de tempo e o ActionBar filtre por calendarios ou prazos

Quadros Múltiplos: Implementar a funcionalidade + Novo Quadro, transformando o backend para suportar múltiplos quadros, cada um com suas próprias colunas customizáveis (ex: "Backlog", "Revisão", etc.).

# 🏁 Autor

Desenvolvido por [Franco Ribeiro Borba]

📧 Contato: franco.borba14@gmail.com

💼 LinkedIn https://www.linkedin.com/in/francoborba/

