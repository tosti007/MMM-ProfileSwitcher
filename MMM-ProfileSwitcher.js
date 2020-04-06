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
        // The name of the class which should be shown on startup and when there is no current profile.
        defaultClass: "default",
        // The name of the class which should be shown for every profile.
        everyoneClass: "everyone",
        // Determines if the default class includes the classes that everyone has.
        includeEveryoneToDefault: false,
        // Determines if a leaveMessage should be shown when switching between two custom profiles (excluding defaultClass).
        alwaysShowLeave: true,
        // The duration (in milliseconds) of the show and hide animation.
        animationDuration: 1000,
        // The module names and classes to ignore when switching profile.
        // It's wise to add these two to the ignoreModules array, else you won't be able to view incomming alerts/notifications and updates
        // "alert" can be omitted if you want different profiles to have different notifications
        ignoreModules: ["alert", "updatenotification"],

        // Determines if the title in the notifications should be present.
        //  If this value is set to a string it will replace the default title.
        title: true,

        // Custom messages for different profiles.
        // Check README.md for configuration
        enterMessages: {},
        leaveMessages: {},

        // Determines if the messages for everyone should also be set for profiles that have custome messages.
        includeEveryoneMessages: false,

        // use lock strings by default
        useLockStrings: true,

        // The default time when none is set for a profile in timers
        defaultTime: 60000,
        // Timers for different profiles. A timer lets you automatically swap to a different profile after a certain amount of time. 
        // Check README.md for configuration
        timers: undefined
    },

    // Override the default getTranslations function
    getTranslations: function () {
        return {
            en: "translations/en.json",
            es: "translations/es.json",
            de: "translations/de.json",
            sv: "translations/sv.json",
            fr: "translations/fr.json",
            nl: "translations/nl.json"
        };
    },

    // Show a random notification depending on the change of profile and the config settings
    makeNotification: function (messages) {
        if (messages) {
            var text = messages[this.current_profile];

            if (text === undefined) {
                text = messages[this.config.everyoneClass];

            } else if (this.config.includeEveryoneMessages) {
                text = messages[this.config.everyoneClass].concat(text);
            }

            if (text.length > 0) {
                // if there are more than one options then take a random one
                text = (text.length === 1)
                    ? text[0]
                    : text[Math.floor(Math.random() * text.length)];

                this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: this.config.title,
                    message: text.replace("%profile%", this.current_profile)
                });
            }
        }
    },

    // Return a function that checks if the given module data should be displayed for the current profile
    isVisible: function (self, useEveryone, classes) {
        return classes.indexOf(self.current_profile) !== -1 ||                     // Does this module include the profile?
               (useEveryone && classes.indexOf(self.config.everyoneClass) !== -1); // Should everyone see this module?
    },

    // Change the current layout into the new layout given the current profile
    set_profile: function (useEveryone) {
        var self = this;

        options = {};
        if (self.config.useLockStrings) {
            options.lockString = self.identifier;
        }

        var modules = MM.getModules().exceptWithClass(self.config.ignoreModules);
        modules.enumerate(function (module) {
            if (self.isVisible(self, useEveryone, module.data.classes.split(" "))) {
                module.show(self.config.animationDuration, function () {
                    Log.log(module.name + " is shown.");
                }, options);

            } else {
                module.hide(self.config.animationDuration, function () {
                    Log.log(module.name + " is hidden.");
                }, options);
            }
        });

        if (this.config.timers && this.config.timers[this.current_profile]){
            this.set_timer(this.config.timers[this.current_profile]);
        }

    },

    // Clear the current timer and set a new one with the new profile.
    set_timer: function (data) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.change_profile.bind(this), 
            data.time    || this.config.defaultTime, 
            data.profile || this.config.defaultClass);
    },

    // Take a different order of actions depening on the new profile
    // This way, when we go back to the default profile we can show a different notification
    change_profile: function (newProfile) {
        // No need to change the layout if we are already in this current profile
        if (newProfile !== this.current_profile) {
            this.sendNotification("CHANGED_PROFILE", {from: this.current_profile, to: newProfile});

            if (newProfile == this.config.defaultClass) {
                Log.log("Changing to default profile.");

                this.makeNotification(this.config.leaveMessages);
                this.current_profile = newProfile;
                this.set_profile(this.config.includeEveryoneToDefault);

            } else {
                Log.log("Changing to profile " + newProfile + ".");

                if (this.config.alwaysShowLeave && this.current_profile !== this.config.defaultClass) {
                    this.makeNotification(this.config.leaveMessages);
                }

                this.current_profile = newProfile;
                this.makeNotification(this.config.enterMessages);
                this.set_profile(true);
            }
        }
    },

    // Override the default NotificationRecieved function
    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            Log.log("Hiding all non default modules.");
            this.set_profile(this.config.includeEveryoneToDefault);
            this.sendNotification("CHANGED_PROFILE", {to: this.config.defaultClass});
        } else if (notification === "CURRENT_PROFILE") {
            this.change_profile(payload);
        } else if (notification === "DISABLE_PROFILE_TIMERS"){
            clearTimeout(this.timer);
        } else if (notification === "ENABLE_PROFILE_TIMERS"){
            if (this.config.timers && this.config.timers[this.current_profile]){
                this.set_timer(this.config.timers[this.current_profile]);
            }
        }
    },

    // Initiate some of the default config information
    // Do this in start function and not in actual making of the notification.
    // This way we don't have to bother about it in that method and we only have to parse them all once.
    start: function () {
        this.timer = null;
        this.current_profile = this.config.defaultClass;

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

    // Given a message configuration and a translation, parse the configuration and return the new one
    parseMessages: function (data, translated) {
        var result = {};

        if (typeof data === "boolean") {
            if (data) {
                result[this.config.everyoneClass] = [translated];
                return result;
            }
            
            return false;
        }

        // go through all the configuered classes, split them and add each single one to the result
        for (var classes in data) {
            var value = data[classes];

            if (value !== false) {
                if (typeof value !== "object") {
                    value = [value];
                }

                value = value.map(function (x) {
                    return x === true ? translated : x;
                });

                classes.split(" ").forEach(function (key) {
                    if (result[key] === undefined) {
                        result[key] = [];
                    }

                    result[key] = result[key].concat(value);
                });
            }

        }

        // Assign the everyoneClass value if this hasn't been done yet.
        if (data[this.config.everyoneClass] === undefined || data[this.config.everyoneClass] === true) {
            result[this.config.everyoneClass] = [translated];
        }

        return result;
    }
});
