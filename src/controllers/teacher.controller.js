// controllers/Teacher.controller.js
import Teacher from '../models/Teacher.model.js';
import { createTeacherService } from '../services/teacher.service.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

/**
 * GET /teachers
 */
export const getTeachers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Lấy toàn bộ teachers
    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId')
      .populate('teacherPositions')
      .sort({ createdAt: -1 });

    const total = teachers.length;

    // Cắt mảng theo page & limit
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTeachers = teachers.slice(start, end);

    const data = paginatedTeachers.map(t => ({
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


/**
 * POST /teachers
 * Chỉ tạo HỒ SƠ giáo viên cho user đã có role TEACHER
 */
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

/**
 * GET /teachers/:id
 */
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

    res.json({
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
      degrees: teacher.degrees
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /teachers/by-position/:positionId
 */
export const getTeachersByPosition = async (req, res) => {
  try {
    const { positionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(positionId)) {
      return res.status(400).json({ message: 'Invalid positionId' });
    }

    const teachers = await Teacher.find({
      teacherPositions: new mongoose.Types.ObjectId(positionId),
      isDeleted: false
    })
    .populate('teacherPositions');

    return res.json(teachers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


