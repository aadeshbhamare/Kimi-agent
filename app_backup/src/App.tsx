import { AppProvider, useApp } from '@/lib/store'
import { AppShell } from '@/components/AppShell'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Documents from '@/pages/Documents'
import Workflow from '@/pages/workflow/Workflow'
import Templates from '@/pages/Templates'
import Research from '@/pages/Research'
import Assistant from '@/pages/Assistant'
import Projects from '@/pages/Projects'
import Collaboration from '@/pages/Collaboration'
import History from '@/pages/History'
import Certificates from '@/pages/Certificates'

function Router() {
  const { section } = useApp()

  if (section === 'landing') return <Landing />

  const page = {
    dashboard: <Dashboard />,
    documents: <Documents />,
    workflow: <Workflow />,
    templates: <Templates />,
    research: <Research />,
    assistant: <Assistant />,
    projects: <Projects />,
    collaboration: <Collaboration />,
    history: <History />,
    certificates: <Certificates />,
  }[section]

  return <AppShell>{page}</AppShell>
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
