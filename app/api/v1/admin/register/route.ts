import prisma from "@/helpers/prismaHelper"
import { hashPassword } from "@/utils/bcryptjs"

export async function POST(req: Request, res: Response) {
  try {
    const { username, password, passwordConfirm } = await req.json()
    if (!username || !password || !passwordConfirm) {
      return new Response(
        JSON.stringify({
          error: "Email, password, and checkPassword are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    if (password !== passwordConfirm) {
      return new Response(JSON.stringify({ error: "Passwords do not match" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const userExists = await prisma.admin.findUnique({
      where: {
        username,
      },
    })

    if (userExists) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error("Error registering user: ", e)
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
