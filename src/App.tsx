import { ThemeToggle } from './components/theme-toggle'
import { H1, P } from './components/typography'

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto p-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <H1>Crypto Dash</H1>
            <P>Dashboard for following crypto prices.</P>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default App
