import { verifyToken } from "@/utils/jwt"
import prisma from "@/helpers/prismaHelper"

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
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
  const { eventId } = params

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

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        guests: true,
      },
    })

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (
      !event?.guests.find((guest) => guest.id === decoded.id) &&
      event?.adminId !== decoded.id
    ) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    return new Response(JSON.stringify(event), {
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

export async function PUT(
  req: Request,
  { params }: { params: { eventId: string } }
) {
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

  const { eventId } = params

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

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        adminId: decoded.id,
      },
    })

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { name, date, location, description } = await req.json()

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        date,
        location,
        description,
      },
    })

    return new Response(JSON.stringify(updatedEvent), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error("Error updating event: ", e)
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
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

  const { eventId } = params

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

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        adminId: decoded.id,
      },
    })

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.error("Error deleting event: ", e)
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
      "Access-Control-Allow-Methods": "GET, PUT, DELETE",
    },
  })
}
