package main

type Task struct {
	ID          string `json:"id"`
	Title       string `json:"title" validate:"required,min=3"` // The title is required and must be at least 3 characters long.
	Description string `json:"description,omitempty"`          // omitempty = If it's empty, it won't appear in the JSON.
	Status      string `json:"status" validate:"required,oneof='A Fazer' 'Em Progresso' 'Concluídas'"`
}

// UpdateTaskPayload is the DTO we use for the UPDATE (PUT/PATCH) route.
type UpdateTaskPayload struct {
	Title       *string `json:"title,omitempty" validate:"omitempty,min=3"`
	Description *string `json:"description,omitempty"`
	Status      *string `json:"status,omitempty" validate:"omitempty,oneof='A Fazer' 'Em Progresso' 'Concluídas'"`
}