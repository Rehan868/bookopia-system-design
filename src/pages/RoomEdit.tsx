
import React from 'react';
import { useParams } from 'react-router-dom';
import { AddEditRoomForm } from '@/components/rooms/AddEditRoomForm';

const RoomEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, the room data would be fetched using the ID
  console.log('Editing room with ID:', id);
  
  // Mocked data for an existing room
  const roomData = {
    roomNumber: '101',
    property: 'Marina Tower',
    type: 'Deluxe Suite',
    maxOccupancy: '2',
    basePrice: '180',
    description: 'Luxurious suite with ocean view, featuring modern amenities and a spacious layout perfect for both business and leisure travelers.',
    amenities: 'Ocean View\nKing Bed\nMini Bar\nSmart TV\nFree WiFi\nWork Desk\nEn-suite Bathroom\nAir Conditioning',
    status: 'available',
    owner: 'John Doe',
    isActive: true,
  };
  
  return <AddEditRoomForm mode="edit" roomData={roomData} />;
};

export default RoomEdit;
