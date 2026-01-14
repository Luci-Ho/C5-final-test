import Teacher from '../models/Teacher.model.js';
import User from '../models/User.model.js';
import TeacherPosition from '../models/TeacherPosition.model.js';
import { generateTeacherCode } from '../utils/generateTeacherCode.js';

export const createTeacherService = async (payload) => {
  const {
    userId,
    teacherPositions = [],
    degrees = [],
    startDate,
    endDate
  } = payload;

  // 1. Check user tồn tại
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User không tồn tại');
  }

  // 2. User phải có role TEACHER
  if (user.role !== 'TEACHER') {
    throw new Error('User này không phải giáo viên');
  }

  // 3. Không cho tạo trùng teacher
  const existed = await Teacher.findOne({ userId, isDeleted: false });
  if (existed) {
    throw new Error('Giáo viên đã tồn tại');
  }

  // 4. Validate teacher positions
  if (teacherPositions.length > 0) {
    const count = await TeacherPosition.countDocuments({
      _id: { $in: teacherPositions }
    });

    if (count !== teacherPositions.length) {
      throw new Error('Vị trí công tác không hợp lệ');
    }
  }

  // 5. Tạo teacher
  const teacher = await Teacher.create({
    userId,
    code: await generateTeacherCode(Teacher),
    teacherPositions,
    degrees,
    startDate,
    endDate,
    isActive: true
  });

  return teacher;
};
