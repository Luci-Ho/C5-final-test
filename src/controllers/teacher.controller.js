import Teacher from '../models/Teacher.model.js';
import User from '../models/User.model.js';
import TeacherPosition from '../models/TeacherPosition.model.js';
import { generateTeacherCode } from '../utils/generateTeacherCode.js';
import { createTeacherService } from '../services/teacher.service.js';
/**
 * GET /teachers
 * Pagination
 */
export const getTeachers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Teacher.countDocuments({ isDeleted: false });

    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId')
      .populate('teacherPositions')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const data = teachers.map(t => ({
      code: t.code,
      name: t.userId?.name,
      email: t.userId?.email,
      phone: t.userId?.phoneNumber,
      address: t.userId?.address,
      isActive: t.isActive,
      positions: t.teacherPositions,
      degrees: (t.degrees || []).map(d => ({
        type: d.type,
        school: d.school
      }))
    }));

    res.json({
      meta: { page, limit, total },
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const teacher = await createTeacherService(req.body);

    res.status(201).json({
      message: 'Tạo giáo viên thành công',
      data: teacher
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findOne({
      _id: id,
      isDeleted: false
    })
      .populate('userId')
      .populate('teacherPositions');

    if (!teacher) {
      return res.status(404).json({
        message: 'Không tìm thấy giáo viên'
      });
    }

    const data = {
      id: teacher._id,
      code: teacher.code,
      isActive: teacher.isActive,
      startDate: teacher.startDate,
      endDate: teacher.endDate,

      user: {
        name: teacher.userId?.name,
        email: teacher.userId?.email,
        phoneNumber: teacher.userId?.phoneNumber,
        address: teacher.userId?.address,
        dob: teacher.userId?.dob
      },

      teacherPositions: teacher.teacherPositions,

      degrees: (teacher.degrees || []).map(d => ({
        type: d.type,
        school: d.school,
        major: d.major,
        year: d.year,
        isGraduated: d.isGraduated
      }))
    };

    res.json(data);

  } catch (error) {
    console.error(error);

    // Lỗi ObjectId không hợp lệ
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID không hợp lệ'
      });
    }

    res.status(500).json({
      message: 'Server error'
    });
  }
};


