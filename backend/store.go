package main;

import(

	"errors"
	"sync" 
	"time" 
	"github.com/google/uuid" // Generate unique id
)

// ----- Create the interface ------
type TaskStore interface{
	CreateTask(title string , description string) (*Task , error);
	GetTask(id string) (*Task , error);
	GetAllTasks() ([]*Task ,error);
	UpdateTask(id string , payload  UpdateTaskPayload) (*Task , error);
	DeleteTask(id string )(*Task , error);
}

// ----- will act like the db -----
type inMemoryTaskStore struct{

	// Save the task adress
	tasks map[string]*Task;

	mutex sync.RWMutex; 
}

func NewInMemoryTaskRepository() *inMemoryTaskStore{
	return &inMemoryTaskStore{
		// create the map
		tasks: make(map[string]*Task),
	}
}

// ----- Create the services ------
func (s *inMemoryTaskStore) CreateTask(title string, description string, prioridade string) (*Task, error){

	s.mutex.Lock();

	defer s.mutex.Unlock();

	// Setting a default priority

	if (prioridade == ""){
		prioridade = "Media"
	}

	now := time.Now();
	status := "A Fazer"

	newTask := &Task{
		ID:          uuid.New().String(), // GenerateID
		Title:       title,
		Description: description,
		Prioridade:  prioridade,
		Status:      status, // Default status
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	s.tasks[newTask.ID] = newTask;

	return newTask , nil;
}

func (s *inMemoryTaskStore) GetAllTasks() ([]*Task, error){

	// Read lock
	s.mutex.RLock();
	defer s.mutex.RUnlock();

	// Get all tasks
	allTasks := make([]*Task , 0 , len(s.tasks));

	// turns the map into a list
	for _, task := range s.tasks {
		allTasks = append(allTasks, task);
	}

	return allTasks , nil;

}

func (s *inMemoryTaskStore) GetTaksById(id string)  ( *Task, error){

	s.mutex.RLock();
	defer s.mutex.RUnlock();

	 // Search for task based on id
	 task , exists := s.tasks[id]

	 if !exists{
		return  nil , errors.New("Task not exist");
	 }

	 return task , nil
}

func (s *inMemoryTaskStore) UpdateTask(id string , payload UpdateTaskPayload) (*Task, error){

	s.mutex.Lock();
	defer s.mutex.Unlock()

	task, exists := s.tasks[id]

	if !exists {
		return nil , errors.New("Task not found")
	}

	if payload.Title != nil{
		task.Title = *payload.Title
	}

	if payload.Prioridade != nil {
		task.Prioridade = *payload.Prioridade
	}
	if payload.Status != nil {
		task.Status = *payload.Status
	}

	now := time.Now();

	task.UpdatedAt = now

	return  task , nil
}

func (s *inMemoryTaskStore) DeleteTask(id string) error{
	s.mutex.Lock();
	defer s.mutex.Unlock();

 	 // Search for task based on id

	_ , exists := s.tasks[id]

	//If it does not exist it makes an error

	if !exists {
		return  errors.New("Task not found");
	}

	// If exist delete

	delete(s.tasks, id)

	return nil;

}


