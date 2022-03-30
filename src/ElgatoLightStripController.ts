import { Bonjour } from "bonjour-service";
import { EventEmitter } from "events";
import { LightStrip, LightStripOptions } from "./types/LightStrip";

const axios = require('axios').default;

export class ElgatoLightStripController extends EventEmitter {
    public lightStrips: Array<LightStrip>;

    /**
     * Creates an instance of ElgatoLightStripController.
     *
     * @memberof ElgatoLightStripController
     */
    constructor() {
        super();

        const bonjour = new Bonjour();
        this.lightStrips = new Array();

        // Continually monitors for a new Light Strip to be added
        bonjour.find({ type: 'elg' }, service => {
            if (service.txt.md.startsWith('Elgato Light Strip')) {
                this.addLightstrip({
                    ip: service['referer'].address,
                    port: service.port,
                    name: service.name
                });
            }
        });
    }

    /**
     * Adds a new Light Strip instance to our current array
     *
     * @private
     * @param {LightStrip} lightStrip
     * @memberof ElgatoLightStripController
     */
    private async addLightstrip(lightStrip: LightStrip) {
        try {
            //Get the Light Strip's settings, info, and current options
            let settings = await axios.get(`http://${lightStrip.ip}:${lightStrip.port}/elgato/lights/settings`);
            lightStrip.settings = settings.data;

            let accessoryInfo = await axios.get(`http://${lightStrip.ip}:${lightStrip.port}/elgato/accessory-info`);
            lightStrip.info = accessoryInfo.data;

            let options = await axios.get(`http://${lightStrip.ip}:${lightStrip.port}/elgato/lights`);
            lightStrip.options = options.data;

            //Push the Light Strip to our array and emit the event
            this.lightStrips.push(lightStrip);
            this.emit('newLightStrip', lightStrip);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Updates a Light Strip to the given options
     *
     * @param {LightStrip} light
     * @param {LightStripOptions} options
     * @returns {Promise<void>}
     * @memberof ElgatoLightStripController
     */
    public async updateLightOptions(light: LightStrip, options: LightStripOptions): Promise<void> {
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
     * @param {LightStripOptions} options
     * @returns {Promise<void>}
     * @memberof ElgatoLightStripController
     */
    public async updateAllStrips(options: LightStripOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            for (let x = 0; x < this.lightStrips.length; x++) {
                this.updateLightOptions(this.lightStrips[x], options).catch(e => {
                    return reject(e);
                });
            }
            return resolve();
        });
    }
}