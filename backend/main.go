package main

import (
	"log"    
	"net/http" 

	"github.com/gorilla/mux" 

	"github.com/gorilla/handlers"
	httpSwagger "github.com/swaggo/http-swagger"
	_ "kanbantasks/backend/docs"

)

 // @title           API Kanban de Tarefas (Veritas)
 // @version         1.0
 // @description     API para o desafio fullstack da Veritas (React + Go).
 // @termsOfService  http: 
 // @host            localhost:8080
 // @BasePath
func main() {
	

	// Create our "DB"
	store := NewInMemoryTaskRepository();

	// We inject our BD into our Controller
	taskHandler := NewTaskHandler(store);



	// Create the routes
	router := mux.NewRouter()


	// Create the subrouter for our endpoint
	api := router.PathPrefix("/").Subrouter()

	api.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)


	api.HandleFunc("/tasks", taskHandler.GetAllTasks).Methods(http.MethodGet)   // GET /tasks
	api.HandleFunc("/tasks", taskHandler.CreateTask).Methods(http.MethodPost)   // POST /tasks
	api.HandleFunc("/tasks/{id}", taskHandler.GetTaskById).Methods(http.MethodGet) // GET /tasks/{id}
	api.HandleFunc("/tasks/{id}", taskHandler.UpdateTask).Methods(http.MethodPut)    // PUT /tasks/{id}
	api.HandleFunc("/tasks/{id}", taskHandler.DeleteTask).Methods(http.MethodDelete) // DELETE /tasks/{id}


	headersOK := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	originsOK := handlers.AllowedOrigins([]string{"*"}) // Permit all origins
	methodsOK := handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions})


	corsRouter := handlers.CORS(originsOK, headersOK, methodsOK)(router)


	port := ":8080"
	log.Printf("Servidor Go rodando na porta %s", port)


	if err := http.ListenAndServe(port, corsRouter); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}