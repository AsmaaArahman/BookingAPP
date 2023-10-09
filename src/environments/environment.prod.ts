import { host } from "./host";

export const environment = {
  production: true,
  host,
  api: {
    form: {
      post() {
        get: {
          return `${host}api/projects`
        }
      },
      getAll() {
        get: {
          return `${host}api/projects`
        }
      },
      getOne(id) {
        get: {
          return `${host}api/projects/${id}`
        }
      },
      update(id) {
        get: {
          return `${host}api/projects/update/${id}`
        }
      },
      delete(id) {
        get: {
          return `${host}api/projects/${id}`
        }
      },
      images:{
        post() {
          get: {
            return `${host}api/upload/images`
          }
        },
        delete(id) {
          get: {
            return `${host}api/upload/images/${id}`
          }
        },
        dist(uri) {
          get: {
            return `${host}uploads/${uri}`
          }
        },
      }
    }
  }
};