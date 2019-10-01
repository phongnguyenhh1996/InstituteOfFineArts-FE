import $ from 'jquery'
import axios from 'axios'
import moment from 'moment'
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
      $('.compertitionName').text(data.CompetitionName)
      $('#compertitionTime').text(`${moment(data.StartDate).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(data.EndDate).format('MMMM Do YYYY, h:mm:ss a')}`)
      $('#compertitionAward').text(data.AwardDetail)
      $('#daysLeft').text(`${moment(data.EndDate).diff(moment(), 'days')} DAYS LEFT`)
      if (data.isUserHavePosting) {
        $('#createPosting').text('See your posting')
        $('#createPosting').attr('href', `admin/posting-detail.html?id=${data.PostingId}`)
      } else {
        $('#createPosting').attr('href', `admin/create-posting.html?id=${data.CompetitionId}`)
      }
    }
  })
