console.log('Client-side js is here!');

const tasksEndpoint = '/api/tasks';

const removeTask = async({ target }) => {
    const taskID = target.value;
    console.log(taskID);
    try {
        const res = await fetch(`${tasksEndpoint}?id=${taskID}`, { method: 'delete' });
        console.log(res);
        location.reload();
    } catch(error) {
        console.error(error);
    }
}

const toggleCompletionStatus = async({ target }) => {
    //refactor to handle whether complete or not here and send with request rather than on server-side
    const taskID = target.id;
    const newCompletionStatus = target.classList.contains('complete') ? 'false' : 'true';
    try {
        const res = await fetch(`${tasksEndpoint}?id=${taskID}&complete=${newCompletionStatus}`, { method: 'put' });
        console.log(res);
        location.reload();
    } catch(error) {
        console.error(error);
    }
    
    
}

const removeButtons = document.querySelectorAll('.remove-btn');
Array.from(removeButtons).forEach((button) => button.addEventListener('click', removeTask));

const taskSpans = document.querySelectorAll('.task');
Array.from(taskSpans).forEach((taskSpan) => taskSpan.addEventListener('click', toggleCompletionStatus));