import { encrypt } from "@/lib/auth";
import { IUser, UserModel } from "@/lib/models";
import { ISignupData } from "@/lib/types/userTypes";
import { encryptPassword } from "@/utils/bcrypt";
// import { encryptPassword } from "@/utils/bcrypt";

export const createUser = async ({
  email,
  username,
  password,
}: ISignupData) => {
  console.log("email, username, password", email, username, password);
  const hashedPassword = await encryptPassword(password);
  console.log("hashedPassword", hashedPassword);
  // console.log("req.body :>> ", req.body);
  const newUser = new UserModel({
    email: email,
    username: username,
    password: hashedPassword,
  });

  console.log("newUser :>> ", newUser);
  try {
    const result = await newUser.save();
    console.log("result :>> ", result);
    const response = {
      message: "User created successfully",
      user: {
        _id: result._id,
        email: result.email,
        username: result.username,
      },
    };
    return response;
    //   res.status(201).json(response); // 201 for resource creation
  } catch (e) {
    console.log(e);
    // 11000 is Mongo's duplicate key error
    //   if (e.code === 11000) {
    //     const error = new Error("That email is already registered");
    //     error.statusCode = 409;
    //     next(error);
    //   } else {
    //     next(e);
    //   }
  }
};
