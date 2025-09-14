const { User, Sequelize } = require('../models');
const { Op } = Sequelize;
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone_number } = req.body;
    await User.update({ full_name, phone_number }, { where: { user_id: req.user.userId } });
    const updatedUser = await User.findByPk(req.user.userId, { attributes: { exclude: ['password_hash'] } });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] }, order: [['user_id', 'ASC']] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: `%${query}%` } },
          { phone_number: { [Op.iLike]: `%${query}%` } },
          { full_name: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['user_id', 'full_name', 'email', 'phone_number'],
      limit: 10
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone_number, user_role, password } = req.body;
    let dataToUpdate = { full_name, email, phone_number, user_role };

    if (password) {
      dataToUpdate.password_hash = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(dataToUpdate, { where: { user_id: id } });

    if (updated) {
      const updatedUser = await User.findByPk(id, { attributes: { exclude: ['password_hash'] } });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { user_id: id } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};