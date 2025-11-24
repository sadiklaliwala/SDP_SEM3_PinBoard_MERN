import jwt from 'jsonwebtoken';
const CreateTokenandSetCookies = (res, user) => {
  const token = jwt.sign({
    id: user._id,//mogoose id 
    email: user.email
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // res.cookie('token', token, { maxAge: 9000000, httpOnly: true, secure: false });

}

export default CreateTokenandSetCookies;