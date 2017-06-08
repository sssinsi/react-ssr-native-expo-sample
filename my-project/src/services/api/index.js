// https://github.com/diegohaz/arc/wiki/API-service
import 'isomorphic-fetch'
import { stringify } from 'query-string'
import merge from 'lodash/merge'
import { apiUrl,apiBasicAuthName,apiBasicAuthPass } from '../../config'
import {snakeCase } from 'change-case'
import camelize from 'camelize'

const toSnake = (x) =>{
  return Object
  .entries(x)
  .reduce(
    (prev, [key, value]) => ({
      ...prev,
      [snakeCase(key)]: value
    }),
    {}
  )
}

const getRequestConfig = ({ accessToken }) => {
  const SESSION_NAME = 'XXX_SESSION'
  
  return __SERVER__
    ? {
      headers: {
        Cookie: `${SESSION_NAME}=${accessToken}`
      }
    }
    : null
}

export const checkStatus = (response) => {
  if (response.ok) {
    return response
  }
  const error = new Error(`${response.status} ${response.statusText}`)
  error.response = response
  throw error
}

export const parseJSON = response => response.json()

export const parseSettings = ({ method = 'get', data, locale, ...otherSettings } = {}) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  }
  const settings = merge({
    body: data ? JSON.stringify(data) : undefined,
    method,
    headers,
  }, otherSettings)
  return settings
}

export const parseEndpoint = (endpoint, params) => {
  const url = endpoint.indexOf('http') === 0 ? endpoint : apiUrl + endpoint
  const querystring = params ? `?${stringify(params)}` : ''
  return `${url}${querystring}`
}

const api = {}

api.request = (endpoint, { params, ...settings } = {}) =>
  fetch(parseEndpoint(endpoint, params), parseSettings(settings))
    .then(checkStatus)
    .then(parseJSON)

;['delete', 'get'].forEach((method) => {
  api[method] = (endpoint, settings) => api.request(endpoint, { method, ...settings })
})

;['post', 'put', 'patch'].forEach((method) => {
  api[method] = (endpoint, data, settings) => api.request(endpoint, { method, data, ...settings })
})

api.create = (settings = {}) => ({
  settings,

  setToken(token) {
    this.settings.headers = {
      ...this.settings.headers,
      Authorization: `Bearer ${token}`,
    }
  },

  unsetToken() {
    this.settings.headers = {
      ...this.settings.headers,
      Authorization: undefined,
    }
  },

  request(endpoint, settings) {
    return api.request(`${apiUrl}${endpoint}`, merge({}, this.settings, settings))
  },

  post(endpoint, data, settings) {
    return this.request(`${apiUrl}${endpoint}`, { method: 'post', data, ...settings })
  },

  get(endpoint, settings) {
    return this.request(`${apiUrl}${endpoint}`, { method: 'get', ...settings })
  },

  put(endpoint, data, settings) {
    return this.request(`${apiUrl}${endpoint}`, { method: 'put', data, ...settings })
  },

  patch(endpoint, data, settings) {
    return this.request(`${apiUrl}${endpoint}`, { method: 'patch', data, ...settings })
  },

  delete(endpoint, settings) {
    return this.request(`${apiUrl}${endpoint}`, { method: 'delete', ...settings })
  },
  
  pingSession(){
    return this.get('/session/ping')
  },

  singUp({email, ...payload}){
    return this.post('/users/add',{...payload, email})
  },

  authSignup(token){
    return this.get(`/users/mail_auth/${token}`)
  },

  login({email, password}){
    return this.post('/users/login', { email,password })
  },

  logout(){
    return this.get('/users/logout')
  },

  getMe(options){
    return this.get('/me',getRequestConfig(options)).then(res => camelize(res))
  }
})

export default api
