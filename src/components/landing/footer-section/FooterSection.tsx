import { Zap } from 'lucide-react'

const footerLinks = [
  {
    heading: 'Product',
    links: ['How it works', 'Marketplace', 'Pricing', 'API docs', 'Changelog'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'Blog', 'Case studies', 'FAQ', 'Grid zone map'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact', 'Partners'],
  },
  {
    heading: 'Legal',
    links: [
      'Privacy policy',
      'Terms of use',
      'Cookie policy',
      'AML notice',
      'Complaints',
    ],
  },
]

export default function FooterSection() {

    return(
        <footer className="bg-sidebar px-8 py-12 text-sidebar-foreground lg:px-12 lg:py-16">
            
            <div className="mx-auto max-w-7xl">

                <div className="flex flex-row items-start justify-between">

                    <div>

                        <a href="#top" className="inline-flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
                            
                            <span className="flex size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                                <Zap
                                size={18}
                                strokeWidth={2.5}
                                aria-hidden="true"
                                />
                            </span>

                            GridX

                        </a>

                        <p className="mt-4 w-56 text-label-lg leading-6 text-sidebar-foreground/60">
                            Peer-to-peer energy trading for Dubai households and prosumers.
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-caption text-sidebar-foreground">
                            <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-xs font-medium text-sidebar-primary-foreground">
                                Beta
                            </span>

                            <span className="text-label-lg text-sidebar-foreground/40">v0.2.0 · Dubai, UAE</span>
                        </div>

                    </div>

                    <div className="flex flex-row items-center justify-between gap-16 px-30">

                        {footerLinks.map(({ heading, links }) => (
                        
                                <nav key={heading} aria-label={heading}>
                                    
                                    <h2 className="text-label-lg text-sidebar-foreground/30">
                                        {heading}
                                    </h2>

                                    <ul className="mt-4 space-y-3">
                                        
                                        {links.map((link) => (

                                            <li key={link}>

                                                <a href="#" className="text-label-lg text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sidebar-primary">
                                                    {link}
                                                </a>
                                                
                                            </li>

                                        ))}

                                    </ul>

                                </nav>

                        ))}

                    </div>                    

                </div>


                <div className="mt-16 flex flex-col gap-4 border-t border-sidebar-border pt-8 text-caption text-sidebar-foreground md:flex-row md:items-center md:justify-between">

                    <p>
                        © 2025 GridX Energy Technologies LLC · Dubai, UAE · All rights reserved
                    </p>

                    <p className="text-left md:text-right">
                        GridX is an independent platform and is not affiliated with or
                        endorsed by any utility, grid operator, or government authority.
                    </p>

                </div>

            </div>

        </footer>
    )

}
