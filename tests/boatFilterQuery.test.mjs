import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBoatFilters, writeBoatList, writeBoatRange } from "../src/lib/boatFilterQuery.ts";

test("an unfiltered brokerage URL shows all boat types with default ranges", () => {
  const filters = parseBoatFilters(new URLSearchParams());
  assert.deepEqual(filters.boatType, ["racer", "sport-cruiser", "cruiser", "power-boat"]);
  assert.deepEqual(filters.priceStatus, [0, 1000000]);
  assert.equal(filters.page, 1);
});

test("a shared brokerage URL restores every filter and pagination", () => {
  const params = new URLSearchParams("type=racer,cruiser&condition=pre-owned&manufacturer=X-Yachts&location=Denmark&price=100000-500000&year=1990-2025&length=90-300&beam=2-8&draft=1-4&displacement=1000-5000&power=100-300&vat=true&sort=Price%20%28Low%20to%20High%29&page=2");
  const filters = parseBoatFilters(params);
  assert.deepEqual(filters.boatType, ["racer", "cruiser"]);
  assert.deepEqual(filters.boatCondition, ["pre-owned"]);
  assert.deepEqual(filters.boatManufacturer, ["X-Yachts"]);
  assert.deepEqual(filters.boatLocation, ["Denmark"]);
  assert.deepEqual(filters.priceStatus, [100000, 500000]);
  assert.deepEqual(filters.yearBuiltStatus, [1990, 2025]);
  assert.deepEqual(filters.squareFeetStatus, [90, 300]);
  assert.deepEqual(filters.boatBeamStatus, [2, 8]);
  assert.deepEqual(filters.boatDraftStatus, [1, 4]);
  assert.deepEqual(filters.boatDisplacementStatus, [1000, 5000]);
  assert.deepEqual(filters.boatEnginePowerStatus, [100, 300]);
  assert.equal(filters.boatVatIncluded, true);
  assert.equal(filters.sortBy, "Price (Low to High)");
  assert.equal(filters.page, 2);
});

test("updates preserve unrelated query values and omit default filter values", () => {
  const params = new URLSearchParams("campaign=fall&page=3");
  writeBoatList(params, "condition", ["new", "pre-owned"]);
  writeBoatRange(params, "price", [0, 1000000]);
  assert.equal(params.get("campaign"), "fall");
  assert.equal(params.get("condition"), "new,pre-owned");
  assert.equal(params.has("price"), false);
  writeBoatList(params, "type", []);
  assert.deepEqual(parseBoatFilters(params).boatType, []);
  writeBoatList(params, "location", ["Haderslev, Denmark", "Amsterdam, Netherlands"]);
  assert.deepEqual(parseBoatFilters(params).boatLocation, ["Haderslev, Denmark", "Amsterdam, Netherlands"]);
  assert.deepEqual(parseBoatFilters(new URLSearchParams("location=Denmark,Netherlands")).boatLocation, ["Denmark", "Netherlands"]);
});

test("invalid ranges and page values fall back to safe defaults", () => {
  const filters = parseBoatFilters(new URLSearchParams("price=oops&year=NaN-2024&page=-3"));
  assert.deepEqual(filters.priceStatus, [0, 1000000]);
  assert.deepEqual(filters.yearBuiltStatus, [1900, 2030]);
  assert.equal(filters.page, 1);
});
