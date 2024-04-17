import prisma from "@/helpers/prismaHelper"
import { verifyToken } from "@/utils/jwt"

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

    const events = await prisma.event.findMany({
      where: {
        adminId: decoded.id,
      },
      include: {
        guests: true,
      },
    })

    if (!events) {
      return new Response(JSON.stringify({ error: "Events not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error("Error getting event: ", e)
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST(req: Request, res: Response) {
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

  const isAdmin = await prisma.admin.findUnique({
    where: {
      id: decoded.id,
    },
  })

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const { name, description, date, location } = await req.json()

  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        date,
        location,
        adminId: decoded.id,
      },
    })
    return new Response(JSON.stringify(newEvent), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error("Error creating event: ", e)
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
      "Access-Control-Allow-Methods": "GET, POST",
    },
  })
}
