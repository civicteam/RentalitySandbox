// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  NEXT_PUBLIC_TEST_ENV?: string;
  TEST_ENV?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ NEXT_PUBLIC_TEST_ENV: process.env.NEXT_PUBLIC_TEST_ENV, TEST_ENV: process.env.TEST_ENV });
}
