import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="hero-band min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-eyebrow">The Visual Infrastructure Platform</p>
          <h1 className="text-display-xxl text-balance">
            Build a smarter city, visually.
          </h1>
          <p className="text-body-lg mx-auto">
            A national-scale platform for reporting, deduplicating, and
            prioritizing civic infrastructure issues using AI.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" className="text-white">
                Start Reporting
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="secondary">
                View Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="features" className="content-band bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-eyebrow mb-2">Platform Capabilities</p>
              <h2 className="text-display-lg">
                Everything you need to scale infrastructure.
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="hidden md:inline-flex text-button-md text-ink hover:underline"
            >
              Explore the Dashboard →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="category-purple" hover>
              <h3 className="text-display-sm mb-4">Intelligent Routing</h3>
              <p className="text-body-md opacity-90">
                Instantly categorize and route issues to the correct municipal
                officer. Potholes to public works, tree planting to parks.
              </p>
            </Card>

            <Card variant="category-pink" hover>
              <h3 className="text-display-sm mb-4">AI Deduplication</h3>
              <p className="text-body-md opacity-90">
                Automatically merges duplicate reports using semantic
                similarity. Prevent overflowing queues and consolidate citizen
                voices.
              </p>
            </Card>

            <Card variant="category-blue" hover>
              <h3 className="text-display-sm mb-4">Urgency Scoring</h3>
              <p className="text-body-md opacity-90">
                Machine learning models analyze severity, frequency, and
                location to bubble up the most critical issues to officers.
              </p>
            </Card>

            <Card variant="category-orange" hover>
              <h3 className="text-display-sm mb-4">Actionable Analytics</h3>
              <p className="text-body-md opacity-90">
                Track your city's performance. View resolution times, hotspot
                maps, and resource allocation in real time.
              </p>
            </Card>

            <Card variant="category-green" className="lg:col-span-2" hover>
              <h3 className="text-display-sm mb-4">National SDG Tracking</h3>
              <p className="text-body-md opacity-90">
                Map local improvements to global sustainable development goals.
                Transparent reporting for citizens and auditors alike.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Band */}
      <footer className="content-band border-t border-hairline py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-body-md-strong">CivicSolve</span>
          </div>
          <p className="text-body-sm text-mute">
            © 2026 CivicSolve. The visual infrastructure platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
