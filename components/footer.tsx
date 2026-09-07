export default function Footer() {
  const links = [
    { href: 'mailto:hey@hiesenbug.dev', label: 'Email' },
    { href: 'https://github.com/Arshdeep54', label: 'GitHub' },
    { href: 'https://linkedin.com/in/arshdeep54', label: 'LinkedIn' },
    { href: 'https://x.com/arshdeez_', label: 'X' },
  ];

  return (
    <footer className='max-w-[46rem] mx-auto px-6 pb-20'>
      <div className='flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-border'>
        <div className='flex flex-wrap gap-5'>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel='noopener noreferrer'
              className='text-sm text-muted-foreground hover:text-accent transition-colors'
            >
              {l.label}
            </a>
          ))}
        </div>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} Arshdeep Singh
        </p>
      </div>
    </footer>
  );
}
