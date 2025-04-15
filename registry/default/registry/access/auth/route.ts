import { NextResponse } from "next/server"
import { authenticateWithBasicAuth } from "@/lib/auth/integrations/basic-auth"
import { generateToken } from "@/lib/shadcn/registry/utils"
import { type BasicAuthCredentials } from "@/lib/shadcn/registry/types"

export async function POST(request: Request) {
  try {
    const credentials: BasicAuthCredentials = await request.json()
    const authResult = await authenticateWithBasicAuth(credentials)
   
    if (authResult.success) {
      // Only generate token if authentication was successful
      const token = await generateToken()
      return NextResponse.json({
        ...authResult,
        token
      })
    }

    return NextResponse.json(
      authResult,
      { status: 401 }
    )
  } catch (error) {
    console.error("Route error:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Invalid request format" 
      },
      { status: 400 }
    )
  }
} 