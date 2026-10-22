import React, { useEffect, useRef, useState } from 'react';

const navigation = ['about', 'research', 'publications', 'education', 'projects', 'honors', 'service', 'news', 'contact'];

function Prompt({ children }) {
  return <p className="prompt"><b>abhay@iitd</b>:~$ <span>{children}</span></p>;
}

function useReveal(id, onActive) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        onActive(id);
        observer.unobserve(node);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, onActive]);
  return [ref, visible];
}

function Section({ id, number, command, title, children, onActive, className = '' }) {
  const [ref, visible] = useReveal(id, onActive);
  return (
    <section id={id} ref={ref} className={`section ${visible ? 'is-visible' : ''} ${className}`}>
      <Prompt>{command}</Prompt>
      {title && <h2><span>§ {number}</span>{title}</h2>}
      {children}
    </section>
  );
}

function Entry({ date, title, meta, children }) {
  return <article className="entry"><div className="entry-date">{date}</div><div><h3>{title}</h3>{meta && <div className="entry-meta">{meta}</div>}{children && <div className="entry-description">{children}</div>}</div></article>;
}

function TypeLine() {
  const lines = ['Researcher in Privacy and Anonymity Systems', 'PhD scholar @ IIT Delhi'];
  const [line, setLine] = useState('');
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setLine(lines[0]); return undefined; }
    let cancelled = false, lineIndex = 0, charIndex = 0, deleting = false, timer;
    const tick = () => {
      if (cancelled) return;
      const current = lines[lineIndex];
      if (!deleting) {
        charIndex += 1; setLine(current.slice(0, charIndex));
        if (charIndex === current.length) { deleting = true; timer = setTimeout(tick, 3000); return; }
        timer = setTimeout(tick, charIndex % 8 === 0 ? 110 : 52);
      } else {
        charIndex -= 1; setLine(current.slice(0, charIndex));
        if (!charIndex) { deleting = false; lineIndex = (lineIndex + 1) % lines.length; timer = setTimeout(tick, 350); return; }
        timer = setTimeout(tick, 22);
      }
    };
    timer = setTimeout(tick, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);
  return <div className="role">{line}</div>;
}

function CommandLine() {
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');
  const destinations = Object.fromEntries(navigation.map((item) => [item, `#${item}`]));
  const external = { github: 'https://github.com/AbhayKabdwal', linkedin: 'https://www.linkedin.com/in/abhaykabdwal', youtube: 'https://www.youtube.com/@doctor_innovator', email: 'mailto:abhaykabdwal@gmail.com' };
  function run(event) {
    if (event.key !== 'Enter') return;
    const command = value.trim().toLowerCase().replace(/^(cd|open|cat|ls)\s+/, '');
    setValue('');
    if (!command || command === 'help') setResponse(`commands: ${[...navigation, ...Object.keys(external), 'clear'].join(', ')}`);
    else if (command === 'clear') setResponse('');
    else if (destinations[command]) { setResponse(`jumping to ${command}…`); window.location.hash = destinations[command]; }
    else if (external[command]) { setResponse(`opening ${command}…`); window.open(external[command], '_blank', 'noopener'); }
    else setResponse(`command not found: ${command}. Type help.`);
  }
  return <div className="command-box"><label htmlFor="command"><Prompt> </Prompt></label><input id="command" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={run} autoComplete="off" spellCheck="false" placeholder="try: help" aria-label="Terminal command" /><div className="command-response" aria-live="polite">{response}</div></div>;
}

export default function App() {
  const [active, setActive] = useState('about');
  return <div className="window">
    <header>
      <div className="titlebar"><span className="dot red" /><span className="dot amber" /><span className="dot green" /><span className="path">abhay@iitd: ~/academic</span><span className="status">online</span></div>
      <nav aria-label="Sections">{navigation.map((item) => <a className={active === item ? 'active' : ''} href={`#${item}`} key={item}>{item}</a>)}</nav>
    </header>
    <main>
      <Section id="about" command="man abhay" onActive={setActive} className="intro">
        <div className="manual"><span>ABHAY</span><span>Academic Manual</span><span>ABHAY</span></div>
        <div className="hero">
          <div className="portrait-frame"><img src="/Abhay.png" alt="Abhay Kabdwal" width="150" height="172" /></div>
          <div className="hero-copy"><div className="eyebrow">RESEARCH / PRIVACY / SYSTEMS</div><h1>Abhay Kabdwal</h1><TypeLine /><p className="affiliation"><b>PhD Scholar</b>, Department of Computer Science and Engineering<br />Advanced Networks Lab, Indian Institute of Technology Delhi<br />Advisor: <a href="https://www.piyushs.in/">Prof. Piyush Kumar</a><br />Co-advisor: <a href="https://www.devashishgosain.com/">Prof. Devashish Gosain</a></p><a className="button" href="/Resume_Abhay.pdf">Curriculum Vitae (PDF)</a></div>
        </div>
        <p className="bio">I am a PhD scholar at IIT Delhi, under supervision of Prof. Piyush Kumar Sharma (IIT Delhi) and Prof. Devashish Gosain (IIT Bombay), where I study how anonymous communication systems like Mixnets, TOR and VPNs can be attacked, measured and audited. I came to this area from quantum machine learning, cryptography and image processing, which shaped how I think about data security.</p>
      </Section>

      <Section id="research" number="01" command="cat research.md" title="Research" onActive={setActive}>
        <p className="abstract"><b>Abstract.</b> My work sits at the intersection of privacy, networking and security. Two projects are active.</p>
        <div className="research-grid"><article className="research-card"><div className="card-index">PROJECT 01</div><h3>Attacks on the Nym mixnet <em>active</em></h3><p>Analysing attacks on Nym, a mixnet that hides who talks to whom, including traffic analysis.</p></article><article className="research-card"><div className="card-index">PROJECT 02</div><h3>Auditing browser-extension VPNs <em>active</em></h3><p>Building an audit system to check what VPN browser extensions do with user traffic.</p></article></div>
        <div className="keywords">{['mixnets', 'anonymous communication', 'VPNs', 'traffic analysis', 'privacy', 'cryptography', 'quantum ML'].map((item) => <span key={item}>{item}</span>)}</div>
      </Section>

      <Section id="publications" number="02" command="ls publications/" title="Publications" onActive={setActive}><pre className="bib">% references.bib{`\n`}% 0 entries. Work on the projects above is in progress,{`\n`}% Stay tuned publications will be coming soon and fast.</pre></Section>

      <Section id="education" number="03" command="cat education.txt" title="Education" onActive={setActive}>
        <Entry date="Jul 2026 -" title="Ph.D., Computer Science and Engineering" meta="Indian Institute of Technology Delhi">Advanced Networks Lab. Advisor: Prof. Piyush Kumar.</Entry>
        <Entry date="2024 - 2026" title="M.Sc., Computer Science" meta="University of Delhi" />
        <Entry date="2022 - 2024" title="B.Sc. (Hons.), Computer Science" meta="Banaras Hindu University, Varanasi">CGPA 9.12 / 10.</Entry>
        <Entry date="2019 - 2021" title="Senior Secondary (Class XII)" meta="Jawahar Navodaya Vidyalaya, Nainital">92% (CBSE).</Entry>
      </Section>

      <Section id="projects" number="04" command={<>ls -l projects/ <small># <a href="https://drive.google.com/drive/folders/1BZ5m5t08Fws3e8CtWT7PkkUBqqhvIDdx?usp=drive_link">all reports</a></small></>} title="Past Research Projects" onActive={setActive}>
        <Entry date={<><i>[1]</i>Spring 2026</>} title="Quantum Encoding for Image Compression" meta={<>With Dr. Om Pal, University of Delhi</>}>Hybrid quantum-classical image compression research. <a href="https://drive.google.com/drive/folders/137Y0Op-a1qi3TdUz-ds_qLzwWR60osKK?usp=drive_link">[report]</a></Entry>
        <Entry date={<><i>[2]</i>Fall 2025</>} title="Evaluating Hybrid Quantum-Classical CNNs" meta={<>With Prof. Neelima Gupta and Dr. Om Pal, University of Delhi</>}>Evaluation of quantum-classical CNN architectures. <a href="https://drive.google.com/drive/folders/12UpYK9IEZS-ag_CyjOJ6VZCCQ908ZPVA?usp=drive_link">[report]</a></Entry>
        <Entry date={<><i>[3]</i>Spring 2025</>} title="Deep Learning Image Steganography" meta={<>Team project, University of Delhi</>}>Deep learning approach to image steganography. <a href="https://drive.google.com/drive/folders/1LY3Wl2A36f4a_WVRkuF9YZy7N9sizqPY?usp=drive_link">[report]</a></Entry>
        <Entry date={<><i>[4]</i>Fall 2024</>} title="Hybrid Movie Recommendation System" meta={<>Team project, University of Delhi</>}>Hybrid movie recommendation system. <a href="https://drive.google.com/drive/folders/1Te2F_IsJT9272mSJ7Vzu0EMNvVuHJhTv?usp=drive_link">[report]</a></Entry>
        <Entry date={<><i>[5]</i>Spring 2024</>} title="Automated Legal Document Summarizer" meta={<>With Dr. Anshul Verma, Banaras Hindu University</>}>Legal-document summarization research.</Entry>
      </Section>

      <Section id="honors" number="05" command="cat honors.txt" title="Honors and Awards" onActive={setActive}><Entry date="2025" title="UGC NET, Junior Research Fellowship">Qualified at the 99.89 percentile.</Entry><Entry date="2025, 2026" title="GATE, Computer Science and Engineering">Qualified in both years.</Entry><Entry date="2016 - 2019" title="National-level Yoga">Four times at the NVS National Games, and twice at the SGFI games representing NVS as a state.</Entry></Section>

      <Section id="service" number="06" command="cat service.txt" title="Service, Teaching and Skills" onActive={setActive}><Entry date="2024 -" title="Website Committee Member" meta="Department of Computer Science, University of Delhi">Maintain and update the department website.</Entry><Entry date="2022 - 2024" title="YouTube Videos">Video lectures that simplify core computer science topics. <a href="https://www.youtube.com/@doctor_innovator">[channel]</a></Entry><Entry date="Skills"><div className="skills">{['Python', 'C++', 'JavaScript', 'Git', 'Linux', 'LaTeX', 'Flask', 'HTML/CSS', 'DBMS'].map((item) => <span key={item}>{item}</span>)}</div></Entry><Entry date="Courses">Machine Learning Specialization, deeplearning.ai (Coursera).</Entry><Entry date="Off duty">Chess, calisthenics, gym, open source and tech blogging.</Entry></Section>

      <Section id="news" number="07" command="tail news.log" title="News" onActive={setActive}><div className="news-list"><p><span>Jul 2026</span>Joined IIT Delhi as a PhD scholar in CSE.</p><p><span>2026</span>Qualified GATE 2026 (CSE). Completed MSc at University of Delhi.</p><p><span>2025</span>Qualified UGC NET JRF at the 99.89 percentile, and GATE 2025 (CSE).</p></div></Section>

      <Section id="contact" number="08" command="contact --all" title="Contact" onActive={setActive}><p className="affiliation">Department of Computer Science and Engineering, IIT Delhi, New Delhi, India</p><div className="contact-links"><a href="mailto:abhaykabdwal@gmail.com">email</a><a href="https://github.com/AbhayKabdwal">github</a><a href="https://www.linkedin.com/in/abhaykabdwal">linkedin</a><a href="https://www.youtube.com/@doctor_innovator">youtube</a><a href="/Resume_Abhay.pdf">cv.pdf</a></div><CommandLine /></Section>
      <Prompt><span className="cursor" /></Prompt>
    </main>
    <footer><span>© 2026 Abhay Kabdwal · IIT Delhi · Last updated October 2026</span><span>pdflatex: 0 errors, 0 warnings</span></footer>
  </div>;
}
