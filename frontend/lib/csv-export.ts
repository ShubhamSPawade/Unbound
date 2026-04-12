/**
 * Utility functions for exporting data to CSV format
 */

interface RegistrationRecord {
  id: number
  name: string
  email: string
  phone: string
  event: string
  eventId: number
  registeredAt: string
  status: string
}

/**
 * Converts an array of registration records to CSV format
 */
export function generateRegistrationCSV(registrations: RegistrationRecord[]): string {
  if (registrations.length === 0) {
    return "No registrations to export"
  }

  const headers = ["ID", "Name", "Email", "Phone", "Event", "Registered Date", "Status"]
  const rows = registrations.map((reg) => [
    reg.id,
    `"${reg.name}"`, // Quote name to handle special characters
    reg.email,
    `"${reg.phone}"`, // Quote phone to handle special characters
    `"${reg.event}"`, // Quote event to handle special characters
    reg.registeredAt,
    reg.status,
  ])

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

  return csvContent
}

/**
 * Downloads a CSV file with the given content
 */
export function downloadCSV(content: string, filename: string = "registrations.csv"): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the object URL
  URL.revokeObjectURL(url)
}

/**
 * Exports registrations to CSV and triggers download
 */
export function exportRegistrationsToCSV(
  registrations: RegistrationRecord[],
  eventName?: string
): void {
  const csv = generateRegistrationCSV(registrations)
  const timestamp = new Date().toISOString().split("T")[0]
  const filename = eventName
    ? `registrations-${eventName.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.csv`
    : `registrations-${timestamp}.csv`

  downloadCSV(csv, filename)
}
