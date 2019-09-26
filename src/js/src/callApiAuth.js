import axios from 'axios'

export default function callApiAuth() {
  return axios.create({
    headers: {
      Authorization: `bearer ${localStorage.getItem('accessToken').access_token}`
    }
  })
}
