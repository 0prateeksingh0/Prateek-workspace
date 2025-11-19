import { Room, RoomStore } from '../models/Room';

export function seedRooms(roomStore: RoomStore): void {
  const rooms: Room[] = [
    {
      id: '101',
      name: 'Cabin 1',
      baseHourlyRate: 300,
      capacity: 4
    },
    {
      id: '102',
      name: 'Cabin 2',
      baseHourlyRate: 400,
      capacity: 6
    },
    {
      id: '103',
      name: 'Conference Room A',
      baseHourlyRate: 600,
      capacity: 10
    },
    {
      id: '104',
      name: 'Conference Room B',
      baseHourlyRate: 500,
      capacity: 8
    },
    {
      id: '105',
      name: 'Small Meeting Room',
      baseHourlyRate: 250,
      capacity: 3
    }
  ];

  rooms.forEach(room => roomStore.addRoom(room));
  console.log(`✅ Seeded ${rooms.length} rooms`);
}

