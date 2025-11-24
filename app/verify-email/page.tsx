import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 luxury-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📧 <strong>Check your spam folder</strong> if you don't see the email</p>
            <p>⏱️ The verification link will expire in <strong>24 hours</strong></p>
            <p>🔄 You can close this page once you've clicked the verification link</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button asChild className="w-full gold-gradient">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

