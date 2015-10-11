/**
 * @struct
 * @type {{plugins: {notification: {local: ?}}}}
 */
var cordova = {
  plugins: {
    notification: {
      local: {
        /** @param {function(boolean)} callback */
        registerPermission: function(callback){},
        /** @param {Array<{id: number, title: string, text: string, every: string, at: Date, icon: string}>} schedules */
        schedule: function(schedules){},
        /**
         * @param {{id: number, text: string, icon: string}} schedule
         * NOTE: The listed properties are only ones I need
         */
        update: function(schedule){},
        /** @param {function()} callback*/
        cancelAll: function(callback){},
        /**
         * @param {string} eventName
         * @param {function({id: number})} callback
         * The only documented property is id at
         * https://github.com/katzer/cordova-plugin-local-notifications/wiki/11.-Samples
         */
        on: function(eventName, callback){}
      }
    }
  }
};
