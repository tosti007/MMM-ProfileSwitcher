<!-- All the links I use multiple times in this readme file, this way I won't have to copy paste so often -->
[MMM-Facial-Recognition]: https://github.com/paviro/MMM-Facial-Recognition
[MMM-ProfileSwitcher]: https://github.com/tosti007/MMM-ProfileSwitcher

# MMM-ProfileSwitcher

This an extension for the [MagicMirror²](https://magicmirror.builders/).
This Module adds the ability to have different layouts for different profiles.

Special thanks goes to [Paviro](https://github.com/paviro) for giving input, working together and because this module's classes idea is based on his [MMM-Facial-Recognition] module's classes idea.

## Unmaintained

I am not currently active anymore in the MagicMirror community, as I am busy with study and life, hence this project is unmaintained. That means I mostly won't creating new features or be replying to questions in-depth on this module, as I don´t really know how the framework works anymore. 

However this module does work as described here so feel free to use it! If you're having problems with the module feel free to ask in an issue, but I will most likely have no answer (but maybe someone does). I will respond to pull requests, so if you have an issue feel free to fix it yourself and shoot me a pull request!

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/tosti007/MMM-ProfileSwitcher.git
````

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-ProfileSwitcher',
        config: {
            // See 'Configuration options' for more information.
        }
    }
]
````

For this module to have an effect you have to assign custom classes to your modules. The class `default` (if you don't change it) is shown on startup or when switched to. The class `everyone` (if you don't change it) is shown for all profiles, except for the `default` profile (can be configured). To specify if a module should be for a certain profile add this profile to the classes data. For multiple profiles separate the names with a space. **Note:** the class names are case sensitive.

This can be done like so:
````javascript
{
    module: 'example_module',
    // Set your classes here separated by a space.
    // Shown for all profiles and for the default profile
    classes: 'default everyone'
},
{
    module: 'example_module2',
    // Only shown for me
    classes: 'Brian'
}
````

## Configuration options

The following properties can be configured:

| Option                     | Description
| -------------------------- | -----------
| `defaultClass`             | The name of the class which should be shown on startup and when there is no current profile. <br><br> **Possible values:** `string` <br> **Default value:** `"default"`
| `everyoneClass`            | The name of the class which should be shown for every profile. <br><br> **Possible values:** `string` <br> **Default value:** `"everyone"`
| `includeEveryoneToDefault` | Determines if the default class includes the classes that everyone has. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false`
| `alwaysShowLeave`          | Determines if a leaveMessage should be shown when switching between two custom profiles (excluding defaultClass). <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false`
| `animationDuration`        | The duration (in milliseconds) of the show and hide animation. <br><br> **Possible values:** `int` <br> **Default value:** `1000`
| `ignoreModules`            | The module names and classes to ignore when switching profiles. Can be one string with multiple classes splitted with spaces or a string array.<br><br> **Note:** It's wise to add the two default values to the ignoreModules array, else you won't be able to view incomming alerts/notifications and updates. `alert` can be omitted if you want different profiles to have different notifications. <br> **Possible values:** `string` or `string array` <br> **Default value:** `["alert", "updatenotification"]`
| `title`                    | Determines if the title in the notifications should be present. If this value is set to a string it will replace the default title.<br><br> **Possible values:** `true`, `false` or `string` <br> **Default value:** `true`
| `enterMessages`            | The notification message that will be shown when we switch to a different profile. See [Configuring Profile Messages](#configuring-profile-messages) for more information. <br><br> **Possible values:** `Object with profiles` or `false` <br> **Default value:** `{}`
| `leaveMessages`            | The notification message that will be shown when we switch to the `defaultClass`. See [Configuring Profile Messages](#configuring-profile-messages) for more information. <br><br> **Possible values:** `Object with profiles` or `false` <br> **Default value:** `{}`
| `includeEveryoneMessages`  | Determines if the messages for everyone should also be added to the possible messages for profiles that have custome messages. <br><br> **Possible values:** `true` or `false` <br> **Default value:** `false`
| `useLockStrings` | Determines whether or not to use [*lockStrings*](https://github.com/MichMich/MagicMirror/tree/master/modules#thishidespeed-callback-options). <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`.
| `defaultTime`              | The default time (in microseconds) when none is set for a profile in `timers`. <br><br> **Possible values:** `number` <br> **Default value:** `60000` (`60` seconds)
| `timers`                   | Timers for different profiles. A timer lets you automatically swap to a different profile after a certain amount of time.  See [Configuring Timers](#configuring-timers) for more information. <br><br> **Possible values:** `Object with timers` or `undefined` <br> **Default value:** `undefined`


## Configuring Profile Messages
We can set a custom messages for each of the profiles in a number of ways. If multiple messages are set for one single profile then a random.
You can change them by setting a value for the `enterMessages` or `leaveMessages` config. In these custom messages the substring `%profile%` will be replaced with the current profile.

The enter messages will be shown upon changing to a different profile. This can either be from `defaultClass` or from a custom profile.
The leave message will be shown when we change profile to the `defaultClass` or a custom profile if `alwaysShowLeave` is `true`. Here `%profile%` will be the profile that is leaving.

**Note:** in these example I always assumed that `includeEveryoneMessages` was `false`.

#### Disabling Messages
Set the value to `false` for the profiles you don't want to have a message.
In order to disable a leave or enter message entirely you can, instead of using a dictionary, set this value to false. Example:
````javascript
config: {
    // Disable the enter messages for me, but not the others
    enterMessages: {
        "Brian": false
    }
    // Disable the leave messages entirely
    leaveMessages: false
}
````

#### Setting Message For A Single Profile
Setting custom messages for a single profile can be done by using a `string` or an `array of string` as value.
If there are multiple options, a random message will be chosen.
````javascript
config: {
    enterMessages: {
        // I will have only one message.
        "Brian": "You again?!?!",
        // Kevin has two portions
        "Kevin": ["Oh hello.", "Hey how is it going?"]
    }
}
````

#### Changing Messages For Multiple profiles
Setting or disabling the message for multiple profiles can be done in the same way with the profile names separated with a space. Example:
````javascript
config: {
    // Customize the enter messages for me and Kevin
    // %profile% will be replaced with the correct name
    enterMessages: {
        "Brian Kevin": "What's up %profile%?", // We both have this message
        "Brian": ["Yo!", "Hey!"], // I have two additional messages
        "Kevin": "Having a nice day?" // Kevin has one additional message
    }
}
````

#### Changing Messages For Everyone
To change the message for everyone you will have to do the same thing, but as key use the value of `everyoneClass`. To use the default message for a single or multiple profiles, set the value to `true`. **Note:** Using `true` for everyone is the same as not assigning it. Example:

````javascript
config: {
    everyoneClass: "everyone" //same as default, for illustration only
    // Disable the enter messages for everyone but me and Kevin
    enterMessages: {
        "Brian": true, // I have the default message
        "Kevin": "Hello :D", // Kevin has a custom message
        "everyone": false
    },
    // Everyone has a custom message
    leaveMessages: {
        // %profile% will be replaced with the correct name
        "everyone": "Hey %person%, already leaving?",
        // I have a custom and the default message
        //  this is not the same as everyone since we changed it
        "Brian": ["Bye bye!", true]
    }
}
````

## Configuring Timers
A timer is for switching to a different profile after a certain profile has been selected. Each timer is an object/dictionairy and must have the profile name and has an optional profile name to switch to and an optional time.
If no profile to switch to is set the timer will use `defaultClass`. If no time is set then it will use `defaultTime`. A few examples:
````javascript
timers: {
    // when Brian is selected swap to the defaultClass after the defaultTime
    "Brian": {},

    // When Lisa is selected swap to Brian after 20 seconds
    "Lisa": {
        profile: "Brian",
        time: 20 * 1000
    },

    // When Kevin is selected swap to the defaultClass after the 5 seconds
    "Kevin": {
        time: 5 * 1000
    },

    // When default is selected swap to Lisa after the defaultTime
    "default": {
        profile: "Lisa"
    }
}
````
**Note:** this example will create a loop (default-Lisa-Brian).

## Switching Profiles
Switching Profiles can be done by sending a notification with the payload being the desired profile.
Like so (replace `'DESIRED_PROFILE_NAME_HERE'` with your profile name):
````javascript
this.sendNotification('CURRENT_PROFILE', 'DESIRED_PROFILE_NAME_HERE');
````

## Using With Other Modules
Since this module uses notifications, as described in [Switching profiles](#switching-profiles), it can easily be used in conjunction with other modules.

### [MMM-ModuleScheduler](https://github.com/ianperrin/MMM-ModuleScheduler/) by Ian Perrin
You can switch to a profile on a certain given time by scheduling a notification in the MMM-ModulesScheduler's config. For example like so:
````javascript
{
    module: 'MMM-ModuleScheduler',
    config: {
        notification_schedule: [
            // SWITCH TO THE DAY PROFILE AT 07:30 EVERY DAY
            {notification: 'CURRENT_PROFILE', schedule: '30 7 * * *', payload: 'Day'},
            // SWITCH TO THE NIGHT PROFILE AT 23:30 EVERY DAY
            {notification: 'CURRENT_PROFILE', schedule: '30 23 * * *', payload: 'Night'},
        ]
    }
},
````
**Note:** If you have `useLockStrings` on `true` and you want to unhide a module you will have to force it.

### [MMM-Facial-Recognition] by Paviro
**Note:** Paviro and I made some changes to use these two modules together more convenient. Once we are sure it fully works I will update this guide.

Using the [MMM-Facial-Recognition] module and [MMM-ProfileSwitcher] together does not work straight out of the box.
In order for [MMM-Facial-Recognition] to use the [MMM-ProfileSwitcher] module we will have to change a few lines of the code in the [MMM-Facial-Recognition] module's javascript file.
This file can be found in (after installing his module):
````
~/MagicMirror/modules/MMM-Facial-Recognition
````
Here we will have to remove the lines. Since his translations are not being used anymore we can also delete these lines (the `getTranslations` function).
Since we will be removing all his code inside the `notificationReceived` function, we might remove that one as well.

The lines are (all inclusive):
````
34-37, 53-65, 69-81, 100-103, 110-119 and 39-50 (translations)
````
If you removed the getTranslations method as mentioned above you can also safely delete the translation folder.
````
~/MagicMirror/modules/MMM-Facial-Recognition/translations
````
Lastly you will have to edit two of his calls to the `sendNotification` function on lines `65` and `81`. We will have to change `CURRENT_USER` into `CURRENT_PROFILE` and `"None"` into the `defaultClass`, which has to have the same value as the profile switcher module's `defaultClass`.
At the end the logout and login functions should look like this:
````javascript
// Code from paviro's MMM-Facial-Recognition
login_user: function () {
    this.sendNotification("CURRENT_PROFILE", this.current_user);
},
logout_user: function () {
    this.sendNotification("CURRENT_PROFILE", this.config.defaultClass);
},
````
And then you should be done!

### [MagicMirror-LocalTransport-Module](https://github.com/CFenner/MagicMirror-LocalTransport-Module) by CFenner
The [MagicMirror-LocalTransport-Module](https://github.com/CFenner/MagicMirror-LocalTransport-Module) module does not work (without a fix) with the [MMM-ProfileSwitcher].
This due to his code overwriting a variable that it a default variable used by the [MagicMirror Framework](https://github.com/MichMich/MagicMirror) and my code need this. Luckily this problem can be solved fairly easily with any text editor.

Go to the module's main file `localtransport.js` and replace the occurences of `this.data` with `this.info`.

**Note:** There should be three occurences on lines `170`, `204` and `209`.

**Side note:** I have send him a pull request with this fix as well so hopefully this will be solved in the future.

## Current Supported Languages
* English
* German
* Dutch
* Swedish (thanks to Snille)
* Spanish (thanks to roramirez)

## Notes
* Using [MagicMirror-LocalTransport-Module](https://github.com/CFenner/MagicMirror-LocalTransport-Module) by CFenner results in this module to break. See [Using With Other Modules](#magicmirror-localtransport-module-by-cfenner) for a fix.
* All the profile names are case sensitive.
* Multiple messages for a single profile will result in a randomly chosen message.
* If no class is set then it will never show, unless it is added to the `ignoreModules` array.
* It's wise to add `alert` and `updatenotification` to the `ignoreModules` array.
* Using `true` for everyone is the same as not assigning it.
* If you have `useLockStrings` set to `true` and you want to unhide a certain module you will have to force it.

## Notes For Other Developers
* A `CHANGED_PROFILE` notifcation will be send after the `current_user` was modified.
* The timers can be disabled/enabled by sending an `DISABLE_PROFILE_TIMERS` / `ENABLE_PROFILE_TIMERS` notifcation with an empty payload.


## The MIT License (MIT)

Copyright (c) 2017 Brian Janssen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**
