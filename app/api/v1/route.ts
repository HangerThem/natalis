export async function GET(req: Request, res: Response) {
  try {
    return new Response(
      JSON.stringify({
        code: 200,
        status: "success",
        message: "Server is up and running",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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

export async function OPTIONS(req: Request, res: Response) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  })
}
