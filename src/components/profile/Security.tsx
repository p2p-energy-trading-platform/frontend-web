import { LockKeyhole, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { PasswordInput } from "../ui/password-input";

export default function Security() {
    return (
        <Card>
            <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                    <LockKeyhole className="size-4 text-brand-primary" />
                    Security
                </CardTitle>
                <CardDescription>
                    Use a unique password you do not use elsewhere.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-5">
                    <FieldGroup>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field>
                                <FieldLabel htmlFor='name'>Current Password</FieldLabel>
                                <PasswordInput
                                    id="currentPassword"
                                    name="currentPassword"
                                    required
                                    minLength={8}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='name'>New Password</FieldLabel>
                                <PasswordInput
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    minLength={8}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='name'>Confirm Password</FieldLabel>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                />
                            </Field>
                        </div>
                        <Field orientation="horizontal">
                            <Button className="px-4">
                                <Save className="size-4" />
                                Save
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}