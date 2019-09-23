import $ from 'jquery'
const fileInput = $('#file-input')

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = (error) => reject(error)
})
fileInput.change(function (e) {
  const img = $('<img style="display: block" class="img-fluid"/>')
  toBase64(e.target.files[0]).then((res) => {
    $(this).prev().remove()
    img.attr('src', res)
    img.hide()
    $(this).before(img)
    img.fadeIn()
  })
})
