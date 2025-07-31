import React from 'react';
import { Stream } from '@cloudflare/stream-react';

const CloudflareStreamPlayer: React.FC = () => {
  return (
    <div className="w-full">
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
        <Stream
          controls
          src="533f5fff1652aa93d03388ef2ca2c301"
          height="100%"
          width="100%"
          autoplay={false}
          loop={false}
          muted={false}
          preload="metadata"
          responsive={true}
          className="rounded-xl"
        />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Live demonstration of AutiMind's AI platform capabilities
        </p>
      </div>
    </div>
  );
};

export default CloudflareStreamPlayer;