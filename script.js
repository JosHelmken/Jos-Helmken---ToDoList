const getTaskBtn = document.querySelector('#add-task-button');
const getTaskInput = document.querySelector('#task-input');
const getTaskList = document.querySelector('#task-list');


// Create the items to make the TODO List //
const setListItem = taskID => {
  
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const label = document.createElement('label');  
  const editButton = document.createElement('i');
  const deleteButton = document.createElement('i');

  checkbox.type = "checkbox";
  checkbox.id = taskID._id;
  checkbox.className = 'task-done';
  
  if(taskID.done) {
    checkbox.checked = true;
    li.classList.add('checked');
  };

  label.innerText = taskID.description;
  label.htmlFor = taskID._id;
  editButton.className = 'editbtn fas fa-edit';
  editButton.id = taskID._id;
  editButton.alt = 'test'
  deleteButton.className = 'deletebtn fas fa-trash-alt';
  deleteButton.id = taskID._id;

  // Add the list item to the dom //
  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;

}

// Display list funtion // 
const displayList = async () => {
  const todoList = await getData();

  if(!todoList.length) {
    getTaskList.innerHTML = '<li>No items found</li>';
  } 
    todoList.forEach(task => {
      const taskItem = setListItem(task);
      getTaskList.appendChild(taskItem);     
    });
}

displayList();


// Create a new Task 
const setTask = async () => {
  // add the task to the list 
  const taskInput = getTaskInput.value;
  const tempTask = {
    description: taskInput,
    done: false, 
    _id: 'undefined'
  };
  const tempListItem = setListItem(tempTask);
  getTaskList.insertBefore(tempListItem, getTaskList.children[0]);
  
  getTaskInput.value = '';

  // set the real data into the database //
  const data = JSON.stringify({ description: taskInput, done: false});
  const response = await postData(data);

   if(typeof response === 'object') {
     const newTask = setListItem(response);
     getTaskList.replaceChild(newTask, getTaskList.children[-1]);
   };
}

// remove task from the list
const removeTask = async event => {
  const itemToRemove = event.target.parentElement;
  itemToRemove.parentElement.removeChild(itemToRemove);
  const removeId = event.target.id;
  deleteData(removeId);
}

// Update task as done //
const setTaskDone = async box => {
  const checkbox = box.target
  const taskId = checkbox.id;
  const li = checkbox.parentElement;
  const text = checkbox.nextElementSibling.innerText;
  const checkStatus = checkbox.checked;
  li.classList.toggle('checked');

  const body = JSON.stringify({description: text, done: checkStatus});
  updateData(taskId, body);
}

// update Tesk from a task //
const updateTask = async event => {
  const itemId = event.target.id;
  const itemParent = event.target.parentElement;
  const original = itemParent.innerHTML;
  const isChecked = itemParent.children[0].checked;
  const itemToEdit = itemParent.querySelector('label');
  const getEditBtn = itemParent.querySelector('i');
  const editField = 
    `<input type="text" class="editbox" placeholder="${itemToEdit.innerText}" id="editbox">
    <div class="edit-btns"><a class="save fas fa-check" alt="save"> <a class="cancel fas fa-times" alt="cancel"></div>`;
    getEditBtn.classList.add('hidden');
    itemParent.innerHTML = editField;
    document.getElementById('editbox').focus();
    
    const getEditField = document.querySelector('#editbox');
    const getSaveButton = document.querySelector('.save');
    const getCancelButton = document.querySelector('.cancel');

    getCancelButton.addEventListener('click', () => {
      itemParent.innerHTML = original;
     });

     getSaveButton.addEventListener('click', () => {
       if(getEditField.value !== '') {
         const taskValue = getEditField.value;
         const updateTaskValue = {
           description: taskValue,
           done: isChecked,
           _id: itemId
         };
         const updatedLi = setListItem(updateTaskValue);
         const getParent = itemParent.parentElement;
         getParent.replaceChild(updatedLi, itemParent);

         const dbValue = JSON.stringify({ description: taskValue, done: isChecked});
         updateData(itemId, dbValue);
         


       }
     })

}






// Event Listeners //
document.addEventListener('click', event => {
  const curItem = event.target;
  // delete button is pressed //
  if(curItem.classList.contains('fa-trash-alt')) {
    removeTask(event);    
  };

  if(curItem.classList.contains('fa-edit')) {
    updateTask(event);    
  };
});

getTaskBtn.addEventListener('click', () => {
  if(getTaskInput.value !== '') {
    getTaskInput.classList.remove('error-no-entry');
    setTask();
  } else {
    console.log('Error : Task is empty');
    getTaskInput.classList.add('error-no-entry');
  };
});

getTaskInput.addEventListener('keypress', event => {
  if(event.keyCode === 13 && getTaskInput.value !== '') {
    getTaskInput.classList.remove('error-no-entry');
    setTask();
  }
});

document.body.addEventListener('change', event => {
   setTaskDone(event);
});