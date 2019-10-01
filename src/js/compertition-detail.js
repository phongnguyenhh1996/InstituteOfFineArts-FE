"use strict";

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
axios({
  method: 'get',
  url: apiUrl + "/api/Competitions/" + id,
  headers: {
    Authorization: "bearer " + localStorage.getItem('accessToken')
  }
}).then(function (res) {
  if (res && res.data) {
    var data = res.data;
    $('.compertitionName').text(data.CompetitionName);
    $('#compertitionTime').text(moment(data.StartDate).format('MMMM Do YYYY, h:mm:ss a') + " - " + moment(data.EndDate).format('MMMM Do YYYY, h:mm:ss a'));
    $('#compertitionAward').text(data.AwardDetail);
    $('#daysLeft').text(moment(data.EndDate).diff(moment(), 'days') + " DAYS LEFT");

    if (data.isUserHavePosting) {
      $('#createPosting').text('See your posting');
      $('#createPosting').attr('href', "admin/posting-detail.html?id=" + data.PostingId);
    } else {
      $('#createPosting').attr('href', "admin/create-posting.html?id=" + data.CompetitionId);
    }
  }
});
//# sourceMappingURL=compertition-detail.js.map