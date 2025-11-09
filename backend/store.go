package main;

import(

	"errors"
	"sync" 
	"time" 
	"github.com/google/uuid" // Generate unique id
	"sort"
	"strings"
)

// ----- Create the interface ------
type TaskStore interface{
	CreateTask(title string , description string , priority string , status string) (*Task , error);
	GetTask(id string) (*Task , error);
	GetAllTasks(filterPriority string, sortOrder string , searchTask string) ([]*Task ,error);
	UpdateTask(id string , payload  UpdateTaskPayload) (*Task , error);
	DeleteTask(id string )( error);
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
func (s *inMemoryTaskStore) CreateTask(title string, description string, priority string , status string) (*Task, error){

	s.mutex.Lock();

	defer s.mutex.Unlock();

	// Setting a default priority

	if (priority == ""){
		priority = "Media"
	}

	if (status == "") {
        status = "A Fazer" 
    }

	now := time.Now();
	

	newTask := &Task{
		ID:          uuid.New().String(), // GenerateID
		Title:       title,
		Description: description,
		Priority:  priority,
		Status:      status, // Default status
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	s.tasks[newTask.ID] = newTask;

	return newTask , nil;
}

func (s *inMemoryTaskStore) GetAllTasks(filterPriority string, sortOrder string , searchTask string) ([]*Task, error){

	// Read lock
	s.mutex.RLock();
	defer s.mutex.RUnlock();

	// Get all tasks
	allTasks := make([]*Task , 0 , len(s.tasks));

	// turns the map into a list
	for _, task := range s.tasks {
		allTasks = append(allTasks, task);
	}

	if searchTask != ""{
		searchedTasks := make([]*Task , 0)
		lowerSearch := strings.ToLower(searchTask)
			for _ , task := range allTasks {
				if strings.Contains(strings.ToLower(task.Title), lowerSearch) {
				searchedTasks = append(searchedTasks, task)
			}
			}
			allTasks = searchedTasks
	}
	// Apply filter
	if filterPriority != ""{
		filteredTasks := make([]*Task , 0)
		for _ , task := range allTasks {
			if task.Priority == filterPriority {
				filteredTasks = append(filteredTasks, task)
			}
		}
		allTasks = filteredTasks; // Replaces the complete list with the filtered list
	}

	// Set the "Values" for ordenation
	priorityValues := map[string]int{"Alta": 3, "Média": 2, "Baixa": 1}

	if sortOrder == "priority_desc" {
		sort.Slice(allTasks, func(i, j int) bool {
			// Decreasing ordination
			return priorityValues[allTasks[i].Priority] > priorityValues[allTasks[j].Priority]
		})
	} else if sortOrder == "priority_asc" {
		//Growing Ordination:
		sort.Slice(allTasks, func(i, j int) bool {
			return priorityValues[allTasks[i].Priority] < priorityValues[allTasks[j].Priority]
		})
	} else{
		// Sort in order of ration . before that whenever added reoordinated
		sort.Slice(allTasks, func(i, j int) bool {
            return allTasks[i].CreatedAt.Before(allTasks[j].CreatedAt)
        })
	}

	return allTasks , nil;

}

func (s *inMemoryTaskStore) GetTask(id string)  ( *Task, error){

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

	if payload.Description != nil {
		task.Description = *payload.Description
	}

	if payload.Priority != nil {
		task.Priority = *payload.Priority
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


