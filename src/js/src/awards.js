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
// fetch award list
fetchAwardList()
// create award
$('#addAward').click(() => {
  const formInput = $('.form-control')
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
      url: `${apiUrl}/api/Awards`,
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`
      },
      data
    })
      .then((res) => {
        if (res && res.data) {
          $('#exampleModal').modal('hide')
          // fetch award list
          fetchAwardList()
        }
      })
  }
})
// get award function
function fetchAwardList() {
  axios({
    method: 'get',
    url: `${apiUrl}/api/Awards`,
    headers: {
      Authorization: `bearer ${localStorage.getItem('accessToken')}`
    }
  })
    .then((res) => {
      if (res && res.data) {
        const awardItemClone = $('#awardItem').clone()
        $('#awardList').empty()
        res.data.forEach((item) => {
          const awardItem = awardItemClone.clone()
          Object.keys(item).forEach((key) => {
            awardItem.find(`[name='${key}']`).text(item[key])
          })
          $('#awardList').append(awardItem)
          awardItem.fadeIn()
        })
      }
    })
}

