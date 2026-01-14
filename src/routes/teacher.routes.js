import express from 'express';
import {
  getTeachers,
  createTeacher,
  getTeacherById,
  getTeachersByPosition
} from '../controllers/teacher.controller.js';

const router = express.Router();

router.get('/', getTeachers);
router.post('/', createTeacher);

router.get('/by-position/:positionId', getTeachersByPosition);

router.get('/:id', getTeacherById);

export default router;
