package main

import (
	"encoding/json"
	"net/http"
	"github.com/go-playground/validator/v10"
	"fmt"
	"github.com/gorilla/mux"          
)

// ----- Injection Dependecy -----
type TaskHandler struct{
	store TaskStore
	validator *validator.Validate
}

// ----- Constructor -----
func NewTaskHandler(store TaskStore) *TaskHandler {
	return &TaskHandler{
		store:     store,
		validator: validator.New(), // Criamos a instância do validador aqui
	}
}

// @Summary      Cria uma nova tarefa
// @Description  Adiciona uma nova tarefa ao kanban
// @Tags         tasks
// @Accept       json
// @Produce      json
// @Param        task  body      CreateTaskPayload  true  "Payload da Tarefa"
// @Success      201  {object}  Task
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /tasks [post]
func (h *TaskHandler) CreateTask( w http.ResponseWriter , r *http.Request){

	// Take the json and transforms in UpdateTaskPayload
	var payload CreateTaskPayload 

	// If the pattern is not equal, it throws an exception
	if erro := json.NewDecoder(r.Body).Decode(&payload); erro != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid Json"})
		return
	}



	if erro := h.validator.Struct(payload) ; erro != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Validation fail: " + erro.Error()})
		return
	}

	task , erro := h.store.CreateTask(payload.Title, payload.Description, payload.Priority , payload.Status)
	if erro != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"erro": "Fail in create task"})
		return
	}

	writeJSON(w, http.StatusCreated, task)
}

// @Summary      Lista todas as tarefas
// @Description  Retorna uma lista de todas as tarefas do kanban
// @Tags         tasks
// @Produce      json
// @Param        priority query     string  false  "Filtrar por prioridade (Alta, Média, Baixa)"
// @Param        sort     query     string  false  "Ordenar por prioridade (priority_asc, priority_desc)"
// @Param        search   query     string  false  "Buscar por parte do título (case-insensitive)"
// @Success      200  {array}   Task
// @Failure      500  {object}  map[string]string
// @Router       /tasks [get]
func (h *TaskHandler) GetAllTasks( w http.ResponseWriter , r *http.Request){

	// Take the query params
	filterPriority := r.URL.Query().Get("priority")
	sortOrder := r.URL.Query().Get("sort")
	searchTask := r.URL.Query().Get("search")

	tasks , erro := h.store.GetAllTasks(filterPriority, sortOrder , searchTask);
	if erro != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"erro": "Fail in get tasks"})
		return
	}

	writeJSON(w , http.StatusOK , tasks);
	
}

// @Summary      Busca uma tarefa por ID
// @Description  Retorna uma única tarefa dado o seu ID
// @Tags         tasks
// @Produce      json
// @Param        id   path      string  true  "ID da Tarefa"
// @Success      200  {object}  Task
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /tasks/{id} [get]
func (h *TaskHandler) GetTaskById( w http.ResponseWriter , r *http.Request){

	//Take the variants of the path
	vars := mux.Vars(r);

	id , ok := vars["id"] 

	if !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "ID isn't in the path"})
		return
	}

	task , erro := h.store.GetTask(id)
	if erro != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"erro": erro.Error()})
		return
	}

	writeJSON(w , http.StatusOK , task)
}

// @Summary      Atualiza uma tarefa existente
// @Description  Atualiza os campos de uma tarefa (título, descrição, prioridade, status)
// @Tags         tasks
// @Accept       json
// @Produce      json
// @Param        id    path      string             true  "ID da Tarefa"
// @Param        task  body      UpdateTaskPayload  true  "Campos da Tarefa para Atualizar"
// @Success      200  {object}  Task
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /tasks/{id} [put]
func (h *TaskHandler) UpdateTask( w http.ResponseWriter , r *http.Request){

	//Take the variable of the path
	vars := mux.Vars(r);

	id , ok := vars["id"] 

	if !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "ID isn't in the path"})
		return
	}

	// Take the json and transforms in UpdateTaskPayload
	var payload UpdateTaskPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "Invalid json"})
		return
	}

	// Validates business rules
	if err := h.validator.Struct(payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "Validation failed: " + err.Error()})
		return
	}

	// Save in db
	task, err := h.store.UpdateTask(id, payload)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"erro": err.Error()}) // Pode ser 404
		return
	}

	writeJSON(w, http.StatusOK, task)

}

// @Summary      Deleta uma tarefa
// @Description  Remove uma tarefa do kanban pelo seu ID
// @Tags         tasks
// @Produce      json
// @Param        id   path      string  true  "ID da Tarefa"
// @Success      204  "No Content"
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /tasks/{id} [delete]
func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	
	// Take the if of the path
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "ID não fornecido"})
		return
	}


	if err := h.store.DeleteTask(id); err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"erro": err.Error()})
		return
	}


	w.WriteHeader(http.StatusNoContent)
}



func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	// json.NewEncoder(w).Encode(v) is the most efficient way
	// of writing JSON directly to the HTTP response.
	if err := json.NewEncoder(w).Encode(v); err != nil {
		fmt.Printf("Erro ao escrever JSON: %v", err)
	}

}


