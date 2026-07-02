import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Layers, Palette, RouteIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

const notes = [
  {
    title: 'Token-driven styling',
    description:
      'The demo uses GridX design-system tokens instead of TanStack starter colors.',
    icon: Palette,
  },
  {
    title: 'Base UI shadcn components',
    description:
      'Cards, badges, and action buttons now follow the updated Base UI component setup.',
    icon: Layers,
  },
  {
    title: 'TanStack routing',
    description:
      'The starter route structure remains intact while the visual layer is replaced.',
    icon: RouteIcon,
  },
]

function About() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-border-subtle bg-bg-surface">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              About this demo
            </Badge>

            <CardTitle className="max-w-3xl text-display-lg">
              A temporary GridX interface built on the final design direction.
            </CardTitle>

            <CardDescription className="max-w-3xl text-base leading-8">
              This page exists only to replace the default TanStack starter
              visuals. The actual GridX product content can be added later
              without carrying forward the old demo theme.
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
          {notes.map((note) => {
            const Icon = note.icon

            return (
              <Card
                key={note.title}
                className="border-border-subtle bg-bg-surface"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl border border-border-subtle bg-bg-elevated">
                    <Icon className="size-5 text-text-primary" />
                  </div>
                  <CardTitle className="text-heading-4">{note.title}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </section>
      </section>
    </main>
  )
}
