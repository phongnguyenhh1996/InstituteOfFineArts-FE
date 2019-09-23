"use strict";

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
//# sourceMappingURL=create-posting.js.map