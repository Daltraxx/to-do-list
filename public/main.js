console.log('Client-side js is here!');

const tasksEndpoint = '/api/tasks';

const removeTask = async({ target }) => {
    const taskID = target.value;
    console.log(taskID);
    try {
        const res = await fetch(`${tasksEndpoint}/id/${taskID}`, {
            method: 'delete'
        })
        console.log(res);
        location.reload();
    } catch(error) {
        console.error(error);
    }
}

const removeButtons = document.querySelectorAll('.remove-btn');

Array.from(removeButtons).forEach((button) => button.addEventListener('click', removeTask));