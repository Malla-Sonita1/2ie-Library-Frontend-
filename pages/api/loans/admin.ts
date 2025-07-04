import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const token = req.headers.authorization || "";
  if (method === "GET") {
    // Liste des emprunts enrichie
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/loans/admin`, {
      headers: { Authorization: token },
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } else {
    res.status(405).end();
  }
}
