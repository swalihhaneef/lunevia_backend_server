import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";

import { Types } from "mongoose";
import { Error } from "express-error-catcher";

const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `public/uploads/${folder}`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      const originalFileName = path.basename(file.originalname, fileExtension);
      const fileName = originalFileName.replace(/\s/g, "-").replace(/--/, "-") + "-" + uniqueSuffix + fileExtension;
      cb(null, fileName);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`${allowedExtensions.join(",").replace(/[.,]/g, " ").replace(/\s/, "")} files are allowed`, 400));
  }
};

export const multerUpload = (folder = "", filter, limits = null) => {
  if (!filter) filter = fileFilter;
  return multer({ storage: storage(folder), fileFilter: filter, limits });
};

export const currentDate = () => moment().format("YYYY-MM-DD");

export const currentTime = () => moment().format("HH:mm:ss");

export const imageFileName = async (req, res) => {
  try {
    const data = req.file;
    if (req.file) {
      data.new_filename = data.destination.replace("public/", "") + "/" + data.filename;
      res.status(200).json({ status: 200, data });
    } else {
      res.status(400).json("something went wrong");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const generatePermalink = (str) => {
  var code = str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return code;
};

export function paginationParams(query) {
  let { page = 1, limit = 20 } = query;

  page = Number(page);
  limit = Number(limit);

  // limit = limit > 100 ? 20 : limit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export const unwantedFields = (obj = false) => (obj ? { createdAt: 0, updatedAt: 0, __v: 0 } : "-createdAt -updatedAt -__v");

export function isValidObjectId(id) {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

export async function counter(model, key = "") {
  const count = (await model.countDocuments()) + 1;
  return (key ? `${key}` : "") + count.toString().padStart(4, "0");
}
