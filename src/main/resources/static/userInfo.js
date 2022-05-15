//заполнение шапки
const urlBar = 'http://localhost:8080/api/users/header'

const urlShowUserInfo = 'http://localhost:8080/api/user'

const header = document.getElementById('userInfo')

const tb = document.getElementById('table-body-user')

function getAuthentication() {
    fetch(urlBar)
        .then(res => res.json())
        .then(user => {
            let role = user.username + ' with roles: '
            user.roles.forEach(r => {
                role+=r.name.replace('ROLE_', ' ')
            })
            header.innerHTML = role
        })
}
getAuthentication()

let outPut = ''
function fillUserInfo(user) {
    outPut += ` <tr><td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.surname}</td>
                                    <td>${user.age}</td>
                                    <td>${user.email}</td>
                                    <td>${user.rolesToString}</td>
                                </tr>`;
    tb.innerHTML = outPut
}

fetch(urlShowUserInfo)
.then(res => res.json())
.then(res => fillUserInfo(res))