import React, { useEffect } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import socket from '../socket'


function Broadcast({role , username}) {
  useEffect(() => {
    const startBroadcast = async () => {
      const device = new mediasoupClient.Device();

      const rtpCapabilities = await new Promise(resolve => {
        socket.emit('getRtpCapabilities', resolve);
      });

      await device.load({ routerRtpCapabilities: rtpCapabilities });

      const data = await new Promise(resolve => {
        socket.emit('createProducerTransport', resolve);
      });

      const transport = device.createSendTransport(data);

      transport.on('connect', ({ dtlsParameters }, callback) => {
        socket.emit('connectProducerTransport', { dtlsParameters }, callback);
      });

      transport.on('produce', ({ kind, rtpParameters }, callback) => {
        socket.emit('produce', { kind, rtpParameters }, ({ id }) => callback({ id }));
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const videoTrack = stream.getVideoTracks()[0];
      await transport.produce({ track: videoTrack });

      const audioTrack = stream.getAudioTracks()[0];
      await transport.produce({ track: audioTrack });

      const videoElement = document.getElementById('localVideo');
      videoElement.srcObject = stream;
      videoElement.play();
    };

    startBroadcast();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Broadcasting Live</h1>
      <video id="localVideo" autoPlay muted className="w-full rounded" />
    </div>
  );
}

export default Broadcast;
