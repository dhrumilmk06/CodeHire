export default function TrustedBySection() {
  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Stripe']

  return (
    <section className="bg-[#0a0a0a] py-16 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[#555555] text-sm mb-10 uppercase tracking-widest font-medium">
          Trusted by developers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {companies.map(company => (
            <span
              key={company}
              className="text-[#333333] text-xl font-black hover:text-[#555555] transition-colors duration-300 cursor-default select-none"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
