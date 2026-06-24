async function test() {
  const ids = [
    "06781f0d-c688-4339-aa11-f13055da2464", // 30 Prompt
    "368626d4-bb28-4678-857d-cdfccea5fd56", // Checklist Publish
    "2312cbe3-4cca-457a-9bc3-b3341c55b6f8", // Checklist Build
    "7114347a-7570-449e-9bf6-5de07acd51dd", // Template AGENTS.md
    "6f52213f-7219-4603-a4ca-0505c6c089a2"  // Workbook brand
  ];

  for (const id of ids) {
    try {
      const res = await fetch('http://localhost:3000/api/freebie-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', resourceId: id })
      });
      const data = await res.json();
      console.log(`ID: ${id} -> downloadUrl: ${data.downloadUrl}`);
    } catch (e) {
      console.log(`Failed to fetch for ID: ${id}. Is dev server running? ${e.message}`);
    }
  }
}
test();
