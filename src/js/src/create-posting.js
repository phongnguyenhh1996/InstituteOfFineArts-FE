import $ from 'jquery'
import axios from 'axios'
import toastr from 'toastr'
const UNAUTHORIZED = 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      status
    } = error.response
    if (status === UNAUTHORIZED) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login.html'
    }
    return Promise.reject(error)
  }
)
const apiUrl = 'http://192.168.43.211:44396/'
const urlString = window.location.href
const url = new URL(urlString)
const id = url.searchParams.get('id')


axios({
  method: 'get',
  url: `${apiUrl}/api/Competitions/${id}`,
  headers: {
    Authorization: `bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then((res) => {
    if (res && res.data) {
      const data = res.data
      $('#Compertition').val(data.CompetitionName)
    }
  })
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
$('#createPosting').on('submit', (e) => {
  e.preventDefault()
  const formInput = $('#createPosting').find('.form-control')
  formInput.removeClass('is-invalid')
  formInput.next().remove()
  const data = {}
  let invalid = false
  formInput.each(function () {
    if (!$(this).val().trim()) {
      invalid = true
      $(this).addClass('is-invalid')
      $(this).after($('<div class="invalid-feedback">This field is required!</div>'))
    } else {
      data[$(this).attr('name')] = $(this).val().trim()
    }
  })
  if (!invalid) {
    toastr.info('Uploading image...')
    const formData = new FormData()
    const file = $('#file-input').prop('files')[0]
    formData.append('image', file, file.name)
    axios({
      method: 'post',
      url: `${apiUrl}Postings/UploadImage`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then((res) => {
        if (res && res.data && res.data.Message) {
          axios({
            method: 'post',
            url: `${apiUrl}/api/Postings`,
            headers: {
              Authorization: `bearer ${localStorage.getItem('accessToken')}`
            },
            data: {
              CompetitionId: id,
              ImagePath: `Image/${res.data.Message}`,
              Quote: $('#textarea-input').val()
            }
          })
            .then(() => {
              window.location.href = '/admin/posting.html'
            })
        } else {
          toastr.error('Upload file failed!')
        }
      })
      .catch(() => toastr.error('Upload file failed!'))
  }
})

