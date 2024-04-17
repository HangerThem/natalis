import { verifyToken } from "@/utils/jwt"
import prisma from "@/helpers/prismaHelper"

export async function GET(req: Request, res: Response) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authorization header is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
  try {
    var decoded = verifyToken(token)
  } catch (e) {
    console.error("Error verifying token: ", e)
    return new Response(JSON.stringify({ error: e }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const admin = await prisma.admin.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      username: true,
    },
  })

  if (!admin) {
    return new Response(JSON.stringify({ error: "Admin not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return new Response(JSON.stringify(admin), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function OPTIONS(req: Request, res: Response) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  })
}