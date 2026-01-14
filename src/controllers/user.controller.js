export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ❌ Không cho tạo ADMIN
    if (role === 'ADMIN') {
      return res.status(403).json({
        message: 'Không được phép tạo tài khoản ADMIN'
      });
    }

    // ✅ chỉ cho STUDENT | TEACHER
    const finalRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';

    // check email
    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const user = await User.create({
      name,
      email,
      password, // nhớ hash
      role: finalRole
    });

    return res.status(201).json({
      message: 'Tạo user thành công',
      data: user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
