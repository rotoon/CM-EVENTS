import app from "../src/app";

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`
🦊 Events API is running at http://0.0.0.0:${PORT}

📚 Endpoints:
   GET  /               - API Info
   GET  /events         - List events
   GET  /events/:id     - Get event detail
   GET  /months         - List months
   GET  /stats          - Statistics
   GET  /search         - Search
   GET  /upcoming       - Upcoming events
   POST /scrape         - Trigger scrape
   GET  /scrape/status  - Scraper status
`);
});
