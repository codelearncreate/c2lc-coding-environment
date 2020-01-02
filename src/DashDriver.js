// @flow

const dashServiceUuid = 'af237777-879d-6186-1f49-deca0e85d9c1';
const dashCommandCharacteristicUuid = 'af230002-879d-6186-1f49-deca0e85d9c1';

export default class DashDriver {
    commandCharacteristic: any;
    connected: boolean;

    constructor() {
        this.connected = false;
    }

    connect(onDisconnected: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            (navigator: any).bluetooth.requestDevice({
                filters: [{ services: [dashServiceUuid] }]
            }).then((device) => {
                device.addEventListener('gattserverdisconnected', onDisconnected);
                return device.gatt.connect();
            }).then((server) => {
                this.connected = server.connected;
                return server.getPrimaryService(dashServiceUuid);
            }).then((service) => {
                return service.getCharacteristic(dashCommandCharacteristicUuid);
            }).then((characteristic) => {
                this.commandCharacteristic = characteristic;
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    sendCommand(bytes: Array<number>, waitTimeMs: number): Promise<void> {
        // TODO: Use feedback from Dash to know when the command has finished,
        //       rather than after a set amount of time
        return new Promise((resolve, reject) => {
            this.commandCharacteristic.writeValue(new Uint8Array(bytes));
            setTimeout(() => {
                resolve();
            }, waitTimeMs);
        });
    }

    forward(): Promise<void> {
        return this.sendCommand(
            [0x23, 0xC8, 0x00, 0x00, 0x03, 0xE8, 0x00, 0x00, 0x80],
            1900
        );
    }

    left(): Promise<void> {
        return this.sendCommand(
            [0x23, 0x00, 0x00, 0x9D, 0x03, 0xE8, 0x00, 0x00, 0x80],
            1900
        );
    }

    right(): Promise<void> {
        return this.sendCommand(
            [0x23, 0x00, 0x00, 0x63, 0x03, 0xE8, 0xC0, 0xC0, 0x80],
            1900
        );
    }
}
