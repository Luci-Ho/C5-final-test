import TeacherPosition from '../models/TeacherPosition.model.js';

export const getTeacherPositions = async (req, res) => {
  const data = await TeacherPosition.find({
    isDeleted: false
  });

  res.json(data);
};

export const createTeacherPosition = async (req, res) => {
  try {
    const { code, name, description } = req.body;

    // 1. Validate
    if (!code || !name) {
      return res.status(400).json({
        message: 'Code và name là bắt buộc'
      });
    }

    // 2. Check unique code
    const existed = await TeacherPosition.findOne({ code });
    if (existed) {
      return res.status(400).json({
        message: 'Code vị trí công tác đã tồn tại'
      });
    }

    // 3. Create
    const position = await TeacherPosition.create({
      code,
      name,
      description
    });

    res.status(201).json({
      message: 'Tạo vị trí công tác thành công',
      data: position
    });

  } catch (error) {
    console.error(error);

    // Trường hợp trùng unique index
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Code vị trí công tác đã tồn tại'
      });
    }

    res.status(500).json({
      message: 'Server error'
    });
  }
};

