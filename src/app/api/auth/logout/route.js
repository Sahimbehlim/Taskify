export async function POST() {
  return new Response(JSON.stringify({ message: "Successfully logged out." }), {
    status: 200,
    headers: {
      // Clear the token cookie
      "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
      "Content-Type": "application/json",
    },
  });
}
