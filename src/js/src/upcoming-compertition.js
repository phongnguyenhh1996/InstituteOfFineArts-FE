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
// fetch compertitions list
fetchCompertitions()
// get compertitions function
function fetchCompertitions() {
  axios({
    method: 'get',
    url: `${apiUrl}/api/Competitions`,
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
          awardItem.attr('href', `admin/compertition-detail.html?id=${item.CompetitionId}`)
          Object.keys(item).forEach((key) => {
            awardItem.find(`[name='${key}']`).text(item[key])
          })
          $('#awardList').append(awardItem)
          awardItem.fadeIn()
        })
      }
    })
}

