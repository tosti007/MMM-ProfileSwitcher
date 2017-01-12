/* global Module */

/* Magic Mirror
 * Module: MMM-ProfileSwitcher
 *
 * By Brian Janssen
 * Special thanks to Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register("MMM-ProfileSwitcher", {
    defaults: {
        // The name of the class which should be shown on startup and when there is no current user.
        nobodyClass: "nobody",
        // The name of the class which should be shown for every user.
        everyoneClass: "everyone",
        // Determines if the default class includes the classes that everyone has.
        includeEveryoneToDefault: false,
        // Determines if a leaveMessage should be shown when switching between two custom profiles (excluding nobodyClass).
        alwaysShowLeave: true,
        // The duration (in milliseconds) of the show and hide animation.
        animationDuration: 1000,
        // The module names and classes to ignore when switching user.
        // It's wise to add these two to the ignoreModules array, else you won't be able to view incomming alerts/notifications and updates
        // "alert" can be omitted if you want different users to have different notifications
        ignoreModules: ["alert", "updatenotification"],

        // Determines if the title in the notifications should be present.
        //  If this value is set to a string it will replace the default title.
        title: true,

        // Custom messages for different profiles, for how-to on configuring these see README.md
        enterMessages: {},
        leaveMessages: {}
    },

    // Override the default getTranslations function
    getTranslations: function () {
        return {
            de: "translations/de.json",
            en: "translations/en.json",
            nl: "translations/nl.json"
        };
    },

    // Send a notification depending on the change of user and the config settings
    makeNotification: function (messages) {
        if (messages) {
            var text = messages[this.current_user];

            if (text === undefined) {
                text = messages[this.config.everyoneClass];
            }

            if (text) {
                this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: this.config.title,
                    message: text.replace("%profile%", this.current_user)
                });
            }
        }
    },

    // Return a function that checks if the given module data should be displayed for the current user
    isVisible: function (self, useEveryone, classes) {
        return classes.includes(self.current_user) ||                        // Does this module include the profile?
               self.config.ignoreModules.some((m) => classes.includes(m)) || // Should this module be ignored?
               (useEveryone && classes.includes(self.config.everyoneClass)); // Should everyone see this module?
    },

    // Change the current layout into the new layout given the current user
    set_user: function (useEveryone) {
        var self = this;

        MM.getModules().enumerate(function (module) {
            if (self.isVisible(self, useEveryone, module.data.classes.split(" "))) {
                module.show(self.config.animationDuration, function () {
                    Log.log(module.name + " is shown.");
                });

            } else {
                module.hide(self.config.animationDuration, function () {
                    Log.log(module.name + " is hidden.");
                });
            }
        });
    },

    // Take a different order of actions depening on the new user
    // This way, when we go back to the default user we can show a different notification
    change_user: function (newUser) {
        if (newUser == this.config.nobodyClass) {
            Log.log("Changing to default user profile.");
            
            this.makeNotification(this.config.leaveMessages);
            this.current_user = newUser;
            this.set_user(this.config.includeEveryoneToDefault);

        } else {
            Log.log("Changing to user profile " + newUser + ".");

            if (this.config.alwaysShowLeave && this.current_user !== this.config.nobodyClass)
                this.makeNotification(this.config.leaveMessages);
            
            this.current_user = newUser;
            this.makeNotification(this.config.enterMessages);
            this.set_user(true);
        }
    },

    // Override the default NotificationRecieved function
    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            Log.log("Hiding all non default modules.");
            this.set_user(this.config.includeEveryoneToDefault);
        }

        // No need to change the layout if we are already in this current user
        if (notification === "CURRENT_PROFILE" && payload !== this.current_user) {
            this.change_user(payload);
        }
    },

    // Initiate some of the default config information
    // Do this in start function and not in actual making of the notification.
    // This way we don't have to bother about it in that method and we only have to parse them all once.
    start: function () {
        this.current_user = this.config.nobodyClass;

        if (typeof this.config.ignoreModules === "string") {
            this.config.ignoreModules = this.config.ignoreModules.split(" ");
        }

        // If there is no title set then use the default one
        if (this.config.title && typeof this.config.title !== "string") {
            this.config.title = this.translate("title");
        }

        // Parse the Message data from enter and add everyone if needed
        this.config.enterMessages = this.parseMessages(this.config.enterMessages, this.translate("enter"));

        // Parse the Message data from leave and add everyone if needed
        this.config.leaveMessages = this.parseMessages(this.config.leaveMessages, this.translate("leave"));

        Log.info("Starting module: " + this.name);
    },

    // Given a message conviguration and a translation, parse the configuration and return the new one
    parseMessages: function (data, translated) {
        var result = {};
        
        if (typeof data === "boolean") {
            if (data) {
                result[this.config.everyoneClass] = translated;
            }
            return result;
        }

        // go through all the configuered classes, split them and add each single one to the result
        for (var classes in data) {
            var value = data[classes];

            if (value !== false) {
                if (value === true) {
                    value = translated;
                }

                classes.split(" ").forEach((key) => {
                    result[key] = value;
                });
            }
        }

        // Assign the everyoneClass value.
        result[this.config.everyoneClass] = 
            (  data[this.config.everyoneClass] === undefined
            || data[this.config.everyoneClass] === true)
            ? translated
            : data[this.config.everyoneClass];

        return result;
    }
});
