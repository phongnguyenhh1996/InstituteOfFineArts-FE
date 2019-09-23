const urlString = window.location.href
const url = new URL(urlString)
const id = url.searchParams.get('id')
console.log(id)
