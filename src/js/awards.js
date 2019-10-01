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
var apiUrl = 'http://192.168.43.211:44396/'; // fetch award list

fetchAwardList(); // create award

$('#addAward').click(function () {
  var formInput = $('.form-control');
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
      url: apiUrl + "/api/Awards",
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken')
      },
      data: data
    }).then(function (res) {
      if (res && res.data) {
        $('#exampleModal').modal('hide'); // fetch award list

        fetchAwardList();
      }
    });
  }
}); // get award function

function fetchAwardList() {
  axios({
    method: 'get',
    url: apiUrl + "/api/Awards",
    headers: {
      Authorization: "bearer " + localStorage.getItem('accessToken')
    }
  }).then(function (res) {
    if (res && res.data) {
      var awardItemClone = $('#awardItem').clone();
      $('#awardList').empty();
      res.data.forEach(function (item) {
        var awardItem = awardItemClone.clone();
        Object.keys(item).forEach(function (key) {
          awardItem.find("[name='" + key + "']").text(item[key]);
        });
        $('#awardList').append(awardItem);
        awardItem.fadeIn();
      });
    }
  });
}
//# sourceMappingURL=awards.js.map