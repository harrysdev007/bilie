import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ArrowDown, Check, Copy, Download, Menu, X, Sparkles, Volume2, VolumeX, Plus, Minus, PawPrint } from 'lucide-react';
import confetti from 'canvas-confetti';
import { community } from './config';
import './style.css';

const links = {
  official: 'https://www.macysinc.com/newsroom/news/news-details/2026/Macys-Kicks-Off-the-100-Day-Countdown-to-the-100th-Macys-Thanksgiving-Day-Parade/',
  interview: 'https://advertisingweek.com/aw360/news/meet-billie-brightpaw-the-new-macys-holiday-mascot/21150/',
  photo: 'https://www.goodhousekeeping.com/entertainment/a73476298/macys-thanksgiving-parade-balloons-2026/',
  plush: 'https://www.macys.com/shop/product/macys-100th-thanksgiving-day-parade-plush-billie-brightpaw-bear-macys-exclusive?ID=26594372',
};
const XLogo = () => <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.3-8.4L.8 2h6.4l4.5 5.9L18.9 2Zm-1.1 18h1.7L6.2 3.9H4.4L17.8 20Z"/></svg>;
function Star({ className = '', ...props }) { return <svg className={`star ${className}`} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}><path d="m50 2 13 31 34 3-26 23 8 34-29-18-29 18 8-34L3 36l34-3Z"/></svg>; }
function OutLink({href, children, className = '', ...props}) { return <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>; }
function Countdown() {
  const [left, setLeft] = useState(() => Math.max(0, Date.parse('2026-11-26T08:30:00-05:00') - Date.now()));
  useEffect(() => { const timer = setInterval(() => setLeft(Math.max(0, Date.parse('2026-11-26T08:30:00-05:00') - Date.now())), 1000); return () => clearInterval(timer); }, []);
  return <div className="countdown">{[[Math.floor(left / 86400000),'DAYS'],[Math.floor(left / 3600000) % 24,'HOURS'],[Math.floor(left / 60000) % 60,'MINS'],[Math.floor(left / 1000) % 60,'SECS']].map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}
function MemeStudio() {
  const captions = ['BIG BEAR ENERGY', 'IN BILLIE WE TRUST', 'JUST A BEAR ON SOLANA', 'THE PAW IS THE ALPHA'];
  const [caption, setCaption] = useState(captions[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function download() {
    setBusy(true); setError('');
    try {
      await document.fonts.ready;
      const photo = new Image(); photo.src = '/billie.png'; await photo.decode();
      const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1400;
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#f6eedc'; ctx.fillRect(0, 0, 1200, 1400); ctx.drawImage(photo, 0, 0, 1200, 1200);
      ctx.textAlign = 'center'; ctx.fillStyle = '#ee272d'; let fontSize = 100; ctx.font = `${fontSize}px Anton`;
      while (ctx.measureText(caption.toUpperCase()).width > 1080 && fontSize > 28) { ctx.font = `${--fontSize}px Anton`; }
      ctx.fillText(caption.toUpperCase(), 600, 1300); ctx.font = '800 30px "Bricolage Grotesque"'; ctx.fillStyle = '#25201e'; ctx.fillText('$BILLIE • FAN CULTURE ON SOLANA', 600, 1365);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); if (!blob) throw Error('Export unavailable');
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.download = 'billie-big-bear-energy.png'; a.href = url; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError('Something went wrong. Please try downloading again.'); } finally { setBusy(false); }
  }
  return <section className="meme-section section-pad" id="meme-lab"><div className="meme-copy"><p className="eyebrow"><Sparkles size={20}/> THE MEME DEPARTMENT</p><h2>MAKE SOME<br/><em>BEAR NOISE.</em></h2><p>Good memes travel. Give Billie something to take to the timeline.</p><div className="caption-options">{captions.map(c => <button key={c} className={caption === c ? 'selected' : ''} onClick={() => setCaption(c)}>{c}</button>)}</div><label htmlFor="caption">Or write your own</label><input id="caption" value={caption} maxLength={48} onChange={e => setCaption(e.target.value)} placeholder="YOUR BIG BEAR THOUGHT"/><button className="button red" onClick={download} disabled={busy || !caption.trim()}><Download size={21}/>{busy ? 'MAKING YOUR MEME...' : 'DOWNLOAD YOUR MEME'}</button>{error && <p role="alert">{error}</p>}</div><div className="meme-preview"><div className="tape"/><img src="/billie.png" alt="Billie wearing a red hat, surrounded by glowing red light" loading="lazy"/><div className="meme-caption">{caption || 'YOUR BIG BEAR THOUGHT'}</div><span>$BILLIE • FAN CULTURE ON SOLANA</span></div></section>;
}
function App() {
  const [menu, setMenu] = useState(false);
  const [launch, setLaunch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [faq, setFaq] = useState(0);
  const [sound, setSound] = useState(false);
  const audioRef = useRef(null);
  const dialogRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!launch) return;
    const previous = document.activeElement; document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    const handler = e => {
      if (e.key === 'Escape') setLaunch(false);
      if (e.key === 'Tab') { const items = dialogRef.current.querySelectorAll('a,button'); const first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    window.addEventListener('keydown', handler); return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; previous?.focus(); };
  }, [launch]);
  useEffect(() => () => { if (audioRef.current) audioRef.current.close(); }, []);
  function cheer() {
    if (!reduced) confetti({particleCount:100, spread:95, origin:{y:.65}, colors:['#ee272d','#fff2d7','#99d8f1','#ffd34d'], disableForReducedMotion:true});
    if (sound) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (Audio) { const ctx = audioRef.current ??= new Audio(); ctx.resume(); [523.25,659.25,783.99,1046.5].forEach((freq,i) => { const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = freq; gain.gain.setValueAtTime(.07,ctx.currentTime+i*.1); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.1+.35); osc.start(ctx.currentTime+i*.1); osc.stop(ctx.currentTime+i*.1+.35); }); }
    }
  }
  async function copy() { try { await navigator.clipboard.writeText(community.contract); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  const faqs = [
    ['Is this an official Macy’s coin?', 'No. $Billie is an independent fan project inspired by Billie Brightpaw. It is not affiliated with, endorsed by or sponsored by Macy’s. Character and parade rights belong to their respective owners.'],
    ['Where can I find the contract?', community.contract ? `The verified Solana contract is ${community.contract}. Always match the full address before interacting.` : 'The contract has not been announced on this site. Follow @BillieBrightpaw on X for updates. When it is available, the verified address and direct pump.fun link will appear here.'],
    ['What is the story behind the bear?', 'Billie Brightpaw is a new Macy’s character with a glowing paw and a red star. She is joining the 100th Thanksgiving Day Parade on November 26, 2026. Explore the linked sources in our field notes.'],
    ['What does owning $Billie give me?', 'This is a meme project built around fan culture. There are no promised returns, ownership rights in the character or claims on Macy’s merchandise or business. Meme coins are volatile and can lose all their value.'],
  ];
  return <><a className="skip-link" href="#main">Skip to content</a><div className="announcement"><Star/> NEW BEAR ON THE BLOCK. SAME SOLANA CHAOS. <Star/></div>
    <header><a href="#" className="brand" aria-label="$Billie home"><img src="/billie.png" alt=""/>$Billie<span className="brand-star">✦</span></a><nav aria-label="Main navigation" className={menu ? 'open' : ''}>{[['THE BEAR','#the-bear'],['THE PARADE','#the-parade'],['MEME LAB','#meme-lab']].map(([label,href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}</nav><div className="nav-actions"><OutLink href={community.x} className="social-button" aria-label="Billie on X"><XLogo/></OutLink><button className="button small" onClick={() => setLaunch(true)}>GET $BILLIE <ArrowUpRight size={20}/></button><button className="menu-toggle icon-button" aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div></header>
    <main id="main"><section className="hero"><div className="hero-grid"/><div className="hero-copy"><div className="pill"><i/> A LITTLE BEAR. A BIG SOLANA MOOD.</div><h1>BIG BEAR.<br/><span>BIGGER</span><br/>ENERGY<span className="period">.</span></h1><p>Meet <strong>$Billie.</strong> Red hat. Bright paw.<br/>The holiday spirit just found its wild side.</p><div className="hero-buttons"><button className="button dark" onClick={() => setLaunch(true)}>MEET $BILLIE <ArrowUpRight/></button><OutLink href={community.x} className="button outline"><XLogo/> JOIN THE PARADE</OutLink></div><div className="hero-bottom"><span className="solana-mark">≋</span> SOLANA NATIVE <span className="dot">✦</span> PUMP.FUN BOUND</div></div>
      <motion.div className="hero-art" initial={{opacity:0, y:25}} animate={{opacity:1,y:0}} transition={{duration:.8}}><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="hero-photo"><img src="/billie.png" alt="Billie Brightpaw in a red knitted hat and scarf with a glowing red aura" fetchPriority="high"/></div><div className="art-word">BRIGHTPAW</div><Star className="hero-star"/><div className="round-stamp"><span>100TH PARADE</span><strong>2026</strong><span>NEW YORK CITY</span></div><button className="bear-sticker" onClick={cheer} aria-label="Celebrate with Billie"><PawPrint size={25}/><span>PAW-SITIVELY<br/>ICONIC.</span><span className="sticker-spark">✦</span></button><div className="art-caption"><i/> WARNING: EXTREME COZY ENERGY</div></motion.div><a href="#the-bear" className="scroll-cue"><ArrowDown size={20}/> KEEP THE PARADE GOING</a></section>
      <div className="ticker" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>SMALL BEAR. BIG MAIN CHARACTER ENERGY. <Star/> $BILLIE ON SOLANA <Star/></span>)}</div></div>
      <section className="bear-section section-pad" id="the-bear"><div className="section-top"><p className="eyebrow">01 / THE LORE IS REAL</p><span className="handwritten">yes, that bear ↘</span></div><div className="bear-layout"><div className="field-photo"><div className="photo-label">SPOTTED: THE BIG BEAR HERSELF</div><img src="/billie-balloon.jpg" alt="The enormous Billie Brightpaw balloon inside Macy’s Parade Warehouse" loading="lazy"/><div className="photo-footer"><span>NEW JERSEY / PARADE WAREHOUSE</span><OutLink href={links.photo} aria-label="View the photo source"><ArrowUpRight/></OutLink></div><div className="photo-sticker">100%<br/>BEAR.</div></div><div className="bear-story"><h2>NOT YOUR<br/>AVERAGE<br/><em>TEDDY.</em><Star/></h2><p>Billie Brightpaw is Macy’s newest parade adventurer. A red hat, a matching scarf and one very special glowing paw.</p><p>Created for the 100th Thanksgiving Day Parade, she is bringing a little wonder to the big city. We are bringing that energy to Solana.</p><OutLink className="text-link" href={links.interview}>MEET THE ORIGINAL BILLIE <ArrowUpRight/></OutLink><div className="lore-points"><span><Star/> ONE GUIDING RED STAR</span><span><PawPrint size={22}/> ENDLESS MAIN CHARACTER ENERGY</span></div></div></div></section>
      <section className="parade-section section-pad" id="the-parade"><div className="parade-head"><div><p className="eyebrow">02 / SAVE THE DATE</p><h2>THE STREETS<br/>ARE <em>CALLING.</em></h2></div><div className="date-stamp"><strong>NOV 26</strong><span>2026 • NEW YORK CITY</span></div></div><div className="parade-line"><p>A new bear. A historic parade.<br/>Count down to Thanksgiving morning.</p><Countdown/></div><div className="parade-strip"><span><Star/> 100TH MACY’S THANKSGIVING DAY PARADE</span><OutLink href={links.official}>THE OFFICIAL STORY <ArrowUpRight size={22}/></OutLink></div><div className="skyline" aria-hidden="true">{[55,90,65,120,70,100,155,90,65,110,80,60,120,95,70,140,75,100,60,115,85,130].map((height,i)=><div style={{height}} key={i}/>)}</div></section>
      <section className="field-notes section-pad"><div className="section-top"><div><p className="eyebrow">03 / OUT IN THE WILD</p><h2>BEAR WITH US.<br/><em>THERE’S LORE.</em></h2></div><p className="notes-intro">Real character. Real parade.<br/>A whole lot of inspiration.</p></div><div className="editorial-grid"><OutLink href={links.photo} className="editorial-photo"><img src="/billie-merch.jpg" alt="Billie Brightpaw plush bears and parade merchandise on red display shelves" loading="lazy"/><span className="photo-overlay"><span>THE COZY TAKEOVER<br/><b>From the shelf<br/>to the timeline.</b></span><ArrowUpRight size={35}/></span></OutLink><div className="note-stack"><OutLink href={links.plush} className="note"><span className="note-number">01</span><div><h3>THE HUG IS REAL.</h3><p>Billie has her own Macy’s exclusive plush, complete with her signature red hat and scarf.</p><span className="source">MACY’S PRODUCT STORY <ArrowUpRight size={19}/></span></div></OutLink><OutLink href={links.interview} className="note blue-note"><span className="note-number">02</span><div><h3>FOLLOW THE RED STAR.</h3><p>Her glowing paw carries a red star, a little nod to the history of Macy’s and a guide for her adventures.</p><span className="source">THE CREATOR INTERVIEW <ArrowUpRight size={19}/></span></div></OutLink></div></div><p className="photo-credit">Photography: Marisa LaScala / Good Housekeeping. Character: Macy’s. Linked stories are independent sources, not token endorsements.</p></section>
      <MemeStudio/>
      <section className="launch-section section-pad" id="get-billie"><p className="eyebrow"><span className="status-dot"/> {community.contract ? 'THE PARADE IS ON' : 'THE PARADE IS FORMING'}</p><h2>ALL PAWS<br/><span>ON DECK.</span><Star/></h2><p>One little bear. A whole timeline of possibilities.<br/>Find your people. Bring your best memes.</p><div className="launch-buttons"><OutLink href={community.x} className="button cream"><XLogo/> FOLLOW @BILLIEBRIGHTPAW <ArrowUpRight/></OutLink><button className="button transparent" onClick={() => setLaunch(true)}>TOKEN DETAILS <ArrowUpRight/></button></div><div className="contract-box"><span>SOLANA CONTRACT</span>{community.contract ? <button onClick={copy}><span>{community.contract}</span>{copied ? <Check/> : <Copy/>}</button> : <strong>COMING SOON <span>✦</span></strong>}</div><span className="launch-note">{community.contract ? 'Always verify the full address.' : 'Launch details will be announced on X.'}</span></section>
      <section className="faq-section section-pad"><div><p className="eyebrow">A FEW BEAR ESSENTIALS</p><h2>GOOD<br/><em>QUESTIONS.</em></h2></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq ${faq === i ? 'expanded' : ''}`} key={q}><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i} aria-controls={`answer-${i}`}>{q}{faq === i ? <Minus/> : <Plus/>}</button><div id={`answer-${i}`} hidden={faq !== i}><p>{a}</p></div></div>)}</div></section>
    </main><footer><div className="footer-top"><a href="#" className="brand"><img src="/billie.png" alt=""/>$Billie<span className="brand-star">✦</span></a><p>STAY COZY. STAY CURIOUS.</p><OutLink href={community.x} className="social-button" aria-label="Billie on X"><XLogo/></OutLink></div><div className="footer-bottom"><span>© {new Date().getFullYear()} $BILLIE. BIG BEAR ENERGY.</span><p>Independent fan meme project. Not affiliated with Macy’s or its parade. No promised returns. Character rights belong to their owners.</p><button className="sound-button" onClick={() => setSound(!sound)} aria-pressed={sound}>{sound ? <Volume2 size={19}/> : <VolumeX size={19}/>} SOUND {sound ? 'ON' : 'OFF'}</button></div></footer>
    {launch && <div className="modal-backdrop" onClick={e => {if(e.target === e.currentTarget) setLaunch(false);}}><div className="launch-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="launch-title"><button className="close-modal icon-button" onClick={() => setLaunch(false)} aria-label="Close token details"><X/></button><img src="/billie.png" alt="Billie Brightpaw"/><p className="eyebrow">$BILLIE ON SOLANA</p><h2 id="launch-title">{community.contract ? 'THE BEAR IS HERE.' : 'GOOD THINGS\nTAKE A LITTLE PAW-TIENCE.'}</h2><p>{community.contract ? 'Match the full Solana address before interacting.' : 'The contract and direct pump.fun link have not been announced here yet. Get launch updates from our X account.'}</p>{community.contract && <button className="modal-contract" onClick={copy}>{community.contract}{copied ? <Check/> : <Copy/>}</button>}<OutLink className="button red" href={community.pumpUrl || community.x}>{community.pumpUrl ? 'VIEW ON PUMP.FUN' : 'FOLLOW THE LAUNCH ON X'}<ArrowUpRight/></OutLink><span className="modal-note">INDEPENDENT FAN PROJECT • ALWAYS VERIFY THE ADDRESS</span></div></div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
