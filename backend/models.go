package main

import (
	"time"
)
type Task struct {
	ID          string `json:"id"`
	Title       string `json:"title" validate:"required,min=3"` // The title is required and must be at least 3 characters long.
	Description string `json:"description,omitempty"`          // omitempty = If it's empty, it won't appear in the JSON.
	Priority  	string 	`json:"priority,omitempty" validate:"omitempty,oneof='Alta' 'Média' 'Baixa'"`
	Status      string `json:"status,omitempty" validate:"omitempty,oneof='A Fazer' 'Em Progresso' 'Concluídas'"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// UpdateTaskPayload is the DTO we use for the UPDATE (PUT/PATCH) route.
type UpdateTaskPayload struct {
	Title       *string `json:"title,omitempty" validate:"omitempty,min=3"`
	Description *string `json:"description,omitempty"`
	Priority  	*string `json:"priority,omitempty" validate:"omitempty,oneof='Alta' 'Média' 'Baixa'"`
	Status      *string `json:"status,omitempty" validate:"omitempty,oneof='A Fazer' 'Em Progresso' 'Concluídas'"`
}	

// CreateTaskPayload is the DTO we use for the Create (POST) route.
type CreateTaskPayload struct {
	Title       string `json:"title" validate:"required,min=3"`
	Description string `json:"description,omitempty"`
	Priority  	string `json:"priority,omitempty" validate:"omitempty,oneof='Alta' 'Média' 'Baixa'"`
}