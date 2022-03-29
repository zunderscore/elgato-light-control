# @zunderscore/elgato-light-control
Javascript wrapper for Elgato Key Lights and Light Strip control

Based on **elgato-light-api** by NickParks ([https://github.com/NickParks/elgato-light-api])

## Installation

Running `npm i @zunderscore/elgato-light-control` will install the package. Typescript is natively supported.

## How to use

Create a new instance of `ElgatoKeyLightController` or `ElgatoLightStripController`, depending on what you want to control:

```Javascript
const keyLightController = new ElgatoKeyLightController();
const lightStripController = new ElgatoLightStripController();
```

An Event Emitter is used to notify listeners when a new Key Light or Light Strip is detected.

```Javascript
keyLightController.on('newKeyLight', (newKeyLight: KeyLight) => {
    console.log('New Key Light: ' + newKeyLight.name);
});

lightStripController.on('newLightStrip', (newLightStrip: LightStrip) => {
    console.log('New Light Strip: ' + newLightStrip.name);
});
```

`ElgatoKeyLightController` has two main functions (`updateLightOptions` and `updateAllLights`) and an Array of all discovered Key Lights (`keyLights`).

```Javascript
keyLightController.updateLightOptions(keyLightController.keyLights[0], options).then(() => {
    console.log("Key Light has been updated!");
}).catch(e => {
    console.error("Error: ", e);
});

keyLightController.updateAllLights(options).then(() => {
    console.log("All Key Lights have been updated!");
}).catch(e => {
    console.error("Error: ", e);
});
```

Similarly, `ElgatoLightStripController` also has two main functions (`updateLightOptions` and `updateAllStrips`) and an Array of all discovered Light Strips (`lightStrips`)

```Javascript
lightStripController.updateLightOptions(lightStripController.lightStrips[0], options).then(() => {
    console.log("Light Strip has been updated!");
}).catch(e => {
    console.error("Error: ", e);
});

lightStripController.updateAllStrips(options).then(() => {
    console.log("All Light Strips have been updated!");
}).catch(e => {
    console.error("Error: ", e);
});
```