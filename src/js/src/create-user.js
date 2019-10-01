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
// create user
$('#createUser').on('submit', (e) => {
  e.preventDefault()
  const formInput = $('#createUser').find('.form-control')
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
      method: 'post',
      url: `${apiUrl}/api/Users`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`
      },
      data
    })
      .then((res) => {
        if (res && res.data) {
          window.location.href = 'admin/user-list.html'
        }
      })
  }
})
