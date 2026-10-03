import { countries, countryCodes } from "#/data/profile";
import { Save } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export default function PersonalInformation() {
    return (
        <Card>
            <CardHeader className="border-b border-border">
                <CardTitle>Personal information</CardTitle>
                <CardDescription>
                    Keep your contact and regional details up to date.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-bg-elevated p-4">
                    <Avatar className="size-16 border-[3px] border-accent/30 bg-accent shadow-md ring-4 ring-accent/10">
                        <AvatarFallback className="bg-accent text-base font-bold text-accent-foreground">
                            N
                        </AvatarFallback>
                        <AvatarBadge
                            className="size-3.5 border-[3px] border-bg-elevated bg-feedback-success-icon"
                            aria-label="Online"
                        />
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate font-heading text-base font-semibold">
                            Name
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Prosumer · Individual Account
                        </p>
                        <p className="mt-1 text-xs font-medium text-feedback-success-text">
                            Online
                        </p>
                    </div>
                </div>

                <form className="space-y-5">
                    <FieldGroup>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                                <Input
                                    id="fullName"
                                    name="fullName"

                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                            </Field>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor='phone'>Phone</FieldLabel>
                                <div className="grid grid-cols-[124px_minmax(0,1fr)] gap-2">
                                    <Select
                                        name="countryCode"
                                    >
                                        <SelectTrigger
                                            aria-label="Country code"
                                            className="h-9 w-full"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countryCodes.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                    />
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='country'>Country / Region</FieldLabel>
                                <Select
                                    name="country"
                                >
                                    <SelectTrigger id="country" className="h-9 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
    )
}