const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

const validateSkills = (skills) => {
  return Array.isArray(skills) && skills.length > 0;
};

const validateRegister = (req, res, next) => {
  const { name, email, password, skills } = req.body;
  
  if (!validateName(name)) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }
  
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  if (!validateSkills(skills)) {
    return res.status(400).json({ message: 'At least one skill is required' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }
  
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEmail,
  validatePassword,
  validateName,
  validateSkills
};
