// Join success tracking utilities
export function markJoinSuccess(): void {
  localStorage.setItem('mm_join_success', '1');
  
  // Add ?joined=1 to current URL without triggering navigation
  const url = new URL(window.location.href);
  url.searchParams.set('joined', '1');
  window.history.replaceState({}, '', url.toString());
}

export function shouldShowJoinSuccess(): boolean {
  // Check localStorage flag
  const hasFlag = localStorage.getItem('mm_join_success') === '1';
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasParam = urlParams.get('joined') === '1';
  
  return hasFlag || hasParam;
}

export function clearJoinSuccess(): void {
  // Remove localStorage flag
  localStorage.removeItem('mm_join_success');
  
  // Remove URL parameter
  const url = new URL(window.location.href);
  url.searchParams.delete('joined');
  window.history.replaceState({}, '', url.toString());
}