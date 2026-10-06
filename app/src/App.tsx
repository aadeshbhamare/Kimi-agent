import { AppProvider, useApp } from '@/lib/store'
import { AuthProvider } from '@/lib/auth'
import { AppShell } from '@/components/AppShell'
import { PageShowcaseBar } from '@/components/PageShowcaseBar'
import { Toaster } from 'sonner'
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
import ExperimentalResults from '@/pages/ExperimentalResults'
import Architecture from '@/pages/Architecture'
import Login from '@/pages/Login'

function Router() {
  const { section } = useApp()

  if (section === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <PageShowcaseBar />
        <div className="flex-1">
          <Login />
        </div>
      </div>
    )
  }

  if (section === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageShowcaseBar />
        <div className="flex-1">
          <Landing />
        </div>
      </div>
    )
  }

  const page = {
    login: <Login />,
    dashboard: <Dashboard />,
    documents: <Documents />,
    workflow: <Workflow initialStep={0} />,
    'workflow-upload': <Workflow initialStep={0} />,
    'workflow-analyze': <Workflow initialStep={1} />,
    'workflow-model': <Workflow initialStep={2} />,
    'workflow-editor': <Workflow initialStep={3} />,
    'workflow-generate': <Workflow initialStep={5} />,
    'workflow-validate': <Workflow initialStep={6} />,
    'workflow-export': <Workflow initialStep={7} />,
    templates: <Templates />,
    research: <Research />,
    assistant: <Assistant />,
    projects: <Projects />,
    collaboration: <Collaboration />,
    history: <History />,
    certificates: <Certificates />,
    results: <ExperimentalResults />,
    architecture: <Architecture />,
  }[section]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PageShowcaseBar />
      <div className="flex-1 min-h-0 overflow-hidden">
        <AppShell>{page}</AppShell>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </AuthProvider>
  )
}
