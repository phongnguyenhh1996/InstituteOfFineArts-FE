import $ from 'jquery'
import axios from 'axios'
const UNAUTHORIZED = 401
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
const apiUrl = 'http://192.168.1.42:44396/'
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
// auth admin page, get user infor
if (window.location.pathname.startsWith('/admin')) {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    window.location.href = '/login.html'
  } else {
    // hide all auth role element
    $('[data-role]').hide()
    // get current user infor
    axios({
      method: 'get',
      url: `${apiUrl}/user/me`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then((res) => {
        console.log(res)

        // if dont have user data then logout
        if (!(res && res.data)) {
          window.location.href = '/login.html'
        }
        // set user data into view
        const {
          data
        } = res
        $('#userName').append(data.Username)
        $('#userRole').append(ROLE[data.RoleId].roleName)
        // show only matching role auth element
        $(`[data-role*="${data.RoleId}"]`).show()
        // if not match route auth then logout
        const {
          authPath
        } = ROLE[data.RoleId]

        if (authPath.findIndex((path) => path === window.location.pathname) === -1) {
          window.history.back()
        }
      }).catch((res) => console.log(res))
  }
}

// login
$('#loginForm').on('submit', (e) => {
  e.preventDefault()
  const userName = $('#username')
  const password = $('#password')
  if (!userName.val().trim()) {
    userName.addClass('is-invalid')
  } else if (!password.val().trim()) {
    password.addClass('is-invalid')
  } else {
    axios({
      method: 'post',
      url: `${apiUrl}Token`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `grant_type=password&username=${userName.val()}&password=${password.val()}`
    }).then((res) => {
      if (res && res.data && res.data.access_token) {
        localStorage.setItem('accessToken', res.data.access_token)
        window.location.href = '/admin'
      }
    }
    )
  }
})

// Logout
$('#logout').click((e) => {
  e.preventDefault()
  localStorage.removeItem('accessToken')
  window.location.href = '/login.html'
})
