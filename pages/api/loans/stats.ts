import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const token = req.headers.authorization || "";
  if (method === "GET") {
    // Statistiques annuelles
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/loans/stats`, {
      headers: { Authorization: token },
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } else {
    res.status(405).end();
  }
}
