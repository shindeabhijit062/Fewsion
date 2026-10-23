// Profiles created while building or testing the product ("Demo Edits", "demo user", "Test Creator")
// must never appear in public directories or AI matches. Filter them out by name.
// Better long-term fix: an `is_test` flag on the profile tables.

export const isTestAccount = (name?: string | null): boolean => /^\s*(demo|test)\b/i.test(name ?? '');
