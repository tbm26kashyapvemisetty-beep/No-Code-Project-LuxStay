"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Loader2 } from "lucide-react"
import { deleteUserAccount } from "@/lib/actions/user"

interface DeleteAccountDialogProps {
  userEmail: string
}

export function DeleteAccountDialog({ userEmail }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isConfirmValid = confirmText === "DELETE"

  async function handleDelete() {
    setLoading(true)

    const result = await deleteUserAccount()

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
      setLoading(false)
      return
    }

    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
    })

    // Redirect to home after a brief delay
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-destructive text-sm">The following will be deleted:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-destructive">
                <li>Your profile and account</li>
                <li>All your listings</li>
                <li>All your bookings</li>
                <li>All your favorites</li>
                <li>All uploaded images</li>
              </ul>
            </div>
            <div className="space-y-2 pt-4">
              <Label htmlFor="confirm-delete">
                Type <strong>DELETE</strong> to confirm
              </Label>
              <Input
                id="confirm-delete"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

