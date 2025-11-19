export interface Room {
  id: string;
  name: string;
  baseHourlyRate: number;
  capacity: number;
}

export class RoomStore {
  private rooms: Map<string, Room> = new Map();

  addRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

