const urlBar = 'http://localhost:8080/api/users/header'

const header = document.getElementById('nav')

const url = 'http://localhost:8080/api/users'

const tb = document.getElementById('tb')


const trs = document.getElementsByTagName("tr")


function fillTr (user) {
    return  ` <tr id="${user.id}"><td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.surname}</td>
                                    <td>${user.age}</td>
                                    <td>${user.email}</td>
                                    <td>${user.rolesToString}</td>
                                    <td><button class="btnEdit btn btn-info">Edit</button></td>
                                    <td><button class="btnDelete btn btn-danger">Delete</button></td>
                                </tr>`
}



    function getAuthentication() {
        fetch(urlBar)
            .then(res => res.json())
            .then(user => {
                let headBar = user.username + ' with roles: '
                user.roles.forEach(role => {
                    headBar+=role.name.replace('ROLE_', ' ')
                })
                header.innerHTML = headBar
            })
    }
    getAuthentication()



    function fillUsersTable() {
        let outPutTable = ''
        fetch(url)
        .then(res => res.json())
        .then(users => {
        users.forEach(user => {
        outPutTable += fillTr(user)
    })
        tb.innerHTML = outPutTable;
    })
    }

    function getAllRoles(target) {
        fetch('http://localhost:8080/api/users/roles')
            .then(res => res.json())
            .then(roles => {
                let roleList = ''
                roles.forEach(role => {
                    roleList += `<option value='${role.id}'>${role.name.replace('ROLE_', ' ')}</option>`
                })
                target.innerHTML = roleList
            })
    }


    fetch(url)
    .then(data => fillUsersTable(data))
    .catch(error => console.log(error))

    let roleList = (options) => {
        let array = []
        for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
        let role = {
        id: options[i].value
    }
        array.push(role)
    }
    }
        return array;
    }


    ////////////////////////////Изменение юзера(ЗАПОЛНЕНИЕ ИНПУТОВ ПРИ ОТКРЫТИИ МОДАЛЬНОГО ОКНА)///////////////////////


    const on = (element, event1, selector, handler) => {
        console.log(element)
        element.addEventListener(event1, e => {
        if (e.target.closest(selector)) {
        handler(e)
    }
    });
    };

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));

    let id = 0;
    let username = ''
    let surname = ''
    let age = ''
    let email = ''


    const idForm = document.getElementById('id')

    const usernameForm = document.getElementById('username')

    const surnameForm = document.getElementById('surname')

    const ageForm = document.getElementById('age')

    const emailForm = document.getElementById('email')

    const passwordForm = document.getElementById('password')

    const editSelect = document.getElementById('editRoles');



    on(document, 'click', '.btnEdit', e => {
        const parent = e.target.parentNode.parentNode;
        id = parent.children[0].innerHTML
        console.log(id)
        username = parent.children[1].innerHTML
        console.log(username)
        surname = parent.children[2].innerHTML
        age = parent.children[3].innerHTML
        email = parent.children[4].innerHTML

        idForm.value = id;
        usernameForm.value = username;
        surnameForm.value = surname;
        ageForm.value = age;
        emailForm.value = email;
        editSelect.value = getAllRoles(editSelect)
        editModal.show()
    })


    /////////////////// submit edit form ////////////////



const editFormModal = document.querySelector('.editFormModal')
    editFormModal.addEventListener('submit', (e) => {
        e.preventDefault()
        let setRoles = roleList(editSelect)
        const editFetch = `http://localhost:8080/api/users/${id}`

        fetch(editFetch, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idForm.value,
                username: usernameForm.value,
                surname: surnameForm.value,
                age: ageForm.value,
                email: emailForm.value,
                password: passwordForm.value,
                roles: setRoles
            })
        })
            .then(res => res.json())
            .then(user => {
                document.getElementById(`${user.id}`).innerHTML = fillTr(user)
            })

        editModal.hide()
        passwordForm.value = ' '
    })



////////////////////////////Изменение юзера(ЗАПОЛНЕНИЕ ИНПУТОВ ПРИ ОТКРЫТИИ МОДАЛЬНОГО ОКНА)///////////////////////




////////////////Модальное окно удаления////////////////////////////

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const idDeleteForm = document.getElementById('idDel')
    const usernameDeleteForm = document.getElementById('usernameDel')
    const surnameDeleteForm = document.getElementById('surnameDel')
    const ageDeleteForm = document.getElementById('ageDel')
    const emailDeleteForm = document.getElementById('emailDel')
    const deleteForm = document.querySelector('.deleteFormModal')
    const  deleteSelect = document.getElementById('deleteRoles')


    on(document, 'click', '.btnDelete', e => {

        const parent = e.target.parentNode.parentNode
        id = parent.children[0].innerHTML;
        username = parent.children[1].innerHTML;
        surname = parent.children[2].innerHTML;
        age = parent.children[3].innerHTML;
        email = parent.children[4].innerHTML;


        idDeleteForm.value = id;
        usernameDeleteForm.value = username;
        surnameDeleteForm.value = surname;
        ageDeleteForm.value = age;
        emailDeleteForm.value = email;
        deleteSelect.value = getAllRoles(deleteSelect)
        deleteModal.show()
    })

    /////////////////////////////////////сабмит формы удаления//////////////////
    deleteForm.addEventListener('submit', e => {
        e.preventDefault()
        const urlDelete = `http://localhost:8080/api/users/${id}`
        fetch(urlDelete, {
        method: 'DELETE'

    })
        .then(() => document.getElementById(`${idDeleteForm.value}`).remove())

        deleteModal.hide()
    })


    /////////////////add new user submit form////////////////////////
    let addSelect = document.getElementById('addRole')

    getAllRoles(addSelect)

    const usernameAddForm = document.getElementById('userAdd')
    const surnameAddForm = document.getElementById('surnameAdd')
    const ageAddForm = document.getElementById('ageAdd')
    const emailAddForm = document.getElementById('emailAdd')
    const passwordAddForm = document.getElementById('passwordAdd')
    const addForm = document.querySelector('.addForm')




    addForm.addEventListener('submit', e => {
        e.preventDefault()
        let setRoles = roleList(addSelect)
        console.log(setRoles)
        const addFetch = `http://localhost:8080/api/users`
        fetch(addFetch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameAddForm.value,
                surname: surnameAddForm.value,
                age: ageAddForm.value,
                email: emailAddForm.value,
                roles: setRoles,
                password: passwordAddForm.value

            })

        })
            .then(user => user.json())
            .then(user => fillUsersTable(user))
        usernameAddForm.value = ''
        surnameAddForm.value = ''
        ageAddForm.value = ''
        emailAddForm.value = ''
        passwordAddForm.value = ''
    })



//     .then(user => {
//    const newRow =  document.createElement("tr")
//    tb.appendChild(newRow).innerHTML = fillTr(user)
// })


//const editModal = new bootstrap.Modal(document.getElementById('editModal'));
// const id = document.getElementById('id')
// const username = document.getElementById('username')
// const surname = document.getElementById('surname')
// const age = document.getElementById('age')
// const email = document.getElementById('email')
// const roles = document.getElementById('editRoles')
//let option = ""

// editBtn.addEventListener('click', () => {
//     editModal.show()
// })











// Callback - функция которая вызывается после асинхронного кода
// Асинх - функция которая исполняется не сразу а в течении какого-то времени
// function loadScript(src, callback) {
//     let script = document.createElement('script');
//     script.src = src;
//     script.onload = () => callback(script);
//     document.head.append(script);
// }
//
// loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', data => {
//     alert(`Здорово, скрипт ${data.src} загрузился ` + console.log(data));
//     alert( _ ); // функция, объявленная в загруженном скрипте
// });

// const header = document.getElementById('nav')
//
// console.log(header)
//
// let output= ''
//
// const url = 'http://localhost:8080/api/users/1'
//
//
//
// fetch(url)
// .then(res => res.json())
// .then(data => {
//     const dataArray = []
//     dataArray.push(data)
//     dataArray.forEach(user => {
//         output = `
// <a class="navbar-brand col-md-3" href="#">
//     <b>${user.email}</b>
//     <label>with roles:</label>
//     <label>${user.rolesToString}</label>
// </a>
// `;
//     });
//     header.innerHTML = output
// })

