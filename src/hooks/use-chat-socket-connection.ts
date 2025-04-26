import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useSocket } from '@/providers/web-socket';
import { MessageWithUser } from '@/types/app';

type UseChatSocketConnectionProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
  paramValue: string;
};

export const useChatSocketConnection = ({
  addKey,
  updateKey,
  queryKey,
  paramValue,
}: UseChatSocketConnectionProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const handleUpdateMessage = useCallback((message: MessageWithUser) => {
    queryClient.setQueryData<{ pages: { data: MessageWithUser[] }[] }>(
      [queryKey, paramValue],
      (prev) => {
        if (!prev) return prev;

        const updatedPages = prev.pages.map((page) => ({
          ...page,
          data: page.data.map((item) => (item.id === message.id ? message : item)),
        }));

        return {
          ...prev,
          pages: updatedPages,
        };
      }
    );
  }, [queryClient, queryKey, paramValue]);

  const handleNewMessage = useCallback((message: MessageWithUser) => {
    queryClient.setQueryData<{ pages: { data: MessageWithUser[] }[] }>(
      [queryKey, paramValue],
      (prev) => {
        if (!prev || prev.pages.length === 0) return prev;

        const newPages = [...prev.pages];
        newPages[0] = {
          ...newPages[0],
          data: [message, ...newPages[0].data],
        };

        return {
          ...prev,
          pages: newPages,
        };
      }
    );
  }, [queryClient, queryKey, paramValue]);

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, handleUpdateMessage);
    socket.on(addKey, handleNewMessage);

    return () => {
      socket.off(updateKey, handleUpdateMessage);
      socket.off(addKey, handleNewMessage);
    };
  }, [socket, addKey, updateKey, handleUpdateMessage, handleNewMessage]);
};
