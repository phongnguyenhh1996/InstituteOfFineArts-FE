/* eslint-disable linebreak-style */
import $ from 'jquery'
import axios from 'axios'
import toastr from 'toastr'
let currentPosting = {}
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

fetchPosting()


function fetchPosting() {
  axios({
    method: 'get',
    url: `${apiUrl}api/Postings/${id}`,
    headers: {
      Authorization: `bearer ${localStorage.getItem('accessToken')}`
    }
  })
    .then((res) => {
      console.log(res)

      if (res && res.data) {
        currentPosting = res.data
        $('#postingImg').attr('src', `${apiUrl}${res.data.ImagePath}`)
        if (!res.data.Mark) {
          $('#postingMarkWrapper').hide()
        } else {
          $('#postingMarkWrapper').show()
          $('#postingMark').text(res.data.Mark)
        }
      }
    })
}

$('#addMark').click(() => {
  axios({
    method: 'put',
    url: `${apiUrl}api/Postings/${id}`,
    headers: {
      Authorization: `bearer ${localStorage.getItem('accessToken')}`
    },
    data: {
      ...currentPosting,
      Mark: $('#name').val()
    }
  })
    .then(() => {
      $('#exampleModal').modal('hide')
      fetchPosting()
    })
    .catch(() => toastr.error('Add mark failed!'))
})
