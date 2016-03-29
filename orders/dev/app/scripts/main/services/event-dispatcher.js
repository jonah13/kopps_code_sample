(function() {
    'use strict';

    /**
     * Main EventDispatcher service that is used to broadcast events and subscribe
     * to them.
     */
    angular
        .module('main.module')
        .factory('EventDispatcher', EventDispatcher);


        function EventDispatcher() {

            /**
             * The listeners who are listening to events.
             *
             * @type {{name: String, callback: Function}[]}
             */
            var registeredListeners = [];

            /**
             * Removes all given listeners from the array.
             */
            var removeListeners = function(listeners) {
                angular.forEach(listeners, function(listener) {
                    var index = registeredListeners.indexOf(listener);
                    if (index !== -1)
                        registeredListeners.splice(index, 1);
                });
            };

            return {

                /**
                 * Adds a subscriber to listen to the given event.
                 *
                 * @param {String} eventName Name of the event to listen to
                 * @param {Function} callback Callback that will be called when event dispatched
                 * @returns {Function} Returns given callback. Can be used to unregister callback from the event subsriber later
                 */
                on: function(eventName, callback) {
                    if (!eventName)
                        throw 'Event name must not be an empty string';
                    if (!_.isFunction(callback))
                        throw 'Given callback must be a function';

                    registeredListeners.push({ name: eventName, callback: callback });
                },

                /**
                 * Adds a subscriber to listen to the given event. Listener must be in some scope, and when scope is
                 * destroyed then listener also will be removed.
                 *
                 * @param {Scope} [scope] If scope if specified then given callback will be unregistered when scope is destroyed
                 * @param {String} eventName Name of the event to listen to
                 * @param {Function} callback Callback that will be called when event dispatched
                 * @returns {Function} Returns given callback. Can be used to unregister callback from the event subsriber later
                 */
                onScope: function(scope, eventName, callback) {
                    this.on(eventName, callback);

                    if (scope) {
                        var that = this;
                        scope.$on('$destroy', function() {
                            that.unsubscribe(eventName, callback);
                        });
                    }
                },

                /**
                 * Unsubsribes a listener that matches given event name and callback.
                 *
                 * @param {string} eventName
                 * @param {Function} callback
                 */
                unsubscribe: function(eventName, callback) {
                    removeListeners(_.where(registeredListeners, {name: eventName, callback: callback}));
                },

                /**
                 * Unsubsribes all listeners that are attached to a specific event.
                 *
                 * @param {string} eventName
                 */
                unsubscribeAll: function(eventName) {
                    removeListeners(_.where(registeredListeners, {name: eventName}));
                },

                /**
                 * Dispatches an event.
                 *
                 * @param {String} eventName Event name that will be dispatched
                 * @param {object} [data] The data that will be send to the listeners
                 * @returns {int} Returns number of listeners that were dispatched
                 */
                dispatch: function(eventName, data) {
                    if (!eventName)
                        throw 'Event name is not specified';

                    var whoListens = _.where(registeredListeners, { name: eventName });
                    _.each(whoListens, function(listener) {
                        listener.callback({ name: eventName }, data);
                    });

                    return whoListens.length;
                },

                /**
                 * Dispatches an event when given promise is resolving / rejecting / notifying.
                 *
                 * @param {promise} promise
                 * @param {String} resolveEventName
                 * @param {String} [rejectEventName]
                 * @param {String} [notifyEventName]
                 * @returns {promise} Returns instance with the promise that was send to this object
                 */
                dispatchByPromise: function(promise, resolveEventName, rejectEventName, notifyEventName) {

                    var eventDispatcher = this;

                    promise.then(function(result) {
                        if (resolveEventName)
                            eventDispatcher.dispatch(resolveEventName, result);

                    }, function(result) {
                        if (rejectEventName)
                            eventDispatcher.dispatch(rejectEventName, result);

                    }, function(result) {
                        if (notifyEventName)
                            eventDispatcher.dispatch(notifyEventName, result);

                    });

                    return promise;
                }
            };
        }

})();