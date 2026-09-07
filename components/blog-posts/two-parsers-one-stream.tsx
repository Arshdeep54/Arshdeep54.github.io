import { Lede, H2, P, Pull, Note, Fig, CodePanel, Table, Closing, Sources } from "@/components/blog-prose"

const ARROW = (
  <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
  </marker>
)

export default function TwoParsersOneStream() {
  return (
    <>
      <Lede>
        Every request your browser makes to a production site almost never reaches the application directly. It
        goes through a reverse proxy first, nginx, HAProxy, a cloud load balancer, and only then to the actual
        server. That extra hop feels invisible, until you realize the proxy and the backend are two completely
        different programs, and the only thing they actually share is a stream of raw bytes. Nothing forces them
        to agree on where one request in that stream stops and the next one starts.
      </Lede>

      <H2>The setup</H2>
      <P>
        Client talks HTTPS to the proxy. The proxy decrypts it, that&apos;s TLS termination, and forwards the
        request onward as plain HTTP over the internal network. That&apos;s the setup that matters here: two
        separate programs, and the second one only ever sees what the first one hands it.
      </P>

      <Fig caption="Figure 1. Client sees only the proxy. Past that point, everything is plain HTTP, and two independent programs now have to parse it the same way.">
        <svg viewBox="0 0 720 150" role="img" className="w-full h-auto text-muted-foreground" aria-label="Client sends an HTTPS request to a reverse proxy. The proxy decrypts it, then forwards plain HTTP to one of several backend servers.">
          <defs>{ARROW}</defs>
          <rect x="10" y="55" width="100" height="40" rx="4" fill="none" stroke="currentColor" />
          <text x="60" y="79" textAnchor="middle" className="font-mono" fontSize="12" fill="currentColor">client</text>

          <line x1="110" y1="68" x2="260" y2="68" className="text-accent" stroke="currentColor" strokeWidth="1.6" markerEnd="url(#ar)" />
          <text x="185" y="60" textAnchor="middle" className="font-mono text-accent" fontSize="10" fill="currentColor">HTTPS, encrypted</text>

          <rect x="260" y="45" width="130" height="60" rx="5" className="text-accent" fill="none" stroke="currentColor" />
          <text x="325" y="70" textAnchor="middle" className="font-mono text-accent" fontSize="12" fill="currentColor">reverse proxy</text>
          <text x="325" y="88" textAnchor="middle" className="font-mono text-accent" fontSize="9.5" fill="currentColor" opacity=".85">decrypts here</text>

          <line x1="390" y1="60" x2="520" y2="35" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />
          <line x1="390" y1="75" x2="520" y2="75" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />
          <line x1="390" y1="90" x2="520" y2="115" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />
          <text x="455" y="24" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10" fill="currentColor">plain HTTP</text>

          <rect x="520" y="20" width="130" height="34" rx="4" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="585" y="41" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">backend A</text>
          <rect x="520" y="58" width="130" height="34" rx="4" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="585" y="79" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">backend B</text>
          <rect x="520" y="96" width="130" height="34" rx="4" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="585" y="117" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">backend C</text>
        </svg>
      </Fig>

      <H2>One pipe, many requests</H2>
      <P>
        Why not just open a fresh TCP connection for every request? Because the handshake cost adds up fast once
        you&apos;re past a handful of requests a second. So proxies reuse one connection to the backend, called
        keep-alive, and send many different clients&apos; requests down it, one after another. Which means the
        backend has to know exactly where request one ends before it starts reading request two off the same
        stream.
      </P>

      <Fig caption="Figure 2. Three requests, one shared connection. If the proxy and the backend ever disagree about where request A ends, the next read starts partway into someone else's request, that mechanism is what the rest of this post is about.">
        <svg viewBox="0 0 740 175" role="img" className="w-full h-auto text-muted-foreground" aria-label="Three clients each send a request to the proxy, which queues all three back to back on one reused connection to the backend.">
          <defs>{ARROW}</defs>
          <rect x="10" y="14" width="80" height="30" rx="3" fill="none" stroke="currentColor" strokeOpacity=".6" />
          <text x="50" y="34" textAnchor="middle" className="font-mono" fontSize="10.5" fill="currentColor">client A</text>
          <rect x="10" y="60" width="80" height="30" rx="3" fill="none" stroke="currentColor" strokeOpacity=".6" />
          <text x="50" y="80" textAnchor="middle" className="font-mono" fontSize="10.5" fill="currentColor">client B</text>
          <rect x="10" y="106" width="80" height="30" rx="3" fill="none" stroke="currentColor" strokeOpacity=".6" />
          <text x="50" y="126" textAnchor="middle" className="font-mono" fontSize="10.5" fill="currentColor">client C</text>

          <line x1="90" y1="29" x2="150" y2="60" stroke="currentColor" strokeOpacity=".5" markerEnd="url(#ar)" />
          <line x1="90" y1="75" x2="150" y2="68" stroke="currentColor" strokeOpacity=".5" markerEnd="url(#ar)" />
          <line x1="90" y1="121" x2="150" y2="76" stroke="currentColor" strokeOpacity=".5" markerEnd="url(#ar)" />

          <rect x="150" y="46" width="90" height="44" rx="4" className="text-accent" fill="none" stroke="currentColor" />
          <text x="195" y="72" textAnchor="middle" className="font-mono text-accent" fontSize="11" fill="currentColor">proxy</text>

          <line x1="240" y1="68" x2="380" y2="68" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />
          <text x="310" y="58" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="9.5" fill="currentColor">one connection</text>

          <rect x="380" y="52" width="90" height="32" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="425" y="72" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10.5" fill="currentColor">req A</text>
          <rect x="470" y="52" width="90" height="32" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="515" y="72" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10.5" fill="currentColor">req B</text>
          <rect x="560" y="52" width="90" height="32" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="605" y="72" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10.5" fill="currentColor">req C</text>
          <text x="515" y="105" textAnchor="middle" className="font-mono" fontSize="10" fill="currentColor" opacity=".75">queued back to back, same reused connection</text>

          <line x1="650" y1="68" x2="706" y2="68" stroke="currentColor" strokeOpacity=".6" markerEnd="url(#ar)" />
          <rect x="706" y="46" width="26" height="44" rx="3" fill="none" stroke="currentColor" strokeOpacity=".6" />
          <text x="719" y="72" textAnchor="middle" className="font-mono" fontSize="16" fill="currentColor">B</text>
        </svg>
      </Fig>

      <H2>Two ways to say &ldquo;this is where the body ends&rdquo;</H2>
      <P>
        Think of it like two people transcribing the same phone call, but using different rules for where one
        sentence ends and the next begins. Most of the time they land in the same place. HTTP hands you two
        different headers for telling a server how long a request body is, and this is the seam the whole attack
        lives in.
      </P>

      <Table
        head={["Header", "What it means"]}
        rows={[
          [<code key="1">Content-Length: 13</code>, "The body is exactly 13 bytes. Read that many and stop."],
          [
            <code key="2">Transfer-Encoding: chunked</code>,
            <>The body arrives in labeled chunks. A chunk labeled size <code>0</code> means &ldquo;last one, stop here.&rdquo;</>,
          ],
        ]}
      />

      <P>
        Nothing stops a client from sending both headers in the same request. The spec says{" "}
        <code>Transfer-Encoding</code> should win when both show up, but not every server actually implements
        that rule, some older or misconfigured ones still trust <code>Content-Length</code> regardless. That
        mismatch, one side trusting a header the other one ignores, is the entire vulnerability:{" "}
        <strong className="text-foreground">request smuggling</strong>, sometimes called a desync attack, because
        the two parsers fall out of sync about where they are in the stream.
      </P>

      <H2>Watching it happen, byte by byte</H2>
      <P>
        Here&apos;s a single request that a proxy and a backend can read completely differently. Security research
        on this usually calls the two sides <strong className="text-foreground">front-end</strong> (the proxy)
        and <strong className="text-foreground">back-end</strong> (the actual server), so that&apos;s the naming
        this section uses too. This particular flavor is called{" "}
        <strong className="text-foreground">CL.TE</strong>: the front-end trusts <code>Content-Length</code>, the
        back-end trusts <code>Transfer-Encoding</code> instead.
      </P>

      <CodePanel title="the raw request, exactly as sent">
{`POST / HTTP/1.1
Host: example.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED`}
      </CodePanel>

      <Note label="front-end reads">
        Trusts <code>Content-Length: 13</code>. Counts 13 bytes, decides the request is done, forwards exactly
        that.
      </Note>
      <Note label="back-end reads" tone="chart-3">
        Trusts <code>Transfer-Encoding: chunked</code>. Reads a chunk size of <code>0</code>, which means &ldquo;end
        of body, right here.&rdquo; Stops after 5 bytes. <code>SMUGGLED</code> is never read as part of this
        request.
      </Note>

      <P>
        Written out with the actual line breaks instead of blank lines, that body is{" "}
        <code>0\r\n\r\nSMUGGLED</code>. The <code>0</code> is the chunk size, the <code>\r\n\r\n</code> right
        after it is the terminator that means &ldquo;end of body,&rdquo; five bytes total, and{" "}
        <code>SMUGGLED</code> is the eight bytes sitting right after it that the back-end never asked for.
      </P>

      <Fig caption="Figure 3. Every byte of the body, one box each. Bytes 1-5 are the chunk terminator both sides agree on. Bytes 6-13 spell SMUGGLED, forwarded by the front-end, but the back-end already stopped reading by then.">
        <svg viewBox="0 0 680 180" role="img" className="w-full h-auto text-muted-foreground" aria-label="A 13-byte grid. Bytes 1 through 5, the digit 0 followed by the chunk terminator, are outlined in neutral color and read by both sides. Bytes 6 through 13, spelling SMUGGLED, are highlighted and forwarded by the front-end but never read by the back-end as part of this request. A bracket above spans all 13 bytes labeled front-end reads all 13. A bracket below spans only the first 5 bytes labeled back-end stops here.">
          <defs>{ARROW}</defs>

          <rect x="20" y="6" width="13" height="13" className="text-[var(--chart-3)]" fill="currentColor" fillOpacity=".18" stroke="currentColor" />
          <text x="40" y="17" className="font-mono" fontSize="10.5" fill="currentColor">= forwarded by the proxy, but not read by the back-end as part of this request</text>

          <line x1="20" y1="40" x2="638" y2="40" className="text-accent" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" markerStart="url(#ar)" />
          <text x="329" y="30" textAnchor="middle" className="font-mono text-accent" fontSize="10.5" fill="currentColor">front-end reads all 13 bytes as the body</text>

          {["0", "\\r", "\\n", "\\r", "\\n", "S", "M", "U", "G", "G", "L", "E", "D"].map((ch, i) => {
            const x = 20 + i * 48
            const smuggled = i >= 5
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={48}
                  width={42}
                  height={36}
                  rx={3}
                  fill={smuggled ? "currentColor" : "none"}
                  fillOpacity={smuggled ? 0.18 : undefined}
                  stroke="currentColor"
                  className={smuggled ? "text-[var(--chart-3)]" : undefined}
                />
                <text x={x + 21} y={71} textAnchor="middle" className="font-mono" fontSize="13" fill="currentColor">
                  {ch}
                </text>
                <text x={x + 21} y={96} textAnchor="middle" className="font-mono" fontSize="9" fill="currentColor" opacity=".55">
                  {i + 1}
                </text>
              </g>
            )
          })}

          <line x1="20" y1="112" x2="254" y2="112" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" markerStart="url(#ar)" />
          <text x="137" y="130" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10.5" fill="currentColor">back-end stops here (byte 5)</text>

          <text x="440" y="130" textAnchor="middle" className="font-mono" fontSize="10.5" fill="currentColor" opacity=".8">bytes 6-13 become the start of the next request</text>
        </svg>
      </Fig>

      <P>
        Those leftover 8 bytes don&apos;t disappear anywhere. They&apos;re still sitting on the same connection,
        still queued. So the back-end does the only reasonable thing it can, it treats them as the start of the{" "}
        <em>next</em> request that arrives on that connection. And the next request on that connection almost
        never belongs to the attacker anymore, it belongs to whoever the proxy forwards down that same pipe next.
      </P>

      <H2>What an attacker actually gets</H2>
      <P>
        Replace <code>SMUGGLED</code> with the start of a crafted request instead, and it gets glued onto the
        front of someone else&apos;s traffic. Whoever&apos;s request follows next on that connection, a real
        visitor, inherits the attacker&apos;s prefix without ever knowing it. From there it plays out one of two
        ways: the mixed-up response can go back down the victim&apos;s own connection instead of the
        attacker&apos;s, leaking session cookies or auth headers straight to whoever is watching, a{" "}
        <strong className="text-foreground">session hijack</strong>. Or, if a shared cache sits in front of the
        backend, that same mixed-up response gets stored and handed to every visitor after, a{" "}
        <strong className="text-foreground">cache poisoning</strong>.
      </P>

      <Fig caption="Figure 4. One malformed request, sent once, and neither server was ever individually compromised.">
        <svg viewBox="0 0 660 250" role="img" className="w-full h-auto text-muted-foreground" aria-label="The attacker's leftover bytes merge with the next real visitor's request, and the backend treats the merge as one request from the victim, leading to session hijack or cache poisoning.">
          <defs>{ARROW}</defs>
          <rect x="14" y="10" width="230" height="34" rx="3" className="text-[var(--chart-3)]" fill="none" stroke="currentColor" />
          <text x="129" y="32" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">attacker&apos;s unread prefix</text>

          <text x="270" y="32" className="font-mono" fontSize="16" fill="currentColor">+</text>

          <rect x="296" y="10" width="230" height="34" rx="3" className="text-accent" fill="none" stroke="currentColor" />
          <text x="411" y="32" textAnchor="middle" className="font-mono text-accent" fontSize="11" fill="currentColor">victim&apos;s next real request</text>

          <line x1="270" y1="44" x2="270" y2="76" stroke="currentColor" strokeOpacity=".6" />
          <line x1="129" y1="44" x2="270" y2="76" stroke="currentColor" strokeOpacity=".6" />
          <line x1="411" y1="44" x2="270" y2="76" stroke="currentColor" strokeOpacity=".6" />
          <line x1="270" y1="76" x2="270" y2="100" stroke="currentColor" markerEnd="url(#ar)" />

          <rect x="130" y="100" width="280" height="38" rx="3" fill="none" stroke="currentColor" />
          <text x="270" y="124" textAnchor="middle" className="font-mono" fontSize="11.5" fill="currentColor">back-end sees ONE request</text>

          <line x1="270" y1="138" x2="180" y2="176" className="text-accent" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />
          <line x1="270" y1="138" x2="440" y2="176" className="text-[var(--chart-3)]" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#ar)" />

          <rect x="30" y="176" width="300" height="62" rx="4" className="text-accent" fill="currentColor" fillOpacity=".06" stroke="currentColor" />
          <text x="180" y="198" textAnchor="middle" className="font-mono text-accent" fontSize="11" fill="currentColor">response goes back mixed up</text>
          <text x="180" y="214" textAnchor="middle" className="font-mono text-accent" fontSize="11" fill="currentColor">on the victim&apos;s own connection</text>
          <text x="180" y="230" textAnchor="middle" className="font-mono text-accent" fontSize="10" fill="currentColor" opacity=".8">session / auth data exposed</text>

          <rect x="340" y="176" width="290" height="62" rx="4" className="text-[var(--chart-3)]" fill="currentColor" fillOpacity=".06" stroke="currentColor" />
          <text x="485" y="198" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">or the response gets cached</text>
          <text x="485" y="214" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="11" fill="currentColor">and served to every visitor after</text>
          <text x="485" y="230" textAnchor="middle" className="font-mono text-[var(--chart-3)]" fontSize="10" fill="currentColor" opacity=".8">cache poisoning</text>
        </svg>
      </Fig>

      <Pull>Both parsers followed a header correctly. They just didn&apos;t follow the same one.</Pull>

      <H2>How this gets fixed</H2>
      <Table
        head={["Fix", "What it does"]}
        rows={[
          ["Reject ambiguous requests", "Both headers present, respond with an error instead of guessing. Most modern proxies do this by default now."],
          ["Normalize at the edge", "Proxy rewrites the request into an unambiguous form before forwarding."],
          ["Don't reuse the connection", "Close and reopen per request on sensitive paths. Costs performance, removes the shared stream."],
          ["HTTP/2 end-to-end", "Explicit binary length up front, no CL vs TE ambiguity. Risk returns if something downgrades to HTTP/1.1 mid-chain."],
        ]}
      />

      <H2>The one-sentence version</H2>
      <Closing>
        A proxy and a backend are two separate programs sharing one stream of bytes for more than one request. The
        moment they disagree about where a request ends, whatever&apos;s left over doesn&apos;t vanish, it becomes
        the start of whatever the next real visitor sends.
      </Closing>

      <Sources
        items={[
          { label: 'James Kettle, "HTTP Desync Attacks: Request Smuggling Reborn," PortSwigger Research, 2019', href: "https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn" },
          { label: 'James Kettle, "HTTP/1.1 Must Die: The Desync Endgame," PortSwigger Research, 2025', href: "https://portswigger.net/research/http1-must-die" },
          { label: "PortSwigger Web Security Academy, HTTP Request Smuggling", href: "https://portswigger.net/web-security/request-smuggling" },
        ]}
      />
    </>
  )
}
