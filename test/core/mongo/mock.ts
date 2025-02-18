import * as moment from 'moment';
import { MovieSessionStatus, MovieStatus } from '../../../src/modules/movie/movie.enum';
import { TimeSlot, UserRole } from '../../../src/common/enums';
import { RoomStatus } from '../../../src/modules/room/room.enum';
import { UserStatus } from '../../../src/modules/user/user.enum';

export const userId1 = '67b35e662d005c1b7a2320f5';
export const userName1 = 'testUser';
export const userPassword1 = '123456';

export const roomId1 = '67b3459c55d730d2d9653444';
export const roomId2 = '67b345a0f372650de7bfb756';
export const roomId3 = '67b345a3a09b9f805dfc6b1c';

export const movieId1 = '67b345a5c37ec5ab29860b8f';
export const movieId2 = '67b345a83f75be462d492480';
export const movieId3 = '67b345ab8a5789937dbec889';
export const movieId4 = '67b34675f95243027db6c1e8';

export const MOCK_DATA = {
  users: [
    {
      _id: userId1,
      userName: userName1,
      firstName: 'Test',
      lastName: 'User',
      birthDate: moment().add(-20, 'years').toDate(),
      status: UserStatus.Active,
      password: userPassword1,
      roles: [UserRole.Customer],
    },
  ],

  rooms: [
    {
      _id: roomId1,
      name: 'Room 1',
      capacity: 1,
      status: RoomStatus.Active,
    },
    {
      _id: roomId2,
      name: 'Room 2',
      capacity: 100,
      status: RoomStatus.Active,
    },
    {
      _id: roomId3,
      name: 'Room 3',
      capacity: 100,
      status: RoomStatus.Active,
    },
  ],
  movies: [
    {
      _id: movieId1,
      name: 'Test Movie 1',
      ageRestriction: 7,
      releaseDate: moment().add(-2, 'years').toDate(),
      status: MovieStatus.Active,
      sessions: [
        {
          _id: '67b3371dde73dec699aabe3c',
          startTime: moment().add(2, 'months').set({ hour: 18, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1820,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b3372093c370c84d240c1a',
          startTime: moment().add(2, 'months').set({ hour: 18, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1820,
          room: roomId2,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b3372310b7cf6a3312641c',
          startTime: moment().add(2, 'months').set({ hour: 20, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot2022,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b33725f4592eaa4a569cec',
          startTime: moment().add(2, 'months').set({ hour: 20, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot2022,
          room: roomId2,
          price: 300,
          status: MovieSessionStatus.Active,
        },
      ],
    },
    {
      _id: movieId2,
      name: 'Test Movie 2',
      ageRestriction: 18,
      releaseDate: moment().add(-2, 'years').toDate(),
      status: MovieStatus.Active,
      sessions: [
        {
          _id: '67b337290c1ee23d9f593266',
          startTime: moment().add(2, 'months').set({ hour: 14, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1416,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b3372b913cf8d707a41e98',
          startTime: moment().add(2, 'months').set({ hour: 14, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1416,
          room: roomId2,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b3372ef8d8507e7ad14d29',
          startTime: new Date(),
          timeSlot: TimeSlot.TimeSlot1416,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Active,
        },
        {
          _id: '67b33732b055def04e19217c',
          startTime: moment().add(2, 'months').set({ hour: 16, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1618,
          room: roomId2,
          price: 300,
          status: MovieSessionStatus.Inactive,
        },
      ],
    },
    {
      _id: movieId3,
      name: 'Test Movie 2',
      ageRestriction: 18,
      releaseDate: moment().add(-2, 'years').toDate(),
      status: MovieStatus.Inactive,
      sessions: [
        {
          _id: '67b337290c1ee23d9f593263',
          startTime: moment().add(2, 'months').set({ hour: 14, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1416,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Inactive,
        },
      ],
    },
    {
      _id: movieId4,
      name: 'Test Movie 4',
      ageRestriction: 40,
      releaseDate: moment().add(-2, 'years').toDate(),
      status: MovieStatus.Active,
      sessions: [
        {
          _id: '67b34697fa04262e78446574',
          startTime: moment().add(6, 'months').set({ hour: 14, minute: 0, second: 0 }).toDate(),
          timeSlot: TimeSlot.TimeSlot1416,
          room: roomId1,
          price: 300,
          status: MovieSessionStatus.Active,
        },
      ],
    },
  ],
};
