import express from "express";
import { supabase } from "../supabase.js";
const router = express.Router();

// import model from "../model/index.js";

/* GET home page. */
router.get("/", async function (req, res) {
  res.send("Server running 🚀");
});

router.get("/test-supabase", async (req, res) => {
  console.log('first')
  const { data, error } = await supabase.storage.listBuckets();

  res.json({ data, error });
});

export default router;
