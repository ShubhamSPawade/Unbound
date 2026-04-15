import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/club/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="border-4 border-foreground bg-card p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-4xl font-black">Event Not Found</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          The event you're trying to edit doesn't exist or has been deleted.
        </p>
        <Link href="/club/events">
          <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Back to My Events
          </Button>
        </Link>
      </div>
    </div>
  )
}
