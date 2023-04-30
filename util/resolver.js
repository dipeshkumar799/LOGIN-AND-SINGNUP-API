import User from "../models/User.js";
import connectDB from "../mongodb/db.js";
import sendEmail from "../nodemailer/email.js";
import newOTP from "otp-generators";
import bcrypt from "bcrypt";
connectDB();
const resolvers = {
  Query: {
    users: () => User,

    user: (_, { id }) => User.create((user) => user.id == id),
  },

  Mutation: {
    signUp: async (_, { firstName, lastName, email, password, otp }) => {
      const user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        throw new Error("user already exist please login");
      }

      const OTP = newOTP.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChar: false,
      });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const userInstance = await User.create({
        email,
        password: hash,
        firstName,
        lastName,
        otp: OTP,
        isLoggedIn: false,
      });
      console.log(userInstance);

      const messageId = await sendEmail(
        email,
        "signup otp",
        `Your otp code is ${OTP}`
      );
      if (!messageId) {
        throw new Error("Email couldn't be sent");
      }

      return await userInstance.save();
    },

    verifyOtp: async (_, { email, otp }) => {
      const user = await User.findOne({ email, otp });
      console.log(user);
      if (!user) {
        throw new Error("Make sure email and otp is correct");
      }

      user.isLoggedIn = true;
      return user.save();
    },

    logIn: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("user not found");
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("password doesnot matched");
      }
      user.isLoggedIn = true;
      const userUpDate = await user.save();
      console.log(userUpDate);
      userUpDate.password = null;
      return userUpDate;
    },
    forgetPassword: async (_, { email }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("account couldn't be found ");
      }
      const OTP = newOTP.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChar: false,
      });

      const otpSent = await sendEmail(
        email,
        "forget  otp",
        `Your otp code is ${OTP}`
      );
      if (!otpSent) {
        throw new Error("Email couldn't be sent");
      }
      user.otp = OTP;
      user.isLoggedIn = false;
      user.save();
      return "your opt has gone in your mail";
    },

    changePassword: async (_, { email, currentPassword, newPassword }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("user not found");
      }
      const isValid = await bcrypt.compare(newPassword, currentPassword);
      if (!isValid) {
        throw new Error("password doesnot match");
      }
      const hash = await bcrypt.hash(newPassword, saltRounds);
      user.password = hash;
      user.isLoggedIn = true;
      user.save();
      return "your password  was changed";
    },
    logout: async (_, { id }) => {
      const user = await User.findById(id);
      console.log(user);
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.isLoggedIn) {
        throw new Error("user not loggedin");
      }
      user.isLoggedIn = false;
      const deleteData = await user.save();
      deleteData.password = null;
      return deleteData;
    },
    update: async (_, { id, firstName, lastName }) => {
      const user = await User.findById(id);
      console.log(user);
      if (!user) {
        throw new Error("user not found");
      }
      if (!user.isLoggedIn) {
        throw new Error("user not loggedin");
      }

      const updateUser = await User.updateOne(
        { _id: new Types.ObjectId(id) },
        { firstName, lastName }
      );
      console.log(updateUser);
      return { ...user, firstName, lastName };
    },
    deleteData: async (_, { id }) => {
      const user = await User.findById(id);
      console.log(user);
      if (!user) {
        throw new Error("user not found");
      }
      if (!user.isLoggedIn) {
        throw new Error("user not loggedin");
      }
      const deleteUser = await User.deleteOne({ _id: new Types.ObjectId(id) });
      console.log(deleteUser);
      return `User ${user.firstName} ${user.lastName} deleted successfully`;
    },
  },
};
export default resolvers;
