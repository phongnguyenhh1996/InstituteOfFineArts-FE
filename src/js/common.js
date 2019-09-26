"use strict";

var UNAUTHORIZED = 401;
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  var status = error.response.status;

  if (status === UNAUTHORIZED) {
    window.location.href = '/login.html';
  }

  return Promise.reject(error);
});
var apiUrl = 'http://192.168.1.42:44396/';
var ROLE = {
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
}; // auth admin page, get user infor

if (window.location.pathname.startsWith('/admin')) {
  var accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    window.location.href = '/login.html';
  } else {
    // hide all auth role element
    $('[data-role]').hide(); // get current user infor

    axios({
      method: 'get',
      url: apiUrl + "/user/me",
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken')
      }
    }).then(function (res) {
      console.log(res); // if dont have user data then logout

      if (!(res && res.data)) {
        window.location.href = '/login.html';
      } // set user data into view


      var data = res.data;
      $('#userName').append(data.Username);
      $('#userRole').append(ROLE[data.RoleId].roleName); // show only matching role auth element

      $("[data-role*=\"" + data.RoleId + "\"]").show(); // if not match route auth then logout

      var authPath = ROLE[data.RoleId].authPath;

      if (authPath.findIndex(function (path) {
        return path === window.location.pathname;
      }) === -1) {
        window.history.back();
      }
    }).catch(function (res) {
      return console.log(res);
    });
  }
} // login


$('#loginForm').on('submit', function (e) {
  e.preventDefault();
  var userName = $('#username');
  var password = $('#password');

  if (!userName.val().trim()) {
    userName.addClass('is-invalid');
  } else if (!password.val().trim()) {
    password.addClass('is-invalid');
  } else {
    axios({
      method: 'post',
      url: apiUrl + "Token",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: "grant_type=password&username=" + userName.val() + "&password=" + password.val()
    }).then(function (res) {
      if (res && res.data && res.data.access_token) {
        localStorage.setItem('accessToken', res.data.access_token);
        window.location.href = '/admin';
      }
    });
  }
}); // Logout

$('#logout').click(function (e) {
  e.preventDefault();
  localStorage.removeItem('accessToken');
  window.location.href = '/login.html';
});
//# sourceMappingURL=common.js.map