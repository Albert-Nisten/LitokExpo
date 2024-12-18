import axios from 'axios'

const url =    'http://192.168.18.60:8080';
// const url = 'https://app-b326dc32-0db8-407f-808e-7a0340bea49c.cleverapps.io'

const faq_quetion = "https://albert-nisten.github.io/LitokPolicy/faq_quetion.html"

const policy_privacy = "https://albert-nisten.github.io/LitokPolicy/privacy_policy.html"

const about = "https://albert-nisten.github.io/LitokPolicy/about.html"

const api = axios.create({
    baseURL: url+"/api"
})

export {api, url, faq_quetion, policy_privacy, about}