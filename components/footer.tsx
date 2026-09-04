import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='border-t border-border py-14 sm:py-16 px-4 sm:px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid sm:grid-cols-3 gap-10'>
          <div>
            <p className='font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4'>
              Contact
            </p>
            <a
              href='mailto:hey@hiesenbug.dev'
              className='text-sm text-foreground hover:text-accent transition-colors'
            >
              hey@hiesenbug.dev
            </a>
          </div>
          <div>
            <p className='font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4'>
              Elsewhere
            </p>
            <div className='space-y-2'>
              <a
                href='https://github.com/Arshdeep54'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                GitHub
              </a>
              <a
                href='https://linkedin.com/in/arshdeep54'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                LinkedIn
              </a>
              <a
                href='https://x.com/arshdeez_'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                X
              </a>
            </div>
          </div>
          <div>
            <p className='font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4'>
              Site
            </p>
            <div className='space-y-2'>
              <Link
                href='/projects'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                Projects
              </Link>
              <Link
                href='/experience'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                Experience
              </Link>
              <Link
                href='/blogs'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                Blogs
              </Link>
              <Link
                href='/contact'
                className='block text-sm text-muted-foreground hover:text-accent transition-colors'
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className='mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3'>
          <p className='text-xs text-muted-foreground'>© {new Date().getFullYear()} Arshdeep Singh</p>
          <p className='font-mono text-[11px] uppercase tracking-widest text-muted-foreground'>
            Databases · Rust · Systems
          </p>
        </div>
      </div>
    </footer>
  );
}
