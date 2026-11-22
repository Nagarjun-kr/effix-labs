// Strict enquiry-form checks (lib/forms/rules.ts). Run: npm run test:brands
import assert from "node:assert/strict";
import { test } from "node:test";

import { checkCompany, checkEmail, checkMessage, checkName, checkPhone, checkWebsite } from "../lib/forms/rules.ts";

const ok = (p: unknown) => assert.equal(p, null);
const bad = (p: { error: string; suggestion?: string } | null, suggestion?: string) => {
  assert.ok(p, "expected a problem");
  if (suggestion !== undefined) assert.equal(p.suggestion, suggestion);
};

test("real emails pass", () => {
  for (const e of ["priya.sharma@gmail.com", "rahul@acmecorp.in", "hello@effixlabs.in", "a.b+c@yahoo.co.in", "me@mail.com", "x@gmx.com", "ceo@business.co.uk"]) ok(checkEmail(e));
});
test("typo domains get a one-click fix", () => {
  bad(checkEmail("priya@gmial.com"), "priya@gmail.com");
  bad(checkEmail("priya@gmail.co"), "priya@gmail.com");
  bad(checkEmail("priya@gmail.con"), "priya@gmail.com");
  bad(checkEmail("priya@gamil.com"), "priya@gmail.com");
  bad(checkEmail("priya@hotmial.com"), "priya@hotmail.com");
  bad(checkEmail("priya@yahoo.co"), "priya@yahoo.com");
  bad(checkEmail("priya@outlok.com"), "priya@outlook.com");
  bad(checkEmail("rahul@acmecorp.con"), "rahul@acmecorp.com");
  bad(checkEmail("priya @gmail.com"), "priya@gmail.com");
});
test("test and throwaway emails are rejected", () => {
  for (const e of ["test@test.com", "abc@gmail.com", "asdf@gmail.com", "name@example.com", "x@mailinator.com", "a@yopmail.com", "sarah@business.com", "user@company.com", "plain", "a@b", "a@@b.com", "a..b@gmail.com"]) bad(checkEmail(e));
});
test("phone numbers", () => {
  ok(checkPhone("98450 12345", "+91"));
  ok(checkPhone("", "+91"));
  bad(checkPhone("", "+91", true));
  bad(checkPhone("9999999999", "+91"));
  bad(checkPhone("1234567890", "+91"));
  bad(checkPhone("9876543210", "+91"));
  bad(checkPhone("98765 43210", "+91"));
  bad(checkPhone("5845012345", "+91"));
  bad(checkPhone("984501234", "+91"));
  bad(checkPhone("919845012345", "+91"), "9845012345");
  bad(checkPhone("09845012345", "+91"), "9845012345");
  bad(checkPhone("98abc12345", "+91"));
  ok(checkPhone("(415) 829-3746", "+1"));
  bad(checkPhone("0415829374", "+1"));
  ok(checkPhone("7911 123456", "+44"));
  ok(checkPhone("501234567", "+971"));
  ok(checkPhone("412345678", "+61"));
  ok(checkPhone("91234567", "+65"));
});
test("names", () => {
  for (const n of ["Priya", "Nagarjun", "Jean-Luc", "O'Brien", "Anne Marie", "José"]) ok(checkName(n));
  for (const n of ["test", "asdf", "a", "aaa", "John123", "Sarah Jenkins", "@@", "xyz"]) bad(checkName(n));
});
test("company, website, message", () => {
  ok(checkCompany("Effix Labs")); ok(checkCompany("3M India"));
  bad(checkCompany("test")); bad(checkCompany("Acme Labs")); bad(checkCompany("123"));
  ok(checkWebsite("")); ok(checkWebsite("effixlabs.in")); ok(checkWebsite("https://www.shop.co.in/about"));
  bad(checkWebsite("example.com")); bad(checkWebsite("my site")); bad(checkWebsite("effixlabs")); bad(checkWebsite("shop.con"), "shop.com");
  ok(checkMessage("We need help ranking our dental clinic in Bangalore on Google.", true));
  bad(checkMessage("", true)); bad(checkMessage("hi", true)); bad(checkMessage("test test test test", true)); bad(checkMessage("aaaaaaaaaaaaaaaaaaaaaa", true));
  ok(checkMessage("", false));
});
