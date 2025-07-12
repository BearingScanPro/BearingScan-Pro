import { ScanLine } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center h-16 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ScanLine className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            BearingScan Pro
          </h1>
        </div>
      </div>
    </header>
  );
}
