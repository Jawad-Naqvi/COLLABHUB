
import { FC, useEffect, useState } from 'react';
import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';

import { User } from '@/types/app';
import DotAnimatedLoader from './dot-animated-loader';

type VideoChatProps = {
  chatId: string;
  userData: User;
};

const VideoChat: FC<VideoChatProps> = ({ chatId, userData }) => {
  const [token, setToken] = useState<string>('');
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  useEffect(() => {
    const name = userData.email;

    // Function to fetch token
    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error('Failed to fetch token:', e);
      }
    };

    fetchToken(); // Initial token fetch

    // Set up token refresh every 10 minutes (600000 ms)
    const intervalId = setInterval(fetchToken, 600000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [chatId, userData.email]);

  if (!token || !serverUrl) {
    return <DotAnimatedLoader />;
  }

  return (
    <LiveKitRoom
      video
      audio
      token={token}
      connect
      serverUrl={serverUrl}
      data-lk-theme="default"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default VideoChat;

