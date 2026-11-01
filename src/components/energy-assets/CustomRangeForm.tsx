import { useMemo } from 'react';
import { revalidateLogic, useForm } from '@tanstack/react-form';

import { Button } from '#/components/ui/button';
import { Field, FieldError, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { MARKET_TIME_ZONE } from '#/data/currency';
import { customRangeSchema } from '#/features/iot/time-range';
import type { CustomDates } from '#/features/iot/time-range';
import { formatFieldError } from '#/lib/form-errors';

export function CustomRangeForm({
  value,
  onApply,
}: {
  value?: CustomDates;
  onApply: (dates: CustomDates) => void;
}) {
  const schema = useMemo(
    () => customRangeSchema(new Date(), MARKET_TIME_ZONE),
    [],
  );
  const form = useForm({
    defaultValues: value ?? { start: '', end: '' },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
    onSubmit: ({ value: dates }) => onApply(dates),
  });

  return (
    <form
      noValidate
      aria-label="Custom date range"
      className="flex flex-wrap items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {(['start', 'end'] as const).map((name) => (
        <form.Field key={name} name={name}>
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0}
              className="w-44"
            >
              <FieldLabel htmlFor={`range-${name}`}>
                {name === 'start' ? 'From' : 'To'}
              </FieldLabel>
              <Input
                id={`range-${name}`}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError
                errors={field.state.meta.errors.map(formatFieldError)}
              />
            </Field>
          )}
        </form.Field>
      ))}
      <Button type="submit" className="mt-6">
        Apply
      </Button>
    </form>
  );
}
