import { ThemeToggle } from './components/theme-toggle';
import { H1, P } from './components/typography';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Container>
        <Header />
        <div className="mb-8 flex items-center justify-between">
          <div>
            <H1>Welcome to CryptoDash</H1>
            <P>Dashboard for following crypto prices.</P>
          </div>
          <ThemeToggle />
        </div>
      </Container>
    </div>
  );
}

export default App;
