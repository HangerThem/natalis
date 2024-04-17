import prisma from "@/helpers/prismaHelper"
import { verifyToken } from "@/utils/jwt"

export async function GET(req: Request, res: Response) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "")
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
    const decoded = verifyToken(token)
    const user = await prisma.guest.findUnique({
      where: {
        id: decoded.id,
      },
    })
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
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
