export default function LandingFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Logo column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                ⚡
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">CodeHire</div>
                <div className="text-[#555555] text-xs">Code Together</div>
              </div>
            </div>
            <p className="text-[#555555] text-sm leading-relaxed">
              The ultimate platform for collaborative coding interviews and pair programming.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'How it Works', 'Problem Bank', 'Pricing'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2a2a2a] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#555555] text-sm">© 2026 CodeHire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
              <a key={social} href="#" className="text-[#555555] hover:text-white text-sm transition-colors duration-200">
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
