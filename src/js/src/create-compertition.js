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
// fetch award list
axios({
  method: 'get',
  url: `${apiUrl}/api/Awards`,
  headers: {
    Authorization: `bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then((res) => {
    if (res && res.data) {
      res.data.forEach((item) => {
        const awardItem = $('<option></option>')
        awardItem.text(item.AwardName)
        awardItem.attr('value', item.AwardId)
        $('#AwardId').append(awardItem)
      })
    }
  })
// create user
$('#createCompertition').on('submit', (e) => {
  e.preventDefault()
  const formInput = $('#createCompertition').find('.form-control')
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
      url: `${apiUrl}/api/Competitions`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`
      },
      data
    })
      .then(() => {
        window.location.href = '/admin/upcoming-compertition.html'
      })
  }
})
