/* eslint-disable no-magic-numbers */
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
      localStorage.removeItem('accessToken')
      window.location.href = '/login.html'
    }
    return Promise.reject(error)
  }
)
const apiUrl = 'http://192.168.43.211:44396/'

axios({
  method: 'get',
  url: `${apiUrl}/api/Postings`,
  headers: {
    Authorization: `bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then((res) => {
    const me = localStorage.getItem('me') && JSON.parse(localStorage.getItem('me'))
    if (res && res.data) {
      const awardItemClone = $('#postingItem').clone()
      $('.grid-item').remove()
      res.data.forEach((item) => {
        if (me.RoleId === 4 && item.UserId === me.UserId || me.RoleId === 3) {
          const awardItem = awardItemClone.clone()
          awardItem.find('#postingImg').attr('src', `${apiUrl}${item.ImagePath}`)
          awardItem.find('.posting-item').attr('href', `admin/posting-detail.html?id=${item.PostingId}`)
          if (!item.Mark) {
            awardItem.find('#postingPointWrapper').hide()
          } else {
            awardItem.find('#postingPoint').text(`${item.Mark} points`)
          }
          awardItem.find('#postingQuote').text(item.Quote)
          $('#postingList').append(awardItem)
          awardItem.fadeIn()
        }
      })
    }
    const $grid = $('.grid').masonry({
      itemSelector: '.grid-item',
      percentPosition: true,
      columnWidth: '.grid-sizer'
    })
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(() => {
      $grid.masonry()
    })
  })

