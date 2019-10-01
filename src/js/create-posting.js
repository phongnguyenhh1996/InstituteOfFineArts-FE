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
    $('#Compertition').val(data.CompetitionName);
  }
});
var fileInput = $('#file-input');

var toBase64 = function toBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      return resolve(reader.result);
    };

    reader.onerror = function (error) {
      return reject(error);
    };
  });
};

fileInput.change(function (e) {
  var _this = this;

  var img = $('<img style="display: block" class="img-fluid"/>');
  toBase64(e.target.files[0]).then(function (res) {
    $(_this).prev().remove();
    img.attr('src', res);
    img.hide();
    $(_this).before(img);
    img.fadeIn();
  });
});
$('#createPosting').on('submit', function (e) {
  e.preventDefault();
  var formInput = $('#createPosting').find('.form-control');
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
    toastr.info('Uploading image...');
    var formData = new FormData();
    var file = $('#file-input').prop('files')[0];
    formData.append('image', file, file.name);
    axios({
      method: 'post',
      url: apiUrl + "Postings/UploadImage",
      headers: {
        Authorization: "bearer " + localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then(function (res) {
      if (res && res.data && res.data.Message) {
        axios({
          method: 'post',
          url: apiUrl + "/api/Postings",
          headers: {
            Authorization: "bearer " + localStorage.getItem('accessToken')
          },
          data: {
            CompetitionId: id,
            ImagePath: "Image/" + res.data.Message,
            Quote: $('#textarea-input').val()
          }
        }).then(function () {
          window.location.href = '/admin/posting.html';
        });
      } else {
        toastr.error('Upload file failed!');
      }
    }).catch(function () {
      return toastr.error('Upload file failed!');
    });
  }
});
//# sourceMappingURL=create-posting.js.map