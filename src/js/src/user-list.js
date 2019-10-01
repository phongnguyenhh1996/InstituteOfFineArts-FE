/* eslint-disable linebreak-style */
import $ from 'jquery'
import axios from 'axios'
const UNAUTHORIZED = 401
const ROLE = {
  1: {
    roleName: 'Admin',
    authPath: ['/admin/', '/admin/user-list.html', '/admin/create-user.html']
  },
  2: {
    roleName: 'Manager',
    authPath: ['/admin/']
  },
  3: {
    roleName: 'Teacher',
    authPath: ['/admin/']
  },
  4: {
    roleName: 'Student',
    authPath: ['/admin/']
  }
}
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      status
    } = error.response
    if (status === UNAUTHORIZED) {
      window.location.href = '/login.html'
    }
    return Promise.reject(error)
  }
)
const apiUrl = 'http://192.168.43.211:44396/'
// get user list
axios({
  method: 'get',
  url: `${apiUrl}/api/Users`,
  headers: {
    Authorization: `bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then((res) => {
    const {
      data
    } = res
    const tableUser = $('#userList')
    // clone row
    const rowData = $('#rowData').clone()
    // empty table
    tableUser.find('tbody').empty()
    // append every row
    if (data.length) {
      data.forEach((item) => {
        const newRowData = rowData.clone()
        const cell = newRowData.find('td')
        cell.eq(0).empty().append(item.Username)
        cell.eq(1).empty().append(item.YearOfBirth)
        // eslint-disable-next-line no-magic-numbers
        cell.eq(2).empty().append(ROLE[item.RoleId].roleName)
        newRowData.find('i.fas.fa-user-edit').parent().attr('href', `admin/edit-user.html?id=${item.UserId}`)
        tableUser.find('tbody').append(newRowData)
      })
    }
  })

$('test').show()
