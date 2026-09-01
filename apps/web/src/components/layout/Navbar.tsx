"use client";
import * as React from "react";
import { setRole } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function Navbar({ initialRole }: { initialRole: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    await setRole(newRole);
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full max-w-7xl mx-auto border-b border-hairline bg-canvas">
      <div className="w-full mx-auto px-3xl">
        <div className="flex h-[72px] items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
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
              <span className="text-display-xs tracking-[-0.02em]">
                Civic<span className="text-mute">Solve</span>
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink active>Products</NavLink>
              <NavLink>Solutions</NavLink>
              <NavLink>Resources</NavLink>
              <NavLink>Dashboard</NavLink>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="hidden sm:flex items-center border border-hairline rounded-sm px-3 py-2 bg-canvas hover:bg-black/5 transition-colors">
              <span className="text-eyebrow-sm text-mute mr-2 mt-0.5">
                Role:
              </span>
              <select
                value={initialRole}
                onChange={handleRoleChange}
                className="bg-transparent text-body-sm-strong outline-none cursor-pointer appearance-none pr-5 relative z-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23080808' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0px center",
                }}
              >
                <option value="CITIZEN">Citizen</option>
                <option value="OFFICER">Municipal Officer</option>
                <option value="ADMIN">National Admin</option>
                <option value="AUDITOR">Auditor</option>
              </select>
            </div>

            <button className="hidden sm:flex bg-primary text-on-primary text-button-md px-lg py-2 rounded-sm hover:opacity-90 transition-opacity">
              Get Started
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-ink"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink>Products</MobileNavLink>
            <MobileNavLink>Solutions</MobileNavLink>
            <MobileNavLink>Resources</MobileNavLink>
            <MobileNavLink>Dashboard</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`text-body-sm-strong px-3 py-2 rounded-sm cursor-pointer transition-colors ${
        active
          ? "text-ink bg-black/5"
          : "text-mute hover:text-ink hover:bg-black/5"
      }`}
    >
      {children}
    </span>
  );
}

function MobileNavLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md-strong text-ink px-3 py-3 rounded-sm hover:bg-black/5 cursor-pointer transition-colors">
      {children}
    </div>
  );
}
