import Teacher from '../models/Teacher.model.js';
import User from '../models/User.model.js';
import TeacherPosition from '../models/TeacherPosition.model.js';
import { generateTeacherCode } from '../utils/generateTeacherCode.js';

export const createTeacherService = async (payload) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    identity,
    dob,
    teacherPositions,
    degrees,
    startDate,
    endDate
  } = payload;

  // 1. Check email
  if (await User.exists({ email })) {
    throw new Error('Email đã tồn tại');
  }

  // 2. Check identity
  if (await User.exists({ identity })) {
    throw new Error('CMND/CCCD đã tồn tại');
  }

  // 3. Validate teacher positions
  if (teacherPositions?.length) {
    const count = await TeacherPosition.countDocuments({
      _id: { $in: teacherPositions }
    });
    if (count !== teacherPositions.length) {
      throw new Error('Vị trí công tác không hợp lệ');
    }
  }

  // 4. Create USER
  const user = await User.create({
    name,
    email,
    phoneNumber,
    address,
    identity,
    dob,
    role: 'TEACHER'
  });

  // 5. Create TEACHER
  const teacher = await Teacher.create({
    userId: user._id,
    code: await generateTeacherCode(Teacher),
    isActive: true,
    startDate,
    endDate,
    teacherPositions,
    degrees
  });

  return teacher;
};
