import axios from 'axios'

// const url =    'http://192.168.18.60:8080';
const url = 'https://app-b326dc32-0db8-407f-808e-7a0340bea49c.cleverapps.io'

const api = axios.create({
    baseURL: url+"/api"
})

export {api, url}