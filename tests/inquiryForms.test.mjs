import test from "node:test";
import assert from "node:assert/strict";
import { validateInquiry } from "../src/lib/inquiryValidation.ts";

const contact = {
  name: "Form Test",
  email: "form-test@example.invalid",
  phone: "+31 20 123 4567",
  message: "Please contact me about this yacht.",
};

test("boat inquiry accepts valid contact details and rejects invalid email", () => {
  const valid = validateInquiry(contact);
  assert.deepEqual(valid.data, { ...contact, answers: {} });
  const invalid = validateInquiry({ ...contact, email: "invalid" });
  assert.equal(invalid.field, "email");
});

test("partner inquiry validates required custom fields and allowed choices", () => {
  const fields = [
    { id: "occasion", label: "Occasion", type: "select", required: true, options: ["Cruise", "Event"] },
  ];
  assert.equal(validateInquiry(contact, fields).field, "occasion");
  assert.equal(validateInquiry({ ...contact, occasion: "Other" }, fields).field, "occasion");
  assert.deepEqual(validateInquiry({ ...contact, occasion: "Cruise" }, fields).data?.answers, { occasion: "Cruise" });
});
