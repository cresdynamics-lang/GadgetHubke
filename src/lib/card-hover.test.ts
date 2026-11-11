import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { firstSleekHover, isSleekCardHover } from "./card-hover.ts";

describe("card hover sleek filter", () => {
  it("blocks open-screen marketing frames", () => {
    assert.equal(
      isSleekCardHover("/x/display_hero__abc_large_2x.webp", "/x/select.jpg"),
      false,
    );
    assert.equal(
      isSleekCardHover("/x/design_top_skyblue__abc.full.webp", "/x/select.jpg"),
      false,
    );
    assert.equal(
      isSleekCardHover("/x/ipad-air-witb-blue-11in-wifi-202405.jpg", "/x/select.jpg"),
      false,
    );
  });

  it("keeps side / back / camera product angles", () => {
    assert.equal(
      isSleekCardHover("/x/design_side_skyblue__abc.jpg", "/x/select.jpg"),
      true,
    );
    assert.equal(
      isSleekCardHover("/Gadget_Hub_Store_Angles/ipad-a16/blue-2.webp", "/Gadget_Hub_Store_Angles/ipad-a16/blue-1.webp"),
      true,
    );
    assert.equal(
      isSleekCardHover("/x/iphone-16_black_view2.full.webp", "/x/iphone-16_black_view1.full.webp"),
      true,
    );
  });

  it("picks the first sleek candidate", () => {
    assert.equal(
      firstSleekHover(
        [
          "/x/display_hero.webp",
          "/x/design_side_midnight.jpg",
          "/x/other-select.jpg",
        ],
        "/x/primary.jpg",
      ),
      "/x/design_side_midnight.jpg",
    );
  });
});
