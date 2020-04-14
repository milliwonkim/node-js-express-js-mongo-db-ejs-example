const update = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then(response => {
        window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Darth Vadar'
        })
    })
    .then(res => {
            if(res.ok) return res.json()
    })
    .then(response => {
        if(response === 'No quote to delete') {
            messageDiv.textContent = 'No Darth Vadar quote to delete'
        } else {
            window.location.reload(true)
        }
    })
    .catch(err => console.error(err))
})

