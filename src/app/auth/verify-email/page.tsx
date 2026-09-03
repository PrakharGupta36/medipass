import { Suspense } from "react";
import VerifyEmailContent from "./Verify-Email-Content";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020504] flex items-center justify-center">
          <div className="text-sm text-white/50">Loading…</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
