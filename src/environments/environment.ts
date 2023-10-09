// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { host } from "./host";

export const environment = {
  production: false,
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
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.