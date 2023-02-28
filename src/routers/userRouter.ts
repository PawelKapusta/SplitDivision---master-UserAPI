import express from "express";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { isServiceType } from "../utils/isServiceType";
import { logger } from "../utils/logger";

const router = express.Router();

router.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return res.status(404).send("Users not found");
    }

    return res.status(200).json(users);
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.post("/api/v1/users/register", async (req, res) => {
  const {
    first_name,
    last_name,
    password,
    username,
    gender,
    service,
    email,
    phone,
    birth_date,
    avatar_image,
    is_admin,
    is_blocked,
  } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { phone }],
      },
    });

    if (existingUser !== null) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "This email is already in use by other user" });
      }

      if (existingUser.username === username) {
        return res.status(409).json({ message: "This username is already in use by other user" });
      }

      if (existingUser.phone === phone) {
        return res.status(409).json({ message: "This phone is already in use by other user" });
      }
    }

    const isCorrectService = isServiceType(service);

    if (isCorrectService) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        id: uuidv4(),
        first_name,
        last_name,
        password: hashedPassword,
        username,
        gender,
        service,
        email,
        phone,
        birth_date,
        avatar_image,
        is_admin,
        is_blocked,
      });

      return res.status(201).json(newUser);
    } else {
      res
        .status(400)
        .json({ message: "Service that user used to register is not correct with the system" });
    }
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.post("/api/v1/users/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(409).json({ message: "User with this login not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(409).json({ message: "Wrong password!" });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ token });
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.put("/api/v1/users/profile/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    first_name,
    last_name,
    password,
    username,
    gender,
    email,
    phone,
    birth_date,
    avatar_image,
  } = req.body;
  console.log(req.body);
  try {
    if (email !== undefined || username !== undefined || phone !== undefined) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }, { phone }],
        },
      });

      if (existingUser !== null) {
        if (existingUser.email === email) {
          return res.status(409).json({ message: "This email is already in use by other user" });
        }

        if (existingUser.username === username) {
          return res.status(409).json({ message: "This username is already in use by other user" });
        }

        if (existingUser.phone === phone) {
          return res.status(409).json({ message: "This phone is already in use by other user" });
        }
      }
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "This user not exists in the system" });
    }

    let hashedPassword = "",
      updatedData;
    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, 12);
      updatedData = {
        first_name,
        last_name,
        password: hashedPassword,
        username,
        gender,
        email,
        phone,
        birth_date,
        avatar_image,
      };
    } else {
      updatedData = {
        first_name,
        last_name,
        password,
        username,
        gender,
        email,
        phone,
        birth_date,
        avatar_image,
      };
    }

    const dataToUpdate = Object.keys(updatedData).filter(key => updatedData[key] !== undefined);

    dataToUpdate.forEach(key => (user[key] = updatedData[key]));

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

router.delete("/api/v1/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.destroy({ where: { id: userId } });

    if (!deletedUser) {
      return res.status(404).json({ message: "User with this id not exists in the system" });
    }

    return res.status(200).json({ message: "User successfully deleted from the system!" });
  } catch (error) {
    console.error(error);
    logger.error(error.stack);
    logger.error(error.message);
    logger.error(error.errors[0].message);
    return res.status(500).json({ error: error.errors[0].message });
  }
});

export default router;
