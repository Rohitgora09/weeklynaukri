/**
 * Deduplicates leading repeats in titles that occur due to nested HTML span concatenation.
 * E.g., "SSC CGL Online SSC CGL Online Form 2026" -> "SSC CGL Online Form 2026"
 */
export function dedupeTitle(raw) {
  if (!raw) return '';
  const cleanRaw = raw.trim().replace(/\s+/g, ' ');
  const words = cleanRaw.split(' ');
  for (let w = Math.floor(words.length / 2); w >= 2; w--) {
    const lead = words.slice(0, w).join(' ');
    const rest = words.slice(w).join(' ');
    if (rest.startsWith(lead)) {
      return rest;
    }
  }
  return cleanRaw;
}

/**
 * Formats a Date or date string to a clean relative date: 'Today', 'Yesterday', '3d ago', '2w ago', or formatted date.
 */
export function formatRelativeDate(dateInput) {
  if (!dateInput) return 'Recent';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recent';
  
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / 86400000);
  
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
