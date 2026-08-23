// Retired in v89.29.
//
// This historical v89.11 contract asserted the exact internal markup of the
// original, App.jsx-embedded How It Works page. The unified v89.28 system moved
// that implementation into shared data and reusable page/modal components, so
// those source-shape assertions became both obsolete and actively harmful.
//
// The maintained contract is now:
//   test/unifiedHowItWorksV8928.test.mjs
//
// Keep this compatibility marker so repositories that still contain the old
// filename do not fail CI. It intentionally contains no duplicate assertions.
console.log("Retired v89.11 How It Works contract; covered by unifiedHowItWorksV8928.test.mjs");
