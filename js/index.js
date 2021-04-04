let todoListElement = document.querySelector('.js-todo-list');
let itemsLeftElement = document.querySelector('.js-count-items-left');
let formToDo = document.querySelector('.js-form-todo');
let clearButton = document.querySelector('.js-clear-button');
let actionsFooter = document.querySelector('.js-actions-footer');
let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [] ;

const getTemplateTask = (task) => {
  return `
  <div draggable="true" class="js-item-list">
    <li class="todo__list-item js-item-task" id="${task.id}" data-item="${task.id}" data-task='${JSON.stringify(task)}'>
      <div class="todo__list-content-title">
        <input type="checkbox" name="select" class="todo__list-radio-field" data-action="select-task" task-id="${task.id}" ${task.completed ? "checked": ''}/>
        <span class="todo__list-custom-radio">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
        </span>
        <p class="todo__list-name-task">
          ${task.name}
          <button class="todo__list-button-delete" task-id="${task.id}" data-action="delete-task">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
          </button>
        </p>
      </div>
    </li>
  </div>
  `
}

const renderTasks = ( tasks, elementToRender ) => {
  elementToRender.innerHTML = ''
  tasks.map(task => {
    elementToRender.insertAdjacentHTML('beforeend', getTemplateTask(task));
  })
}

const renderTask = ( task, elementToRender ) => {
  elementToRender.insertAdjacentHTML('beforeend', getTemplateTask(task))
}

const refreshCounterItemsLeft = () => {
  let tasksCompleted = tasks.filter(task => !task.completed);
  itemsLeftElement.innerHTML = `${tasksCompleted.length} items left`
}

const markAsComplete = (taskId,isTaskCompleted) => {
  let indexTask = tasks.findIndex(task => task.id == taskId);
  let task = tasks[indexTask]
  if ( isTaskCompleted ) {
    task.completed = true
  } else {
    task.completed = false
  }
  tasks[indexTask] = task
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const deleteTask = ( taskId ) => {
  let listItemDeleted = document.querySelector(`li[data-item="${taskId}"]`)
  let newTasksArray = tasks.filter(task => task.id != taskId);
  tasks = newTasksArray
  localStorage.setItem('tasks', JSON.stringify(tasks))
  listItemDeleted.classList.add('deleted-task')
  refreshCounterItemsLeft()
}

todoListElement.addEventListener('click', e => {
  if ( e.target.getAttribute('data-action') === 'select-task' ) {
    let taskId = e.target.getAttribute('task-id');
    markAsComplete(taskId,e.target.checked)
    refreshCounterItemsLeft();
  }
  if ( e.target.getAttribute('data-action') === 'delete-task' ) {
    let taskId = e.target.getAttribute('task-id')
    deleteTask(taskId)
  }
})

const getActiveTasks = () => {
  return tasks.filter(task => !task.completed);
}

const getCompletedTasks = () => {
  return tasks.filter(task => task.completed);
}


actionsFooter.addEventListener('click', e => {
  e.preventDefault();
  if ( e.target.tagName === 'BUTTON' ) {
    if ( e.target.getAttribute('data-action') === 'show-all') {
      renderTasks(tasks,todoListElement);
    }
    if ( e.target.getAttribute('data-action') === 'show-active') {
      renderTasks(getActiveTasks(),todoListElement);
    }
    if ( e.target.getAttribute('data-action') === 'show-completed') {
      renderTasks(getCompletedTasks(), todoListElement);
    }
  }
})

formToDo.addEventListener('submit', e => {
  e.preventDefault()
  let form = new FormData(e.target);
  let task = {
    id: Math.floor(Math.random() * 10000 ),
    name: form.get('task'),
    completed: false
  }
  tasks.push(task)
  e.target.reset();
  localStorage.setItem('tasks', JSON.stringify(tasks))
  renderTask(task,todoListElement)
  refreshCounterItemsLeft()
})

clearButton.addEventListener('click', e => {
  tasks = []
  localStorage.setItem('tasks', [])
})



refreshCounterItemsLeft()

if ( tasks.length ) {
  renderTasks(tasks, todoListElement)
}

const sortable = new Draggable.Sortable(todoListElement,{
  draggable: '.js-item-list',
  mirror: {
    appendTo: todoListElement,
    constraintDimesions: true
  },
  plugins: [SortAnimation.default],
  sortAnimation: {
    duration: 200,
    easingFunction: 'ease-in-out'
  }
})

sortable.on('sortable:start', e => {
  e.data.dragEvent.data.source.classList.add('drag-styles')
})

sortable.on('sortable:stop', e => {
  e.data.dragEvent.data.source.classList.remove('drag-styles')
})

sortable.on('drag:stopped', e => {
  let itemsTasks = document.querySelectorAll('.js-item-task');
  let newArrayTasks = []
  itemsTasks.forEach(task => {
    newArrayTasks.push(JSON.parse(task.getAttribute('data-task')))
  })
  tasks = newArrayTasks
  localStorage.setItem('tasks', JSON.stringify(tasks))
})
