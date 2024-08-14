import bcrypt from "bcrypt";

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  console.log(
    "password, hashedPassword  in verify password:>> ",
    password,
    hashedPassword
  );

  try {
    const verified = bcrypt.compare(password, hashedPassword);
    return verified;
  } catch (error) {
    return error;
  }
};

// export const encryptPassword = async (req, res, next) => {
export const encryptPassword = async (password: string) => {
  try {
    // const { password } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
    // req.body.password = hashedPassword;
    // next();
  } catch (error) {
    // const err = formatErrors({
    //   statusCode: 500,
    //   message: "Error encrypting password",
    //   details: [{ msg: "Error encrypting password", path: "password" }],
    // });
    // return next(err);
    return error;
  }
};
