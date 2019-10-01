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

$('[data-toggle="datepicker"]').datepicker(); // fetch award list

axios({
  method: 'get',
  url: apiUrl + "/api/Awards",
  headers: {
    Authorization: "bearer " + localStorage.getItem('accessToken')
  }
}).then(function (res) {
  if (res && res.data) {
    res.data.forEach(function (item) {
      var awardItem = $('<option></option>');
      awardItem.text(item.AwardName);
      awardItem.attr('value', item.AwardId);
      $('#AwardId').append(awardItem);
    });
  }
}); // create user

$('#createCompertition').on('submit', function (e) {
  e.preventDefault();
  var formInput = $('#createCompertition').find('.form-control');
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
      url: apiUrl + "/api/Competitions",
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken')
      },
      data: data
    }).then(function () {
      window.location.href = '/admin/upcoming-compertition.html';
    });
  }
});
//# sourceMappingURL=create-compertition.js.map