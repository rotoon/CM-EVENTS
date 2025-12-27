export function formatEventTitle(category?: string, month?: string): string {
  let title = "What's On";
  if (category || month) {
    const parts = [];
    if (month) {
      const [year, monthNum] = month.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      parts.push(`${monthNames[parseInt(monthNum) - 1]} ${year}`);
    }
    if (category) parts.push(category.toUpperCase());
    title = parts.join(" • ");
  }
  return title;
}
