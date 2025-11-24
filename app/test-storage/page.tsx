"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestStoragePage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function testStorage() {
    setLoading(true)
    setResult("Testing...")
    
    try {
      const supabase = createClient()
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        setResult("❌ Not authenticated. Please sign in first.")
        setLoading(false)
        return
      }
      
      setResult(`✅ Authenticated as: ${user.email}\n\nChecking storage...`)
      
      // Try to list buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        setResult(prev => prev + `\n\n❌ Error listing buckets: ${bucketsError.message}`)
        setLoading(false)
        return
      }
      
      setResult(prev => prev + `\n\n✅ Found ${buckets?.length || 0} storage buckets`)
      
      // Check if listing-images bucket exists
      const listingBucket = buckets?.find(b => b.name === 'listing-images')
      
      if (!listingBucket) {
        setResult(prev => prev + `\n\n❌ 'listing-images' bucket NOT FOUND!`)
        setResult(prev => prev + `\n\n📝 Please run: supabase/storage-setup.sql in Supabase SQL Editor`)
        setLoading(false)
        return
      }
      
      setResult(prev => prev + `\n\n✅ 'listing-images' bucket exists!`)
      setResult(prev => prev + `\n   - Public: ${listingBucket.public}`)
      
      // Try to upload a test file
      const testFileName = `test-${Date.now()}.txt`
      const testFile = new Blob(['test'], { type: 'text/plain' })
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(testFileName, testFile)
      
      if (uploadError) {
        setResult(prev => prev + `\n\n❌ Upload test failed: ${uploadError.message}`)
        setLoading(false)
        return
      }
      
      setResult(prev => prev + `\n\n✅ Test upload successful!`)
      
      // Clean up test file
      await supabase.storage.from('listing-images').remove([testFileName])
      setResult(prev => prev + `\n✅ Test file cleaned up`)
      
      setResult(prev => prev + `\n\n🎉 Storage is configured correctly!`)
      
    } catch (error: any) {
      setResult(prev => prev + `\n\n❌ Unexpected error: ${error.message}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Storage Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testStorage} disabled={loading} className="gold-gradient">
            {loading ? "Testing..." : "Test Storage Configuration"}
          </Button>
          
          {result && (
            <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap font-mono">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

