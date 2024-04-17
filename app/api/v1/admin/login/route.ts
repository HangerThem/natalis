import { generateNewTokens } from "@/utils/jwt"
import { verifyPassword } from "@/utils/bcryptjs"
import prisma from "@/helpers/prismaHelper"

export async function POST(req: Request, res: Response) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    const adminExists = await prisma.admin.findUnique({
      where: {
        username,
      },
    })

    if (!adminExists) {
      return new Response(JSON.stringify({ error: "Admin not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const passwordMatch = await verifyPassword(password, adminExists.password)

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { token, newRefreshToken } = generateNewTokens(adminExists.id)

    return new Response(
      JSON.stringify({ token, refreshToken: newRefreshToken }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (e) {
    console.error("Error logging in: ", e)
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
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
      "Access-Control-Allow-Methods": "POST",
    },
  })
}
