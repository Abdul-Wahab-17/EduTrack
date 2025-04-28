import React, { useEffect } from 'react';
import io from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

const socket = io('http://localhost:8080');

function Watch() {
  useEffect(() => {
    const startWatching = async () => {
      const device = new mediasoupClient.Device();

      const rtpCapabilities = await new Promise(resolve => {
        socket.emit('getRtpCapabilities', resolve);
      });

      await device.load({ routerRtpCapabilities: rtpCapabilities });

      const data = await new Promise(resolve => {
        socket.emit('createConsumerTransport', resolve);
      });

      const transport = device.createRecvTransport(data);

      transport.on('connect', ({ dtlsParameters }, callback) => {
        socket.emit('connectConsumerTransport', { dtlsParameters, transportId: transport.id }, callback);
      });

      const { id, producerId, kind, rtpParameters } = await new Promise(resolve => {
        socket.emit('consume', { rtpCapabilities: device.rtpCapabilities, transportId: transport.id }, resolve);
      });

      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });

      const stream = new MediaStream();
      stream.addTrack(consumer.track);

      const videoElement = document.getElementById('remoteVideo');
      videoElement.srcObject = stream;
      videoElement.play();
    };

    startWatching();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Watching Live</h1>
      <video id="remoteVideo" autoPlay className="w-full rounded" />
    </div>
  );
}

export default Watch;
