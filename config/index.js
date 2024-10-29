import axios from 'axios'

const url =    'http://172.20.10.13:8080';
// const url = 'http://192.168.18.18:8080'

const api = axios.create({
    baseURL: url+"/api"
})

export {api, url}