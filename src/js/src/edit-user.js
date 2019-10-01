/* eslint-disable linebreak-style */
import $ from 'jquery'
import axios from 'axios'
const UNAUTHORIZED = 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const {
      status
    } = error.response
    if (status === UNAUTHORIZED) {
      window.location.href = '/login.html'
    }
    return Promise.reject(error)
  }
)
const apiUrl = 'http://192.168.43.211:44396/'
// init datepicker
$('[data-toggle="datepicker"]').datepicker()
// fetch user
const urlString = window.location.href
const url = new URL(urlString)
const id = url.searchParams.get('id')

axios({
  method: 'get',
  url: `${apiUrl}api/Users/${id}`,
  headers: {
    Authorization: `bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then((res) => {
    if (res && res.data) {
      Object.keys(res.data).forEach((key) => {
        $(`.form-control[name='${key}']`).val(res.data[key])
      })
    }
  })
$('#editUser').on('submit', (e) => {
  e.preventDefault()
  const formInput = $('#editUser').find('.form-control')
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
    axios({
      method: 'put',
      url: `${apiUrl}api/Users/${id}`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`
      },
      data
    })
      .then((res) => {
        if (res) {
          window.location.href = 'admin/user-list.html'
        }
      })
  }
})

