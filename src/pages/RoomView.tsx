
import React from 'react';
import { useParams } from 'react-router-dom';
import { RoomDetails } from '@/components/rooms/RoomDetails';
import { useRoom } from '@/hooks/useRooms';

const RoomView = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <>
      {id && <RoomDetails roomId={id} />}
      {!id && <div>No room ID provided</div>}
    </>
  );
};

export default RoomView;
