"use client";

// Loading UI with slide-right exit is handled by LoadingOverlay in (mainBody)/layout.
// Return null so we don't double-show; the overlay shows on pathname change and slides right when ready.
const Loading: React.FC = () => null;

export default Loading;
