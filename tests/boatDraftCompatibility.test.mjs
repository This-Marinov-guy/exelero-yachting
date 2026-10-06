import test from "node:test";
import assert from "node:assert/strict";
import { hasBoatDraftContent, mergeRecoveredImages, normalizeBoatDraftSnapshot } from "../src/lib/boatDraftCompatibility.ts";

test("restores an older browser form with its fields, media, and single brochure", () => {
  const draft = normalizeBoatDraftSnapshot({
    formData: { title: "Blue Water", price: "120000", draft: "1.8", vat_included: true },
    uploadedImages: [{ url: "https://example.com/boat.jpg", order: 0, name: "boat.jpg", filePath: "old/boat.jpg" }],
    uploadedBrochures: [],
    brochureUrl: "https://example.com/brochure.pdf",
    brochureFileName: "brochure.pdf",
    uploadFolderName: "old",
  });

  assert.equal(draft.formData.title, "Blue Water");
  assert.equal(draft.formData.price, "120000");
  assert.equal(draft.formData.draft, "1.8");
  assert.equal(draft.formData.vat_included, true);
  assert.equal(draft.uploadedImages[0].url, "https://example.com/boat.jpg");
  assert.equal(draft.uploadedBrochures[0].url, "https://example.com/brochure.pdf");
  assert.equal(draft.brochureFileName, "brochure.pdf");
  assert.equal(hasBoatDraftContent(draft), true);
});

test("restores a saved database draft with older media field names and numeric values", () => {
  const draft = normalizeBoatDraftSnapshot({
    id: "saved-draft",
    title: "Ocean 45",
    hull_length: 13.7,
    vat_included: false,
    images: [
      { link: "https://example.com/first.jpg", file_path: "old/first.jpg", media_type: "image" },
      { link: "https://youtu.be/abc", media_type: "video" },
    ],
    main_image_index: 1,
    brochure: "https://example.com/old.pdf",
    brochure_file_name: "old.pdf",
    upload_folder_name: "old",
  });

  assert.equal(draft.formData.title, "Ocean 45");
  assert.equal(draft.formData.hull_length, "13.7");
  assert.equal(draft.formData.keel_type, "Fin Keel");
  assert.equal(draft.uploadedImages[0].filePath, "old/first.jpg");
  assert.equal(draft.uploadedImages[1].mediaType, "video");
  assert.equal(draft.uploadedImages[1].sourceType, "link");
  assert.equal(draft.mainImageIndex, 1);
  assert.equal(draft.uploadedBrochures[0].name, "old.pdf");
});

test("storage recovery retains saved order and linked videos while adding missing files", () => {
  const existing = normalizeBoatDraftSnapshot({ images: [
    { url: "https://youtu.be/abc", mediaType: "video", sourceType: "link" },
    { url: "https://example.com/boat.jpg?token=old", mediaType: "image" },
  ] }).uploadedImages;
  const recovered = normalizeBoatDraftSnapshot({ images: [
    { url: "https://example.com/boat.jpg?token=new", filePath: "folder/boat.jpg" },
    { url: "https://example.com/extra.jpg", filePath: "folder/extra.jpg" },
  ] }).uploadedImages;

  const result = mergeRecoveredImages(existing, recovered);
  assert.deepEqual(result.map(item => item.url), ["https://youtu.be/abc", "https://example.com/boat.jpg?token=old", "https://example.com/extra.jpg"]);
  assert.equal(result[1].filePath, "folder/boat.jpg");
  assert.deepEqual(result.map(item => item.order), [0, 1, 2]);
});

test("empty defaults do not trigger a replace warning", () => {
  assert.equal(hasBoatDraftContent(normalizeBoatDraftSnapshot(null)), false);
  assert.equal(hasBoatDraftContent(normalizeBoatDraftSnapshot({ formData: { title: "Started" } })), true);
});
