type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean | undefined | null>

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = clsx(...input)
      if (nested) classes.push(nested)
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) classes.push(key)
      }
    }
  }

  return classes.join(" ")
}

function twMerge(...inputs: string[]): string {
  return inputs.filter(Boolean).join(" ")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

type CVAConfig = {
  variants?: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
  compoundVariants?: Array<Record<string, any> & { class: string }>
}

export function cva(base: string, config?: CVAConfig) {
  return (props?: Record<string, any>) => {
    if (!config) return base

    const classes = [base]
    const variants = config.variants || {}
    const defaultVariants = config.defaultVariants || {}

    // Apply variant classes
    for (const variantName in variants) {
      const variantValue = props?.[variantName] ?? defaultVariants[variantName]
      if (variantValue && variants[variantName][variantValue]) {
        classes.push(variants[variantName][variantValue])
      }
    }

    // Apply compound variants
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        const { class: compoundClass, ...conditions } = compound
        const matches = Object.entries(conditions).every(
          ([key, value]) => props?.[key] === value || defaultVariants[key] === value,
        )
        if (matches) {
          classes.push(compoundClass)
        }
      }
    }

    return cn(...classes, props?.className)
  }
}

export type VariantProps<T extends (...args: any) => any> = Partial<Parameters<T>[0]>
