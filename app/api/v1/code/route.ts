import { codeRegex } from "@/constants/codeRegex"
import { generateNewTokens } from "@/utils/jwt"
import prisma from "@/helpers/prismaHelper"

export async function POST(req: Request, res: Response) {
  try {
    const { code } = await req.json()
    if (!code) {
      return new Response(JSON.stringify({ error: "Code is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (!codeRegex.test(code)) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const userExists = await prisma.guest.findUnique({
      where: {
        code,
      },
    })

    if (!userExists) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { token, newRefreshToken } = generateNewTokens(userExists.id)

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