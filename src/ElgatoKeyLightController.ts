import { Bonjour } from "bonjour-service";
import { EventEmitter } from "events";
import { KeyLight, KeyLightOptions } from "./types/KeyLight";

const axios = require('axios').default;

export class ElgatoKeyLightController extends EventEmitter {
    public keyLights: Array<KeyLight>;

    /**
     * Creates an instance of ElgatoKeyLightController.
     *
     * @memberof ElgatoKeyLightController
     */
    constructor() {
        super();

        const bonjour = new Bonjour();
        this.keyLights = new Array();

        // Continually monitors for a new Key Light to be added
        bonjour.find({ type: 'elg' }, service => {
            if (service.txt.md.startsWith('Elgato Key Light')) {
                this.addKeylight({
                    ip: service['referer'].address,
                    port: service.port,
                    name: service.name
                });
            }
        });
    }

    /**
     * Adds a Key Light instance to our current array
     *
     * @private
     * @param {KeyLight} keyLight
     * @memberof ElgatoKeyLightController
     */
    private async addKeylight(keyLight: KeyLight) {
        try {
            //Grab our Key Light's settings, info, and current options
            let settingsCall = await axios.get(`http://${keyLight.ip}:${keyLight.port}/elgato/lights/settings`);
            keyLight.settings = settingsCall.data;

            let infoCall = await axios.get(`http://${keyLight.ip}:${keyLight.port}/elgato/accessory-info`);
            keyLight.info = infoCall.data;

            let optionsCall = await axios.get(`http://${keyLight.ip}:${keyLight.port}/elgato/lights`);
            keyLight.options = optionsCall.data;

            //Push the Key Light to our array and emit the event
            this.keyLights.push(keyLight);
            this.emit('newKeyLight', keyLight);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Updates a Key Light to the given options
     *
     * @param {KeyLight} light
     * @param {KeyLightOptions} options
     * @returns {Promise<void>}
     * @memberof ElgatoKeyLightController
     */
    public async updateLightOptions(light: KeyLight, options: KeyLightOptions): Promise<void> {
        return new Promise(async (resolve, reject) => {
            light.options = options;
            try {
                await axios.put(`http://${light.ip}:${light.port}/elgato/lights`, options);
                return resolve();
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * Updates all lights to the given options
     *
     * @param {KeyLightOptions} options
     * @returns {Promise<void>}
     * @memberof ElgatoKeyLightController
     */
    public async updateAllLights(options: KeyLightOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            for (let x = 0; x < this.keyLights.length; x++) {
                this.updateLightOptions(this.keyLights[x], options).catch(e => {
                    return reject(e);
                });
            }
            return resolve();
        });
    }
}