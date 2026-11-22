import { useState } from 'react';
import { BadgeCheck, FileCheck2, Loader } from 'lucide-react';

import { KycStep } from '#/components/auth/KycStep';
import type { KycStatus } from '#/components/auth/types';
import { Alert, AlertDescription } from '#/components/ui/alert';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { useKycSubmission } from '#/features/kyc/hooks';

function stateLabel(state: string) {
  switch (state) {
    case 'VERIFIED':
      return 'Verified';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Pending review';
  }
}

function stateVariant(state: string) {
  return state === 'REJECTED' ? 'destructive' : 'secondary';
}

function KycSubmissionDetails({
  submission,
}: {
  submission: NonNullable<ReturnType<typeof useKycSubmission>['data']>;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Identity verification</p>
          <p className="mt-1 text-xs text-text-tertiary">
            Submitted {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={stateVariant(submission.state)}>
          {stateLabel(submission.state)}
        </Badge>
      </div>

      <dl className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-text-tertiary">Legal full name</dt>
          <dd className="mt-1 text-sm font-medium">{submission.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-tertiary">Date of birth</dt>
          <dd className="mt-1 text-sm font-medium">{submission.dateOfBirth}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-tertiary">NIC number</dt>
          <dd className="mt-1 text-sm font-medium">{submission.nicNumber}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-tertiary">Identity document</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium">
            <FileCheck2 className="size-4 text-accent" />
            Uploaded securely
          </dd>
        </div>
      </dl>

      {submission.state === 'REJECTED' && submission.rejectionReason ? (
        <Alert variant="destructive">
          <AlertDescription>{submission.rejectionReason}</AlertDescription>
        </Alert>
      ) : null}
      {submission.state === 'VERIFIED' ? (
        <p className="flex items-center gap-2 text-sm text-accent">
          <BadgeCheck className="size-4" />
          Your identity has been verified.
        </p>
      ) : null}
      <p className="text-xs text-text-tertiary">
        Submitted details are read-only and cannot be changed here.
      </p>
    </div>
  );
}

export default function KycSubmission() {
  const query = useKycSubmission();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Identity verification</CardTitle>
        <CardDescription>
          Review your submitted KYC information and verification status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {query.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-text-tertiary">
            <Loader className="size-4 animate-spin" />
            Loading your verification status...
          </p>
        ) : query.isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Could not load your KYC submission.{' '}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => void query.refetch()}
                disabled={query.isFetching}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : query.data ? (
          <KycSubmissionDetails submission={query.data} />
        ) : isSubmitting ? (
          <KycStep
            allowSkip={false}
            onComplete={async (_status: KycStatus) => {
              const refreshed = await query.refetch();
              if (refreshed.data) setIsSubmitting(false);
            }}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-text-secondary">
              You skipped identity verification during registration. Submit your
              details and ID document here whenever you are ready.
            </p>
            <Button type="button" onClick={() => setIsSubmitting(true)}>
              Submit KYC
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
