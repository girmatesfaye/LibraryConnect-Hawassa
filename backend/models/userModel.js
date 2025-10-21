import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 15,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      trim: true,
      minLength: 6,
      maxLength: 32,
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
      trim: true,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  // fb00ac9d30d691c2bd695443976f0c24
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
