// @flow

import * as C2lcMath from './C2lcMath';

export default class SoundAnalyser {
    webAudioContextInstance: any;
    mediaDevicesInstance: any;
    deviceInstance: any;
    deviceList: Array<string>;
    context: any;
    soundSamples: { clap : Array<number> };

    constructor(webAudioContextInstance: any, mediaDevicesInstance: any, soundSamples:  { clap : Array<number> }) {
        this.webAudioContextInstance = webAudioContextInstance;
        this.mediaDevicesInstance = mediaDevicesInstance;

        this.deviceList = [];
        this.context = new webAudioContextInstance();
        this.soundSamples = soundSamples;
    }

    getMicrophones = () => {
        if ( this.mediaDevicesInstance ) {
            this.mediaDevicesInstance.enumerateDevices().then((devices) => {
                for (const device of devices) {
                    if (device.kind === 'audioinput') this.deviceList.push(device.deviceId);
                }
            }, (error) => {
                console.log(error.name);
                console.log(error.message);
            });
        }
    }

    configureDetection(deviceConfig: { string: { (): void }}) {
        let deviceStreamNodes = [];
        for (const deviceId of Object.keys(deviceConfig)) {
            deviceStreamNodes.push(this.addAudioStreamNode(deviceId));
        }
        Promise.all(deviceStreamNodes).then((analysers) => {
            const scriptProcessorAnalysisNode = this.context.createScriptProcessor(2048,2,1);
            const audioGain = this.context.createGain();
            scriptProcessorAnalysisNode.connect(audioGain);
            audioGain.connect(this.context.destination);
            scriptProcessorAnalysisNode.onaudioprocess = () => {
                for (const analyser of analysers) {
                    let sim1 = this.getSoundSimilarity(analyser);
                    if (sim1 >= 0.75) {
                        console.log('is a clap');
                        deviceConfig[analyser.deviceId]();
                    }
                }
            }
        });
    }

    getSoundSimilarity(analyserNode: any): number {
        let timeDomainBuffer = analyserNode.analyser.getByteTimeDomainData(analyserNode.timeBuffer);
        let freqDomainBuffer = analyserNode.analyser.getByteFrequencyData(analyserNode.freqBuffer);
        let currentTimeValue = (analyserNode.timeBuffer[1] / 128) - 1.0;
        let similarity = 0;
        if (Math.abs(currentTimeValue) !== 0.0078125
        && currentTimeValue !== 0 && Math.abs(currentTimeValue) !== 0.015625) {
            similarity = C2lcMath.getNormalizedCorrelation(analyserNode.freqBuffer, this.soundSamples['clap'] );
        }
        return similarity;
    }

    addAudioStreamNode = async (deviceId: string): any=> {
        const audioInputDevice = await this.mediaDevicesInstance.getUserMedia({audio: {deviceId: deviceId}});
        const audioInputStream = this.context.createMediaStreamSource(audioInputDevice);
        const audioAnalyser = this.context.createAnalyser();
        audioAnalyser.smoothingTimeConstant = 0;
        audioAnalyser.fftSize = 2048;
        audioInputStream.connect(audioAnalyser);
        const bufferLength = audioAnalyser.frequencyBinCount;
        const arrayFreqDomain = new Uint8Array(bufferLength);
        const arrayTimeDomain = new Uint8Array(bufferLength);
        return ({
            deviceId,
            analyser : audioAnalyser,
            freqBuffer : arrayFreqDomain,
            timeBuffer : arrayTimeDomain
        });
    }

    start() {}
    
    stop() {}
}