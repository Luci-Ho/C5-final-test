import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    // 1️⃣ Validate
    if (!name || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: 'name, email, phoneNumber, password, role là bắt buộc'
      });
    }

    // 2️⃣ Không cho tạo ADMIN
    if (role === 'ADMIN') {
      return res.status(403).json({
        message: 'Không được phép tạo tài khoản ADMIN'
      });
    }

    // 3️⃣ Chỉ cho STUDENT | TEACHER
    const finalRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';

    // 4️⃣ Check email unique
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({
        message: 'Email đã tồn tại'
      });
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: finalRole
    });

    res.status(201).json({
      message: 'Tạo user thành công',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      stack: error.stack
    });
  }
};
