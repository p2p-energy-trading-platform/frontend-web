import { Gauge, PlugZap, Wifi } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { TextField } from '#/components/auth/AuthFields';
import { OptionCard, SelectField } from '#/components/auth/SignupControls';
import { Button } from '#/components/ui/button';
import type { SmartMeterStatus } from './types';

type MeterType = 'advanced' | 'standard';
type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'failed';

const gridZones = [
  'JLT Zone 4',
  'JLT Zone 3',
  'Dubai Marina',
  'JBR',
  'Business Bay',
  'Downtown Dubai',
  'DIFC',
  'Al Quoz',
];

export function SmartMeterStep({
  onComplete,
}: {
  onComplete: (status: SmartMeterStatus) => Promise<void> | void;
}) {
  const [meterType, setMeterType] = useState<MeterType>('advanced');
  const [serialNumber, setSerialNumber] = useState('');
  const [gridZone, setGridZone] = useState('');
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('idle');

  const isValid =
    Boolean(meterType) &&
    serialNumber.trim().length > 0 &&
    Boolean(gridZone) &&
    connectionStatus === 'connected';

  function runConnectionTest() {
    setConnectionStatus('testing');
    window.setTimeout(() => {
      const shouldFail =
        !serialNumber.trim() || serialNumber.toUpperCase().includes('FAIL');
      setConnectionStatus(shouldFail ? 'failed' : 'connected');
    }, 550);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid) void onComplete('pending');
  }

  const connectionMessage =
    connectionStatus === 'testing'
      ? 'Checking whether your meter is reachable…'
      : connectionStatus === 'connected'
        ? 'Your meter is reachable.'
        : connectionStatus === 'failed'
          ? 'Meter not reachable. Check the serial number and try again.'
          : 'Check your meter is reachable';

  return (
    <form className="flex flex-1 flex-col" noValidate onSubmit={submit}>
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="font-heading text-[28px] leading-9 font-bold text-text-primary">
            Connect your smart meter
          </h1>
          <p className="mt-2 text-[15px] leading-[22px] text-text-secondary">
            Link your DEWA meter for real-time generation and usage data. You
            can also do this later in Settings.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] leading-[18px] font-semibold text-text-secondary">
            Meter type
          </p>
          <div role="group" aria-label="Meter type" className="flex gap-3">
            <OptionCard
              title="DEWA Advanced"
              subtitle="Smart AMI meter"
              icon={Gauge}
              selected={meterType === 'advanced'}
              onClick={() => {
                setMeterType('advanced');
                setConnectionStatus('idle');
              }}
            />
            <OptionCard
              title="DEWA Standard"
              subtitle="Older digital meter"
              icon={PlugZap}
              selected={meterType === 'standard'}
              onClick={() => {
                setMeterType('standard');
                setConnectionStatus('idle');
              }}
            />
          </div>
        </div>

        <TextField
          id="meter-serial-number"
          label="Meter serial number"
          autoComplete="off"
          placeholder="e.g. DEWA-2024-XXXXXXXX"
          value={serialNumber}
          onChange={(event) => {
            setSerialNumber(event.target.value);
            setConnectionStatus('idle');
          }}
          hint="Found on the front of your meter or in your DEWA account."
          className="h-12 rounded-2xl"
        />

        <SelectField
          id="grid-zone"
          label="Grid zone"
          value={gridZone}
          onChange={setGridZone}
          placeholder="Select your zone"
          options={gridZones.map((zone) => ({ label: zone, value: zone }))}
        />

        <section
          aria-label="Connection test"
          className="flex min-h-16 items-center gap-3 rounded-2xl border border-border-input bg-bg-surface px-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background-well text-text-disabled">
            <Wifi className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 font-semibold text-text-primary">
              Connection test
            </p>
            <p
              role={connectionStatus === 'idle' ? undefined : 'status'}
              className={
                connectionStatus === 'connected'
                  ? 'text-xs leading-4 text-accent'
                  : connectionStatus === 'failed'
                    ? 'text-xs leading-4 text-destructive'
                    : 'text-xs leading-4 text-text-disabled'
              }
            >
              {connectionMessage}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={connectionStatus === 'testing'}
            onClick={runConnectionTest}
            className="h-9 rounded-xl px-4"
          >
            {connectionStatus === 'testing' ? 'Testing…' : 'Test'}
          </Button>
        </section>

        <Button
          type="submit"
          disabled={!isValid}
          className="h-[52px] w-full rounded-xl text-base font-semibold"
        >
          Save and enter GridX
        </Button>
      </div>

      <div className="mt-auto pt-6 pb-2 text-center">
        <button
          type="button"
          onClick={() => void onComplete('skipped')}
          className="text-sm leading-5 font-medium text-text-secondary hover:text-text-primary"
        >
          Skip for now, connect meter later in Settings
        </button>
      </div>
    </form>
  );
}
