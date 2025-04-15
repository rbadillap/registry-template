"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Check, Copy, Clock } from "lucide-react"
import { verifyToken } from "@/lib/shadcn/registry/utils"

function LoginContent() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/registry"
  
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    setCopied(false)
    setToken("")
    setTokenValid(false)

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch("/registry/access/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem("registry_token", data.token)
        // Set the token to display the URL
        setToken(data.token)
        // Verify the token
        const isValid = await verifyToken(data.token)
        setTokenValid(isValid)
      } else {
        setError(data.message)
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred while trying to log in")
    } finally {
      setLoading(false)
    }
  }

  const fullUrl = token ? `${window.location.origin}${returnUrl}?token=${token}` : ""

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "URL has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registry Access</CardTitle>
        <CardDescription>
          {token ? "Your access URL is ready" : "Enter your credentials to get access URL"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Generating URL..." : "Generate Access URL"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">
                {tokenValid 
                  ? "Your access token is valid for 1 hour from generation. After that, you'll need to generate a new one."
                  : "This token appears to be invalid or expired. Please generate a new one."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={fullUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Copy this URL to access the registry. The token is already included.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setToken("")
                setTokenValid(false)
                setCopied(false)
              }}
            >
              Generate New Token
            </Button>
          </div>
          )}
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Loading...</CardTitle>
        <CardDescription>Please wait while we load the page</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Suspense fallback={<LoadingCard />}>
        <LoginContent />
      </Suspense>
    </div>
  )
} 