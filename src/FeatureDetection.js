// @flow

function bluetoothApiIsAvailable(): boolean {
    return !!((navigator: any).bluetooth);
}

function webAudioAPIIsAvailable(): boolean {
    return !!((window: any).AudioContext || (window:any).webkitAudioContext);
}

function mediaDevicesIsAvailable(): boolean {
    return !!((navigator: any).mediaDevices);
}


export { bluetoothApiIsAvailable, webAudioAPIIsAvailable, mediaDevicesIsAvailable };
