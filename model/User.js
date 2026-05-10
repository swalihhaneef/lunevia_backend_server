import { model, Schema } from "mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

const schema = new Schema(
  {
    ip: String,
    status: { type: Number, default: 0 },
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

schema.methods.generatePasswordHash = function (password) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return hash;
};

schema.methods.validatePassword = function (password, hashedPassword) {
  return compareSync(password, hashedPassword);
};

export default model("user", schema);
