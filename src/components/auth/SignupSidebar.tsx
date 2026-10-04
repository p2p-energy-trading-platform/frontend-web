import {
  BarChart3,
  Check,
  FileCheck2,
  FileWarningIcon,
  Gauge,
  IdCard,
  MailCheck,
  RadioTower,
  ShieldCheck,
  UserRoundPlus,
  WalletCards,
  Zap,
} from 'lucide-react';
import type { KycStatus, SIGN_UP_STATES, SmartMeterStatus } from './types';
import { signInBenefits } from '#/data/auth';

interface SigupSidebarProps {
  view: SIGN_UP_STATES;
  step: number;
  kycStatus: KycStatus;
  meterStatus: SmartMeterStatus;
}

export default function SignupSidebar({
  view,
  step,
  kycStatus,
  meterStatus,
}: SigupSidebarProps) {
  function getIcon(iconView: SIGN_UP_STATES) {
    let iconValue = <FileWarningIcon />;
    switch (iconView) {
      case 'account':
        iconValue = <UserRoundPlus className="size-4" />;
        break;
      case 'verify-email':
        iconValue = <MailCheck className="size-4" />;
        break;
      case 'kyc':
        iconValue = <IdCard className="size-4" />;
        break;
      case 'smart-meter':
        iconValue = <IdCard className="size-4" />;
        break;
      case 'complete':
        iconValue = <FileCheck2 className="size-4" />;
    }

    return iconValue;
  }

  function getHeading(headingView: SIGN_UP_STATES) {
    let headingValue = 'Error';
    switch (headingView) {
      case 'account':
        headingValue = 'Start trading in minutes';
        break;
      case 'verify-email':
        headingValue = 'Verify your email address';
        break;
      case 'kyc':
        headingValue = 'Why we need to verify you';
        break;
      case 'smart-meter':
        headingValue = 'Bring your energy data online';
        break;
      case 'complete':
        headingValue = 'Your account is ready';
    }

    return headingValue;
  }

  function getDescription(descriptionView: SIGN_UP_STATES) {
    let descriptionValue = 'Error';
    switch (descriptionView) {
      case 'account':
        descriptionValue =
          'Your GridX account gives you access to the full peer-to-peer energy marketplace.';
        break;
      case 'verify-email':
        descriptionValue =
          'Email verification protects your account and confirms where GridX should send important trading updates.';
        break;
      case 'kyc':
        descriptionValue =
          'Identity verification is optional now, and helps GridX keep higher-value trades and payouts secure.';
        break;
      case 'smart-meter':
        descriptionValue =
          'A secure meter connection gives you live usage, generation data, and access to peer-to-peer trading.';
        break;
      case 'complete':
        descriptionValue =
          'All onboarding choices are saved. You can review verification and device status from your Profile.';
    }

    return descriptionValue;
  }

  return (
    <>
      <div className="absolute -top-32 right-0 size-100 rounded-full bg-accent/10 blur-[80px]" />
      {/* <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-chart-4/6 blur-[80px]" /> */}

      <div className="relative mx-auto flex h-full max-w-xl flex-col gap-5">
        <GridXBrand />

        <div className="flex size-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15 text-accent">
          {getIcon(view)}
        </div>

        <p className="mt-4 text-caption font-bold uppercase tracking-widest text-accent">
          Step {Math.min(step, 4)} of 4
        </p>

        <h2 className="mt-1 font-heading text-xl font-bold">
          {getHeading(view)}
        </h2>

        <p className="mt-2 text-sm leading-5.5 text-sidebar-foreground/70">
          {getDescription(view)}
        </p>

        <CustomSidebarContent
          view={view}
          kycStatus={kycStatus}
          meterStatus={meterStatus}
        />
      </div>
    </>
  );
}

function GridXBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Zap className="size-3.75 fill-current" />
      </span>

      <span className="font-heading text-lg font-bold text-white">GridX</span>
    </div>
  );
}

function CustomSidebarContent({
  view,
  kycStatus,
  meterStatus,
}: {
  view: SIGN_UP_STATES;
  kycStatus: KycStatus;
  meterStatus: SmartMeterStatus;
}) {
  switch (view) {
    case 'account':
      return <CreateAccountContent />;
    case 'verify-email':
      return <VerifyEmailContent />;
    case 'kyc':
      return <IdentityContent />;
    case 'smart-meter':
      return <SmartMeterContent />;
    case 'complete':
      return <FinalContent kycStatus={kycStatus} meterStatus={meterStatus} />;
  }
}

function CreateAccountContent() {
  return (
    <ul className="mt-6 space-y-3.5">
      {signInBenefits.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-3 text-sm text-sidebar-foreground/80"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border text-accent">
            <Icon className="size-3.5" />
          </span>

          {label}
        </li>
      ))}
    </ul>
  );
}

function VerifyEmailContent() {
  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <p className="text-sm font-semibold">What happens next?</p>

      <ol className="mt-4 space-y-3 text-sm text-sidebar-foreground">
        <li className="flex gap-3">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" />
          Enter the one-time code sent to your email.
        </li>

        <li className="flex gap-3">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" />
          Continue to KYC identity verification.
        </li>

        <li className="flex gap-3">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" />
          Connect your smart meter to complete onboarding.
        </li>
      </ol>
    </div>
  );
}

function IdentityContent() {
  return (
    <ul className="mt-7 space-y-3.5">
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <Gauge className="size-3.5" />
        </span>
        Unlock higher peer-to-peer trading limits
      </li>
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <WalletCards className="size-3.5" />
        </span>
        Enable secure wallet payouts
      </li>
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <ShieldCheck className="size-3.5" />
        </span>
        Documents are encrypted and reviewed securely
      </li>
    </ul>
  );
}

function SmartMeterContent() {
  return (
    <ul className="mt-7 space-y-3.5">
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <RadioTower className="size-3.5" />
        </span>
        Receive live consumption and generation readings
      </li>
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <BarChart3 className="size-3.5" />
        </span>
        Use real-time data for smarter trading decisions
      </li>
      <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-accent">
          <ShieldCheck className="size-3.5" />
        </span>
        Compatible with SMETS2 &amp; most SMETS1 meters
      </li>
    </ul>
  );
}

function FinalContent({
  kycStatus,
  meterStatus,
}: {
  kycStatus: KycStatus;
  meterStatus: SmartMeterStatus;
}) {
  return (
    <div className="mt-7 rounded-2xl border border-accent/20 bg-accent/6 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Email verified</p>
          <p className="mt-1 text-xs leading-5 text-sidebar-foreground/70">
            KYC status:{' '}
            {kycStatus === 'pending' ? 'Pending review' : 'Not submitted'}
            <br />
            Smart meter:{' '}
            {meterStatus === 'pending' ? 'Pending approval' : 'Skipped'}
          </p>
        </div>
      </div>
    </div>
  );
}
