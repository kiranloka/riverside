import { Request, Response } from "express";
import { Router } from "express";
import { signInSchema, signUpSchema } from "../../types/types";
import { prisma } from "../../prisma/prisma";
import jwt from "jsonwebtoken";
import { hashPassword,comparePassword } from "../../utils/bcrypt.utils";

export const userRouter: Router = Router();
const JWT_SECRET="123123";

userRouter.post("/signup", async (req, res) => {
  const { error, data } = signUpSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(data.password);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    return res.status(200).json({ message: "User created successfully!" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

userRouter.post("/signIn", async (req: Request, res: Response) => {
  const { error, data } = await signInSchema.safeParse(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation Error" });
  }
  const isUser=await prisma.user.findFirst({
    where:{
        email:data.email
    }
  })
  if(!isUser){
    return res.status(411).json({message:"user not found!"})
  }
  try{
    const verified=await comparePassword(data.password,isUser.password)
    if(!verified){
      return res.status(400).json({message:"not verified"})
    }
    const token=jwt.sign({
      userId:isUser.id
    },JWT_SECRET);
    res.status(200).json({token})
  }
});


