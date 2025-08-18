'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Page() {
  useEffect(() => {
    // Setup smooth scroll behavior
    const setupSmoothScroll = () => {
      // Enable smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
        const handleClick = (e: Event) => {
          e.preventDefault();
          const href = (anchor as HTMLAnchorElement).getAttribute('href');
          const target = href ? document.querySelector(href) : null;
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        };
        anchor.addEventListener('click', handleClick);
      });
    };

    // Setup section animations
    const setupSectionAnimations = () => {
      // Animate sections on scroll
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Additional animations for specific elements within sections
        const cards = section.querySelectorAll('.outlined');
        cards.forEach((card, cardIndex) => {
          gsap.fromTo(
            card,
            {
              y: 40,
              opacity: 0,
              scale: 0.95,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
              delay: cardIndex * 0.1,
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      });

      // Special animation for navigation header
      gsap.fromTo(
        'header',
        {
          y: -80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    };

    // Initialize after DOM is loaded
    const timer = setTimeout(() => {
      setupSmoothScroll();
      setupSectionAnimations();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
      <SkipLink />
      <Header />
      <div
        id="content"
        className="px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full"
      >
        <Hero />
        <Proof />
        <Features />
        <EducationTimeline />
        <Skills />
        <Experience />
        <Contact />
      </div>
      <Footer />
      <CursorHUD />
    </main>
  );
}

// Fungsi untuk mendownload resume
const downloadResume = () => {
  const link = document.createElement('a');
  link.href = '/Profile.pdf';
  link.download = 'Rafly_Mahendra_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ---------------- Header with invert toggle ---------------- */
function Header() {
  const [inverted, setInverted] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    if (inverted) el.classList.add('invert');
    else el.classList.remove('invert');
  }, [inverted]);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-black">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-12 items-center gap-2">
        <a
          href="#content"
          className="col-span-6 sm:col-span-3 font-mono text-xs outlined px-2 py-1"
          aria-label="Home"
        >
          Rafly Mahendra
        </a>
        <ul className="hidden sm:flex col-span-6 gap-3 justify-center">
          {[
            ['Work', '#features'],
            ['Education', '#education'],
            ['Skills', '#skills'],
            ['Experience', '#experience'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                className="outlined px-2 py-1 text-sm hover:bg-black hover:text-white focus-visible:outline-2"
                href={href}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="col-span-6 sm:col-span-3 flex justify-end gap-2">
          <button
            onClick={() => setInverted((v) => !v)}
            className="outlined px-2 py-1 text-xs"
            aria-pressed={inverted}
            aria-label="Invert light/dark"
            title="Invert"
          >
            INVERT
          </button>
        </div>
      </nav>
    </header>
  );
}

function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 outlined bg-white px-3 py-2 text-sm z-50"
    >
      Skip to content
    </a>
  );
}

/* ---------------- Hero with live terminal typing ---------------- */
function Hero() {
  const headRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const termRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    // GSAP intro
    if (headRef.current && subRef.current) {
      gsap.fromTo(
        headRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        subRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' }
      );
    }

    // DIY typewriter for terminal background
    const el = termRef.current;
    if (!el) return;

    const lines = [
      '$ curl -s https://api.github.com/users/cypherpunkx/repos',
      '[',
      '  { "name": "go-gin-api", "language": "Go" },',
      '  { "name": "react-dashboard", "language": "TypeScript" },',
      '  { "name": "mysql-optimizer", "language": "JavaScript" }',
      ']',
      '$ _',
    ];

    let i = 0;
    let j = 0;
    let current = '';
    const append = () => {
      if (i >= lines.length) return;
      const line = lines[i];
      current += line[j] ?? '';
      el.textContent = current + (j < line.length ? '' : '\n');
      j++;
      if (j > line.length) {
        i++;
        j = 0;
        current += '\n';
      }
    };

    const id = window.setInterval(append, 12);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative my-12 sm:my-16 lg:my-24 grid grid-cols-12 gap-3">
      <div className="col-span-12 lg:col-span-7 relative z-10">
        <h1
          ref={headRef}
          className="text-5xl sm:text-7xl leading-none font-black tracking-tight outlined p-2"
        >
          Building Efficient & Scalable Technology Solutions.
        </h1>
        <p ref={subRef} className="mt-4 text-lg sm:text-xl outlined p-2">
          Junior Back-End Developer with a bold vision for the future of
          technology. Focused on developing modern web applications and scalable
          backend systems.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={downloadResume}
            className="outlined px-4 py-3 text-base font-medium hover:bg-black hover:text-white"
            aria-label="Get Resume"
          >
            Get Resume
          </button>
          <a
            href="#features"
            className="outlined px-4 py-3 text-base font-medium hover:bg-black hover:text-white"
            aria-label="View Work"
          >
            View Work
          </a>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5 relative min-h-[260px] sm:min-h-[320px]">
        <pre
          ref={termRef}
          aria-label="Live terminal demo"
          className="terminal absolute inset-0 overflow-auto p-4 text-sm"
        ></pre>
      </div>
    </section>
  );
}

/* ---------------- Proof: SVG logo wall ---------------- */
function Proof() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.logo-item');
      logos.forEach((logo, index) => {
        gsap.fromTo(
          logo,
          {
            scale: 0.5,
            opacity: 0,
            rotation: -10,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            delay: index * 0.08,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  const logos = useMemo(
    () => [
      'ACME',
      'OMEGA',
      'DELTA',
      'PRAGMA',
      'VOID',
      'ATLAS',
      'NOVUM',
      'SIGMA',
    ],
    []
  );

  return (
    <section
      ref={sectionRef}
      className="my-12 sm:my-16"
      aria-label="Proof / Logo Wall"
    >
      <div className="outlined p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
          {logos.map((label) => (
            <Logo key={label} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Logo({ label }: { label: string }) {
  return (
    <div className="logo-item flex items-center justify-center h-14 outlined-soft">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <rect
          x="1"
          y="1"
          width="198"
          height="58"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="22"
          fill="black"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ---------------- Features: 3 code cards with tabs ---------------- */
function Features() {
  return (
    <section id="features" className="my-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold outlined p-2 mb-6">
        Selected Projects: API Development
      </h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <CodeCard title="Fetch Projects" />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CodeCard title="Create Issue" variant="issue" />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <CodeCard title="Upload Asset" variant="upload" />
        </div>
      </div>
    </section>
  );
}

function CodeCard({
  title,
  variant = 'projects',
}: {
  title: string;
  variant?: 'projects' | 'issue' | 'upload';
}) {
  const [tab, setTab] = useState<'js' | 'py' | 'curl'>('js');
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => buildCode(tab, variant), [tab, variant]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="outlined p-0 grid grid-rows-[auto_1fr_auto] h-full">
      <div className="flex items-center justify-between border-b border-black px-3 py-2">
        <span className="font-mono text-sm">{title}</span>
        <div className="relative">
          <button
            onClick={copy}
            className="outlined px-2 py-1 text-xs"
            aria-label="Copy code"
          >
            COPY
          </button>
          {copied && (
            <span role="status" className="tooltip">
              Copied!
            </span>
          )}
        </div>
      </div>
      <div className="border-b border-black">
        <div role="tablist" aria-label={`${title} code tabs`} className="flex">
          <Tab id="js" active={tab === 'js'} onSelect={() => setTab('js')}>
            JS
          </Tab>
          <Tab id="py" active={tab === 'py'} onSelect={() => setTab('py')}>
            Python
          </Tab>
          <Tab
            id="curl"
            active={tab === 'curl'}
            onSelect={() => setTab('curl')}
          >
            cURL
          </Tab>
        </div>
      </div>
      <pre
        className="p-3 text-sm overflow-auto font-mono bg-white min-h-[220px]"
        aria-live="polite"
      >
        {code}
      </pre>
    </div>
  );
}

function Tab({
  id,
  active,
  onSelect,
  children,
}: {
  id: string;
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
      onClick={onSelect}
      className={`flex-1 px-2 py-1 outlined text-xs ${
        active ? 'bg-black text-white' : 'bg-white'
      }`}
    >
      {children}
    </button>
  );
}

function buildCode(
  tab: 'js' | 'py' | 'curl',
  v: 'projects' | 'issue' | 'upload'
) {
  const endpoint =
    v === 'projects'
      ? '/api/projects?limit=5'
      : v === 'issue'
      ? '/api/issues'
      : '/api/assets';
  if (tab === 'js') {
    if (v === 'upload')
      return `// JS (fetch)
const fd = new FormData();
fd.append('file', fileInput.files[0]);
const res = await fetch('${endpoint}', { method: 'POST', body: fd });
console.log(await res.json());`;
    if (v === 'issue')
      return `// JS (fetch)
const res = await fetch('${endpoint}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Bug: terminal flicker', priority: 'high' })
});
console.log(await res.json());`;
    return `// JS (fetch)
const res = await fetch('${endpoint}');
console.log(await res.json());`;
  }
  if (tab === 'py') {
    if (v === 'upload')
      return `# Python (requests)
import requests
files = { 'file': open('logo.svg','rb') }
r = requests.post('https://example.com${endpoint}', files=files)
print(r.json())`;
    if (v === 'issue')
      return `# Python (requests)
import requests
r = requests.post('https://example.com${endpoint}', json={
  'title': 'Bug: terminal flicker',
  'priority': 'high'
})
print(r.json())`;
    return `# Python (requests)
import requests
r = requests.get('https://example.com${endpoint}')
print(r.json())`;
  }
  // cURL
  if (v === 'upload')
    return `curl -X POST https://example.com${endpoint} \\
  -F "file=@logo.svg"`;
  if (v === 'issue')
    return `curl -X POST https://example.com${endpoint} \\
  -H 'Content-Type: application/json' \\
  -d '{"title":"Bug: terminal flicker","priority":"high"}'`;
  return `curl https://example.com${endpoint}`;
}

/* ---------------- Education Timeline ---------------- */
function EducationTimeline() {
  const items = [
    {
      year: '2017–2021',
      title: 'Bachelor of Engineering - Teknik Informatika/Computer Science',
      org: 'STMIK Indonesia Mandiri (IM)',
    },
    {
      year: 'Selesai',
      title: 'IPA (Ilmu Pengetahuan Alam)',
      org: 'SMA BPI 1 BANDUNG',
    },
  ];
  return (
    <section id="education" className="my-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold outlined p-2 mb-6">
        Education
      </h2>
      <ol className="grid grid-cols-12 gap-3">
        {items.map((it, idx) => (
          <li key={idx} className="col-span-12 lg:col-span-4 outlined p-3">
            <div className="text-xs font-mono text-neutral-600">{it.year}</div>
            <div className="text-lg font-bold">{it.title}</div>
            <div className="text-sm">{it.org}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Skills ---------------- */
function Skills() {
  const skillsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (skillsRef.current) {
      const skillCards = skillsRef.current.querySelectorAll('.skill-card');
      const skillItems = skillsRef.current.querySelectorAll('.skill-item');

      // Animate skill cards
      skillCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            x: index % 2 === 0 ? -60 : 60,
            opacity: 0,
            rotation: index % 2 === 0 ? -5 : 5,
          },
          {
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.7,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Animate individual skill items
      skillItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.8 + index * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  const groups = [
    {
      name: 'Programming',
      items: ['TypeScript', 'JavaScript', 'Go', 'Golang'],
    },
    { name: 'Database', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
    {
      name: 'Web Development',
      items: ['React', 'Node.js', 'Next.js', 'Tailwind CSS'],
    },
    {
      name: 'Backend & Tools',
      items: ['Gin Framework', 'Jenkins', 'NPM', 'Express.js'],
    },
  ];

  return (
    <section ref={skillsRef} id="skills" className="my-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold outlined p-2 mb-6">
        Skills
      </h2>
      <div className="grid grid-cols-12 gap-3">
        {groups.map((g) => (
          <div
            key={g.name}
            className="skill-card col-span-12 sm:col-span-6 lg:col-span-3 outlined p-3"
          >
            <div className="font-bold mb-2">{g.name}</div>
            <ul className="list-disc list-inside">
              {g.items.map((s) => (
                <li key={s} className="skill-item">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Experience ---------------- */
function Experience() {
  const roles = [
    {
      company: 'Knitto Group',
      role: 'Back End Developer',
      period: 'Maret 2024–Sekarang',
      bullets: [
        'Mengembangkan sistem backend yang efisien dan scalable.',
        'Implementasi API dengan Go dan framework Gin.',
      ],
    },
    {
      company: 'Enigma Camp',
      role: 'Training And Certification',
      period: 'Juli 2023–Oktober 2023',
      bullets: [
        'Mendalami fullstack development.',
        'Sertifikasi berbagai teknologi web modern.',
      ],
    },
    {
      company: 'GVFI Indonesia',
      role: 'System Administrator',
      period: 'Mei 2021–Desember 2022',
      bullets: [
        'Mengelola infrastruktur sistem dan database.',
        'Maintenance server dan troubleshooting sistem.',
      ],
    },
    {
      company: 'Rastek.ID',
      role: 'Frontend Web Developer',
      period: 'Juli 2020–November 2020',
      bullets: [
        'Mengembangkan antarmuka pengguna dengan teknologi modern.',
        'Kolaborasi dengan tim untuk menciptakan UX yang optimal.',
      ],
    },
  ];
  return (
    <section id="experience" className="my-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold outlined p-2 mb-6">
        Experience
      </h2>
      <div className="grid grid-cols-12 gap-3">
        {roles.map((r) => (
          <article
            key={r.company}
            className="col-span-12 lg:col-span-6 outlined p-3"
          >
            <header className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold">
                {r.role} · {r.company}
              </h3>
              <span className="font-mono text-xs">{r.period}</span>
            </header>
            <ul className="list-disc list-inside mt-2">
              {r.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const contactRef = useRef<HTMLElement>(null);
  const whatsappNumber = '6287802772712'; // Format internasional
  const defaultMessage =
    'Halo! Saya tertarik untuk berdiskusi tentang proyek atau peluang kerja sama.';

  useEffect(() => {
    if (contactRef.current) {
      // Animate main content
      const mainContent = contactRef.current.querySelector('.contact-main');
      const sidebar = contactRef.current.querySelector('.contact-sidebar');
      const contactCards = contactRef.current.querySelectorAll('.contact-card');

      if (mainContent) {
        gsap.fromTo(
          mainContent,
          {
            x: -80,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (sidebar) {
        gsap.fromTo(
          sidebar,
          {
            x: 80,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate contact cards
      contactCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: 0.4 + index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      type: 'Location',
      value: 'Bandung, Jawa Barat, Indonesia',
      icon: LocationIcon,
      action: null,
    },
    {
      type: 'Email',
      value: 'raflymhndra@gmail.com',
      icon: EmailIcon,
      action: () => window.open('mailto:raflymhndra@gmail.com'),
    },
    {
      type: 'WhatsApp',
      value: '+62 878-0277-2712',
      icon: WhatsAppIcon,
      action: openWhatsApp,
    },
    {
      type: 'LinkedIn',
      value: 'linkedin.com/in/raflymahendra',
      icon: LinkedInIcon,
      action: () =>
        window.open('https://www.linkedin.com/in/raflymahendra/', '_blank'),
    },
  ];

  return (
    <section ref={contactRef} id="contact" className="my-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold outlined p-2 mb-6">
        Let's Build Something Together
      </h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="contact-main col-span-12 lg:col-span-8 outlined p-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Ready to collaborate?</h3>
            <p className="text-base text-gray-700 mb-4">
              Saya selalu mencari peluang untuk berkolaborasi dalam
              proyek-proyek menarik. Mari kita diskusikan bagaimana kita bisa
              membangun sesuatu yang luar biasa bersama!
            </p>
          </div>
          <button
            onClick={openWhatsApp}
            className="outlined px-6 py-3 text-base font-medium hover:bg-black hover:text-white flex items-center gap-3"
            aria-label="Contact via WhatsApp"
          >
            {WhatsAppIcon}
            Chat di WhatsApp
          </button>
        </div>

        <div className="contact-sidebar col-span-12 lg:col-span-4">
          <div className="grid grid-cols-1 gap-3">
            {contactInfo.map((item) => (
              <div key={item.type} className="contact-card outlined p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs font-mono text-gray-600 mb-1">
                      {item.type}
                    </div>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-sm hover:underline text-left"
                        aria-label={`Contact via ${item.type}`}
                      >
                        {item.value}
                      </button>
                    ) : (
                      <div className="text-sm">{item.value}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="mt-16 border-t border-black">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-3">
        <nav className="col-span-12 md:col-span-8" aria-label="Site map">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Home', '#content'],
              ['Work', '#features'],
              ['Education', '#education'],
              ['Skills', '#skills'],
              ['Experience', '#experience'],
              ['Contact', '#contact'],
              ['Resume', 'javascript:void(0)'],
            ].map(([label, href]) => (
              <li key={href} className="outlined px-2 py-1">
                <a
                  className="block focus-visible:outline-2"
                  href={href}
                  onClick={
                    label === 'Resume'
                      ? (e) => {
                          e.preventDefault();
                          downloadResume();
                        }
                      : undefined
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-12 md:col-span-4 flex md:justify-end items-start gap-3">
          <a
            href="https://github.com/cypherpunkx"
            aria-label="GitHub"
            className="outlined p-2"
            target="_blank"
            rel="noreferrer"
          >
            {GitHubIcon}
          </a>
          <a
            href="https://www.linkedin.com/in/raflymahendra/"
            aria-label="LinkedIn"
            className="outlined p-2"
            target="_blank"
            rel="noreferrer"
          >
            {LinkedInIcon}
          </a>
          <a
            href="tel:087802772712"
            aria-label="Phone"
            className="outlined p-2"
            target="_blank"
            rel="noreferrer"
          >
            {PhoneIcon}
          </a>
        </div>
      </div>
      <div className="text-center text-xs font-mono py-3 border-t border-black">
        © {new Date().getFullYear()} Rafly Mahendra - Back-End Developer
      </div>
    </footer>
  );
}

/* ---------------- Cursor HUD (grid coordinates) ---------------- */
function CursorHUD() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current!;
    let isVisible = false;

    const handler = (e: MouseEvent) => {
      const vw = window.innerWidth;
      const colWidth = vw / 12;
      const col = Math.min(
        12,
        Math.max(1, Math.floor(e.clientX / colWidth) + 1)
      );
      const row = Math.max(1, Math.floor(e.clientY / 32) + 1); // rows at 32px

      gsap.to(el, {
        x: e.clientX + 12,
        y: e.clientY + 12,
        duration: 0.1,
        ease: 'power2.out',
      });

      el.textContent = `(${col},${row})`;

      // Show/hide animation
      if (!isVisible) {
        isVisible = true;
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: 'back.out(1.7)',
        });
      }
    };

    const hideHandler = () => {
      if (isVisible) {
        isVisible = false;
        gsap.to(el, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseleave', hideHandler);

    return () => {
      window.removeEventListener('mousemove', handler);
      window.removeEventListener('mouseleave', hideHandler);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-hud opacity-0">
      (1,1)
    </div>
  );
}

/* ---------------- SVG Icons ---------------- */
const GitHubIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5A5.4 5.4 0 0 0 19.5 3 5 5 0 0 0 19 3s-1.5 0-3 2a11.7 11.7 0 0 0-6 0C7.5 3 6 3 6 3a5 5 0 0 0-.5 3.5C5 9 8 11 11 11a4.8 4.8 0 0 0-1 3.5v4" />
    <path d="M9 18c-4.5 2-5-2-7-2" />
  </svg>
);

const LinkedInIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PhoneIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const LocationIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EmailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
