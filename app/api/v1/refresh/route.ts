import { verifyRefreshToken, generateNewTokens } from "@/utils/jwt"

export async function POST(req: Request, res: Response) {
  const refreshToken = req.headers.get("Authorization")?.split(" ")[1]
  if (!refreshToken) {
    return new Response(
      JSON.stringify({ error: "Refresh token is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    const { token, newRefreshToken } = generateNewTokens(decoded.id)
    return new Response(
      JSON.stringify({ token, refreshToken: newRefreshToken }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
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
      "Access-Control-Allow-Methods": "POST",
    },
  })
}
