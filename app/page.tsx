import { initialUsers } from "@/data/initial-users"
import { initialCategories, initialArticles } from "@/data/initial-data"
import { initialAuditLog } from "@/data/initial-audit-log"
import KnowledgeBase from "@/knowledge-base"

export default function Home() {
  return (
    <KnowledgeBase
      initialUsers={initialUsers}
      initialCategories={initialCategories}
      initialArticles={initialArticles}
      initialAuditLog={initialAuditLog}
    />
  )
}
