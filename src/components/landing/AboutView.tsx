import { ArrowLeft } from 'lucide-react';

import { Badge } from '#/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { useMarketing } from '#/hooks/useMarketing';
import { Link } from '@tanstack/react-router';

export default function AboutView() {
  const { about } = useMarketing();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-border-subtle bg-card">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              {about.badge}
            </Badge>

            <CardTitle className="max-w-3xl text-display-lg">
              {about.title}
            </CardTitle>

            <CardDescription className="max-w-3xl text-base leading-8">
              {about.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {about.notes.map((note) => {
            const Icon = note.icon;

            return (
              <Card key={note.title} className="border-border-subtle bg-card">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-border-subtle bg-secondary">
                    <Icon className="size-5 text-text-primary" />
                  </div>
                  <CardTitle className="text-heading-4">{note.title}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </section>
    </main>
  );
}
