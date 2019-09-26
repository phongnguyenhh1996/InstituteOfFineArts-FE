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
var apiUrl = 'http://192.168.1.42:44396/'; // init datepicker

$('[data-toggle="datepicker"]').datepicker(); // create user

$('#createUser').on('submit', function (e) {
  e.preventDefault();
  var formInput = $('#createUser').find('.form-control');
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
      method: 'post',
      url: apiUrl + "/api/Users",
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken')
      },
      data: data
    }).then(function (res) {
      return console.log(res);
    });
  }
});
//# sourceMappingURL=create-user.js.map