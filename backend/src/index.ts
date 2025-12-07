console.log("🚀 Starting QuiltPlannerPro Backend...");

(async () => {
  try {
    console.log("📦 Loading serverSetup.ts...");
    await import("./serverSetup");
  } catch (err) {
    console.error("❌ SERVER CRASH BEFORE START:", err);
  }
})();
