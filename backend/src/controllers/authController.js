const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone_number, password, user_role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      phone_number,
      password_hash: hashedPassword,
      user_role: user_role || 'user',
    });
    res.status(201).json({ message: 'User registered', userId: user.user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.user_role, fullName: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.json({ token, user: { role: user.user_role, fullName: user.full_name } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};