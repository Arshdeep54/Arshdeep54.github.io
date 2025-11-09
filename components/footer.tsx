import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='border-t border-border mt-12 sm:mt-20 py-8 sm:py-12 px-4 sm:px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12'>
          <div>
            <h4 className='font-medium mb-4'>Contact</h4>
            <a
              href='mailto:arsh9bl998@gmail.com'
              className='text-muted-foreground hover:text-foreground transition-colors text-sm'
            >
              arsh9bl998@gmail.com
            </a>
          </div>
          <div>
            <h4 className='font-medium mb-4'>Social</h4>
            <div className='space-y-2'>
              <a
                href='https://github.com/Arshdeep54'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                GitHub
              </a>
              <a
                href='https://linkedin.com/in/arshdeep-singh-326815292'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                LinkedIn
              </a>
              <a
                href='https://x.com/arshdeez_'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                X
              </a>
              <a
            href="https://drive.google.com/drive/folders/1lf9tlc-Yqi0cABihVkvecc711m3rgyYs"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Resume
          </a>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-4'>Pages</h4>
            <div className='space-y-2'>
              <Link
                href='/contact'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                Contact
              </Link>
              <Link
                href='/projects'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                Projects
              </Link>
              <Link
                href='/experience'
                className='block text-muted-foreground hover:text-foreground transition-colors text-sm'
              >
                Experience
              </Link>
            </div>
          </div>
        </div>
        <div className='text-center text-xs text-muted-foreground pt-6 sm:pt-8 border-t border-border'>
          <p>© 2025 Arshdeep Singh. Crafted with attention to detail.</p>
        </div>
      </div>
    </footer>
  );
}
