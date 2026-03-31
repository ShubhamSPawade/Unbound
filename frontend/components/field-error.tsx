export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-sm font-bold text-destructive" role="alert">
      {message}
    </p>
  )
}
