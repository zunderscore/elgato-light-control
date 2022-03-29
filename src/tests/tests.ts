import { ElgatoKeyLightController } from "../ElgatoKeyLightController";
import { ElgatoLightStripController } from "../ElgatoLightStripController";
import { KeyLight } from "../types/KeyLight";
import { LightStrip } from "../types/LightStrip";

const keyLightController = new ElgatoKeyLightController();
const lightStripController = new ElgatoLightStripController();

async function start() {
    keyLightController.on('newKeyLight', (newKeyLight: KeyLight) => {
        console.log('New Key Light: ' + newKeyLight.name);
    });
    
    lightStripController.on('newLightStrip', (newLightStrip: LightStrip) => {
        console.log('New Light Strip: ' + newLightStrip.name);
    });

    setTimeout(() => {
        keyLightController.updateAllLights({
            numberOfLights: 1,
            lights: [{
                on: 1,
                temperature: 145,
                brightness: 15
            }]
        });

        lightStripController.updateAllStrips({
            numberOfLights: 1,
            lights: [{
                on: 1,
                saturation: 0,
                hue: 100,
                brightness: 100
            }]
        });
    }, 1000 * 3);
}

start();