export interface LightStrip {
    ip: string;
    port: number;
    name: string;
    settings?: LightStripSettings;
    info?: LightStripInfo;
    options?: LightStripOptions;
}

export interface LightStripSettings {
    powerOnBehavior: number;
    powerOnBrightness: number;
    powerOnTemperature: number;
    switchOnDurationMs: number;
    switchOffDurationMs: number;
    colorChangeDurationMs: number;
}

export interface LightStripInfo {
    productName: string;
    hardwareBoardType: number;
    firmwareBuildNumber: number;
    firmwareVersion: string;
    serialNumber: string;
    displayName: string;
    features: Array<string>;
}

export interface LightStripOptions {
    numberOfLights: number,
    lights: [{
        on: number,
        hue: number,
        saturation: number,
        brightness: number
    }]
}