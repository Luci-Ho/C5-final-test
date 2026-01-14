import express from 'express';
import {
  getTeachers,
  createTeacher,
  getTeacherById
} from '../controllers/teacher.controller.js';

const router = express.Router();

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);

export default router;
