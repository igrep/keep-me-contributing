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
        cancelAll: function(){}
      }
    }
  }
};
