import z from "zod";

export const signInSchema = z.object({
  email: z.string().email().min(10).max(35),
  password: z.string().min(8).max(20),
});

export const signUpSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email().min(10).max(35),
  password: z.string().min(8).max(20),
});

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  sessions: Session[];
  createdAt: Date;
}

export interface Session {
  id: string;
  title: string;
  createdBy: User;
  createdById: string;
  chunks: Chunk[];
  createdAt: Date;
}

export interface Chunk {
  id: string;
  session: Session;
  sessionId: string;
  s3Key: string;
  createdAt: Date;
}
