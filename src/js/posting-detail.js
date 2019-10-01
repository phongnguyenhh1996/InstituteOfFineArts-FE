"use strict";

/* eslint-disable linebreak-style */
var currentPosting = {};
var UNAUTHORIZED = 401;
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  var status = error.response.status;

  if (status === UNAUTHORIZED) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login.html';
  }

  return Promise.reject(error);
});
var apiUrl = 'http://192.168.43.211:44396/';
var urlString = window.location.href;
var url = new URL(urlString);
var id = url.searchParams.get('id');
fetchPosting();

function fetchPosting() {
  axios({
    method: 'get',
    url: apiUrl + "api/Postings/" + id,
    headers: {
      Authorization: "bearer " + localStorage.getItem('accessToken')
    }
  }).then(function (res) {
    console.log(res);

    if (res && res.data) {
      currentPosting = res.data;
      $('#postingImg').attr('src', "" + apiUrl + res.data.ImagePath);

      if (!res.data.Mark) {
        $('#postingMarkWrapper').hide();
      } else {
        $('#postingMarkWrapper').show();
        $('#postingMark').text(res.data.Mark);
      }
    }
  });
}

$('#addMark').click(function () {
  axios({
    method: 'put',
    url: apiUrl + "api/Postings/" + id,
    headers: {
      Authorization: "bearer " + localStorage.getItem('accessToken')
    },
    data: Object.assign({}, currentPosting, {
      Mark: $('#name').val()
    })
  }).then(function () {
    $('#exampleModal').modal('hide');
    fetchPosting();
  }).catch(function () {
    return toastr.error('Add mark failed!');
  });
});
//# sourceMappingURL=posting-detail.js.map