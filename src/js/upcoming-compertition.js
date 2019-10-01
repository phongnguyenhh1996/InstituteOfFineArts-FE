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
var apiUrl = 'http://192.168.43.211:44396/'; // fetch compertitions list

fetchCompertitions(); // get compertitions function

function fetchCompertitions() {
  axios({
    method: 'get',
    url: apiUrl + "/api/Competitions",
    headers: {
      Authorization: "bearer " + localStorage.getItem('accessToken')
    }
  }).then(function (res) {
    if (res && res.data) {
      var awardItemClone = $('#awardItem').clone();
      $('#awardList').empty();
      res.data.forEach(function (item) {
        var awardItem = awardItemClone.clone();
        awardItem.attr('href', "admin/compertition-detail.html?id=" + item.CompetitionId);
        Object.keys(item).forEach(function (key) {
          awardItem.find("[name='" + key + "']").text(item[key]);
        });
        $('#awardList').append(awardItem);
        awardItem.fadeIn();
      });
    }
  });
}
//# sourceMappingURL=upcoming-compertition.js.map