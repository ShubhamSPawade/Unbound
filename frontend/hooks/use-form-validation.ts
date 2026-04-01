"use client"

import { useState, useCallback } from "react"

type Rules<T> = Partial<Record<keyof T, (value: string) => string | undefined>>

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      if (touched[field]) {
        const rule = rules[field]
        const error = rule ? rule(value) : undefined
        setErrors((prev) => ({ ...prev, [field]: error }))
      }
    },
    [rules, touched]
  )

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const rule = rules[field]
      const error = rule ? rule(values[field]) : undefined
      setErrors((prev) => ({ ...prev, [field]: error }))
    },
    [rules, values]
  )

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let valid = true
    for (const field in rules) {
      const rule = rules[field as keyof T]
      const error = rule ? rule(values[field as keyof T]) : undefined
      if (error) {
        newErrors[field as keyof T] = error
        valid = false
      }
    }
    setErrors(newErrors)
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])) as Partial<Record<keyof T, boolean>>)
    return valid
  }, [rules, values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = Object.keys(rules).every((field) => {
    const rule = rules[field as keyof T]
    return !rule || !rule(values[field as keyof T])
  })

  return { values, errors, touched, setValue, handleBlur, validate, reset, isValid }
}

// Common validation rules
export const validators = {
  required: (label = "This field") => (v: string) =>
    !v.trim() ? `${label} is required` : undefined,

  email: (v: string) =>
    !v.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Enter a valid email address"
      : undefined,

  minLength: (min: number, label = "This field") => (v: string) =>
    !v.trim()
      ? `${label} is required`
      : v.length < min
      ? `${label} must be at least ${min} characters`
      : undefined,

  phone: (v: string) =>
    !v.trim()
      ? "Phone number is required"
      : !/^[+]?[\d\s\-()]{8,15}$/.test(v)
      ? "Enter a valid phone number"
      : undefined,

  number: (label = "This field") => (v: string) =>
    !v.trim()
      ? `${label} is required`
      : isNaN(Number(v)) || Number(v) <= 0
      ? `${label} must be a positive number`
      : undefined,

  confirmPassword: (password: string) => (v: string) =>
    !v.trim()
      ? "Please confirm your password"
      : v !== password
      ? "Passwords do not match"
      : undefined,
}
