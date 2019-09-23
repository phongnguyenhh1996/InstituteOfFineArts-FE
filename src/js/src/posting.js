/* eslint-disable linebreak-style */
import $ from 'jquery'
const $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  percentPosition: true,
  columnWidth: '.grid-sizer'
})
// layout Masonry after each image loads
$grid.imagesLoaded().progress(() => {
  $grid.masonry()
})
