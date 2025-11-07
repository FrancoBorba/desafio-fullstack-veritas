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

func (h *TaskHandler) CreateTask( w http.ResponseWriter , r *http.Request){

	// Creates a pattern to analyze request data
	var payload struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Prioridade  string `json:"prioridade"`	
	}

	// If the pattern is not equal, it throws an exception
	if erro := json.NewDecoder(r.Body).Decode(&payload); erro != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid Json"})
		return
	}

	// Validate datas
	tempTask := Task{
		Title: payload.Title,
		Status: "A Fazer",
		Description: payload.Description,
	}

	if erro := h.validator.Struct(tempTask) ; erro != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Validation fail: " + erro.Error()})
		return
	}

	task , erro := h.store.CreateTask(payload.Title, payload.Description, payload.Prioridade)
	if erro != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"erro": "Fail in create task"})
		return
	}

	writeJSON(w, http.StatusCreated, task)
}

func (h *TaskHandler) GetAllTasks ( w http.ResponseWriter , r *http.Request){

	tasks , erro := h.store.GetAllTasks();
	if erro != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"erro": "Fail in get tasks"})
		return
	}

	writeJSON(w , http.StatusOK , tasks);
	
}

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


