import { Request, Response } from 'express';
import { RoomStore } from '../models/Room';

export class RoomController {
  constructor(private roomStore: RoomStore) {}

  /**
   * GET /api/rooms - Get all rooms
   */
  getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
      const rooms = this.roomStore.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * GET /api/rooms/:id - Get a specific room
   */
  getRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const room = this.roomStore.getRoom(req.params.id);
      if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

