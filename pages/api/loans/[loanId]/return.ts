import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const token = req.headers.authorization || "";
  const {
    query: { loanId },
  } = req;
  if (method === "POST") {
    // Retour manuel
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/loans/${loanId}/return`, {
      method: "POST",
      headers: { Authorization: token },
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } else {
    res.status(405).end();
  }
}
