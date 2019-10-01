"use strict";

/* eslint-disable linebreak-style */
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
var apiUrl = 'http://192.168.43.211:44396/'; // init datepicker

$('[data-toggle="datepicker"]').datepicker(); // fetch user

var urlString = window.location.href;
var url = new URL(urlString);
var id = url.searchParams.get('id');
axios({
  method: 'get',
  url: apiUrl + "api/Users/" + id,
  headers: {
    Authorization: "bearer " + localStorage.getItem('accessToken')
  }
}).then(function (res) {
  if (res && res.data) {
    Object.keys(res.data).forEach(function (key) {
      $(".form-control[name='" + key + "']").val(res.data[key]);
    });
  }
});
$('#editUser').on('submit', function (e) {
  e.preventDefault();
  var formInput = $('#editUser').find('.form-control');
  formInput.removeClass('is-invalid');
  formInput.next().remove();
  var data = {};
  var invalid = false;
  formInput.each(function () {
    if (!$(this).val().trim()) {
      invalid = true;
      $(this).addClass('is-invalid');
      $(this).after($('<div class="invalid-feedback">This field is required!</div>'));
    } else {
      data[$(this).attr('name')] = $(this).val().trim();
    }
  });

  if (!invalid) {
    axios({
      method: 'put',
      url: apiUrl + "api/Users/" + id,
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken')
      },
      data: data
    }).then(function (res) {
      if (res) {
        window.location.href = 'admin/user-list.html';
      }
    });
  }
});
//# sourceMappingURL=edit-user.js.map