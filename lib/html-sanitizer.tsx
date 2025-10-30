/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows only safe HTML tags and attributes
 */
export function sanitizeHtml(html: string): string {
  // Allow only safe tags
  const allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "code",
    "pre",
  ]
  const allowedAttributes: Record<string, string[]> = {
    a: ["href", "title", "target"],
  }

  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")

  // Parse and rebuild with allowed tags only
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    const tag = tagName.toLowerCase()

    if (!allowedTags.includes(tag)) {
      return ""
    }

    // For allowed tags, strip dangerous attributes
    if (allowedAttributes[tag]) {
      const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g
      let cleanMatch = `<${match.startsWith("</") ? "/" : ""}${tag}`
      let attrMatch

      while ((attrMatch = attrRegex.exec(match)) !== null) {
        const [, attrName, attrValue] = attrMatch
        if (allowedAttributes[tag].includes(attrName.toLowerCase())) {
          // Additional validation for href
          if (attrName.toLowerCase() === "href") {
            if (attrValue.startsWith("http://") || attrValue.startsWith("https://") || attrValue.startsWith("/")) {
              cleanMatch += ` ${attrName}="${attrValue}"`
            }
          } else {
            cleanMatch += ` ${attrName}="${attrValue}"`
          }
        }
      }

      return cleanMatch + ">"
    }

    return match
  })

  return sanitized
}
