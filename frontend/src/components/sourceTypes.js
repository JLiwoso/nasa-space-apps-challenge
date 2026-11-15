// Types de chunks renvoyés par le backend (champ `type`) -> icône + libellé
import { FileText, Globe, Database, BookOpen } from 'lucide-react'

export const SOURCE_TYPES = {
  pdf: { icon: FileText, label: 'PDF' },
  web: { icon: Globe, label: 'Web' },
  psi: { icon: Database, label: 'NASA PSI' },
  psi_resource: { icon: BookOpen, label: 'PSI resource' },
}

export const typeOf = (type) => SOURCE_TYPES[type] || SOURCE_TYPES.web