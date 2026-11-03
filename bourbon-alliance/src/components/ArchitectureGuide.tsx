import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Globe, 
  GitBranch, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Check, 
  Copy, 
  ExternalLink,
  Zap,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const dockerRunScript = `# 1. Build and run Bourbon Alliance in detached container mode
docker compose up -d --build

# 2. Check container health status and logs
docker compose ps
docker compose logs -f bourbon-alliance-web

# 3. View resource utilization (CPU / RAM limits)
docker stats bourbon_alliance_web`;

  const dockerComposeYaml = `services:
  bourbon-alliance-web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bourbon_alliance_web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - APP_URL=https://bourbonalliance.net
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 1024M
        reservations:
          cpus: '0.25'
          memory: 256M
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - bourbon_network

networks:
  bourbon_network:
    driver: bridge`;

  const gitPushScript = `# 1. Initialize git and link to your GitHub repository
git init
git remote add origin https://github.com/Jwjw2323/Bourbon-Alliance.git

# 2. Stage and commit clean Bourbon Alliance codebase
git add .
git commit -m "feat: complete Bourbon Alliance platform with Docker containerization, DC/MD/VA store discovery, and Google OAuth"

# 3. Push to main branch
git branch -M main
git push -u origin main`;

  const nginxConfig = `server {
    listen 80;
    server_name bourbonalliance.net www.bourbonalliance.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bourbonalliance.net www.bourbonalliance.net;

    ssl_certificate /etc/letsencrypt/live/bourbonalliance.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bourbonalliance.net/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`;

  return (
    <div className="space-y-6">
      
      {/* Executive Feedback & Review Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Technical Review & Infrastructure Roadmap</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
              Bourbon Alliance VPS Architecture & Scaling Blueprint
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-3xl mt-1">
              Custom-tailored deployment guide for <strong className="text-stone-200">bourbonalliance.net</strong>, your IaaS VPS, Namecheap domain, and GitHub repository <code className="text-amber-400 font-mono-code text-xs">Jwjw2323/Bourbon-Alliance</code>.
            </p>
          </div>

          <a
            href="https://github.com/Jwjw2323/Bourbon-Alliance"
            target="_blank"
            rel="noreferrer"
            className="border border-stone-700 bg-stone-950 hover:bg-stone-800 text-stone-200 px-3.5 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-colors self-start"
          >
            <GitBranch className="w-4 h-4 text-amber-400" />
            <span>Jwjw2323/Bourbon-Alliance</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </a>
        </div>

        {/* Product Feedback Assessment */}
        <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-2">
          <div className="font-bold text-stone-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Feedback on your product concept so far:</span>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11px] sm:text-xs">
            <strong>1. Exceptional Market Timing:</strong> Whiskey hunters are fed up with opaque distributor allocations, inflated markups, and predatory bundles. Providing a crowdsourced price ceiling baseline gives power back to consumers.
            <br />
            <strong>2. Anonymous Whistleblower Tip Hotline is the Golden Feature:</strong> Liquor store clerks (both private and county) and delivery drivers are the first to see the unboxed cases. Giving them a 100% anonymous, zero-logging channel to drop tips without putting their jobs at risk creates an insurmountable data moat.
            <br />
            <strong>3. DC & MD are the Ideal Pilot Launchpad:</strong> The stark contrast between D.C.'s 100% private Class A retail market and Maryland's hybrid county system makes this region the perfect proving ground before expanding nationwide.
          </p>
        </div>
      </div>

      {/* OS & Hardware Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended OS */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
            <Server className="w-5 h-5 text-amber-500" />
            <span>1. Recommended Operating System</span>
          </div>

          <div className="bg-stone-950 p-3.5 rounded-lg border border-amber-900/40 space-y-1">
            <div className="text-amber-400 font-mono-code font-bold text-sm">
              Ubuntu 24.04 LTS (Noble Numbat) x86_64
            </div>
            <div className="text-stone-400 text-xs">
              Alternative choice: Debian 12 (Bookworm)
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
            <div>
              <strong>Why Ubuntu 24.04 LTS?</strong>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px]">
              <li><strong>5 Years Guaranteed Long-Term Support:</strong> Stable security patches through 2029 without risky OS major upgrades.</li>
              <li><strong>Docker & Node.js Native:</strong> Seamless container runtime with modern Linux kernel (6.8+) for high network socket throughput during drop rushes.</li>
              <li><strong>Standard Tooling:</strong> UFW (Uncomplicated Firewall), Fail2ban (prevents brute-force SSH), and Certbot for zero-friction SSL certificates.</li>
            </ul>
          </div>
        </div>

        {/* Hardware Specs by Growth Phase */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
            <Cpu className="w-5 h-5 text-amber-500" />
            <span>2. Hardware Sizing Roadmap</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Phase 1 */}
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">Phase 1: DC & MD Launch (Current)</span>
                <span className="font-mono-code text-amber-400 text-[11px]">~$10–$20/mo</span>
              </div>
              <div className="text-stone-400 text-[11px] mt-1 space-y-0.5">
                <div>• <strong>CPU:</strong> 2 vCPU (AMD EPYC or Intel Xeon)</div>
                <div>• <strong>RAM:</strong> 4 GB (Runs Node.js + PostgreSQL + Nginx comfortably)</div>
                <div>• <strong>Storage:</strong> 40 GB – 80 GB NVMe SSD</div>
                <div>• <strong>Providers:</strong> Hetzner Cloud (CPX21), DigitalOcean, Linode/Akamai, or Vultr.</div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">Phase 2: Mid-Atlantic Regional (50k MAU)</span>
                <span className="font-mono-code text-amber-400 text-[11px]">~$40–$80/mo</span>
              </div>
              <div className="text-stone-400 text-[11px] mt-1 space-y-0.5">
                <div>• <strong>CPU:</strong> 4 vCPU · <strong>RAM:</strong> 8 GB – 16 GB · <strong>Disk:</strong> 160 GB NVMe</div>
                <div>• Add <strong>Redis</strong> for rate-limiting tips & real-time WebSocket push alerts.</div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-200">Phase 3: National Scale (All 50 States, 500k+ MAU)</span>
                <span className="font-mono-code text-amber-400 text-[11px]">Cluster Architecture</span>
              </div>
              <div className="text-stone-400 text-[11px] mt-1">
                Cloudflare CDN fronting multiple load-balanced VPS app nodes, managed PostgreSQL with PostGIS, and Cloudflare R2 for photo receipt storage.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Namecheap Domain & Nginx Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Namecheap Setup */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
            <Globe className="w-5 h-5 text-amber-500" />
            <span>3. Namecheap DNS Setup for bourbonalliance.net</span>
          </div>

          <p className="text-xs text-stone-300">
            Log into your Namecheap Dashboard &gt; Domain List &gt; <strong>Advanced DNS</strong> and add:
          </p>

          <div className="bg-stone-950 border border-stone-800 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left font-mono-code text-[11px]">
              <thead className="bg-stone-900 border-b border-stone-800 text-stone-400">
                <tr>
                  <th className="p-2">Type</th>
                  <th className="p-2">Host</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">TTL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-200">
                <tr>
                  <td className="p-2 text-amber-400 font-bold">A Record</td>
                  <td className="p-2">@</td>
                  <td className="p-2 text-emerald-400">&lt;YOUR_VPS_PUBLIC_IP&gt;</td>
                  <td className="p-2 text-stone-400">Automatic</td>
                </tr>
                <tr>
                  <td className="p-2 text-amber-400 font-bold">CNAME Record</td>
                  <td className="p-2">www</td>
                  <td className="p-2">bourbonalliance.net.</td>
                  <td className="p-2 text-stone-400">Automatic</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs space-y-1">
            <div className="font-bold text-stone-300">Free SSL with Let's Encrypt / Certbot:</div>
            <code className="text-[11px] text-amber-300 font-mono-code block bg-stone-900 p-2 rounded">
              sudo apt install certbot python3-certbot-nginx -y<br />
              sudo certbot --nginx -d bourbonalliance.net -d www.bourbonalliance.net
            </code>
          </div>
        </div>

        {/* Nginx Reverse Proxy Config */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
              <HardDrive className="w-5 h-5 text-amber-500" />
              <span>4. Nginx Reverse Proxy Config</span>
            </div>

            <button
              onClick={() => copyToClipboard(nginxConfig, 'nginx')}
              className="bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 px-2.5 py-1 rounded text-xs font-mono-code flex items-center gap-1"
            >
              {copiedCode === 'nginx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode === 'nginx' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 font-mono-code text-[11px] text-stone-300 overflow-x-auto max-h-56">
            <pre>{nginxConfig}</pre>
          </div>
          <div className="text-[11px] text-stone-400">
            Save in <code className="text-amber-400">/etc/nginx/sites-available/bourbonalliance.net</code> and symlink to <code className="text-amber-400">sites-enabled</code>.
          </div>
        </div>

      </div>

      {/* Docker Containerization Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>5. Docker Containerization & Modular Architecture</span>
          </div>

          <button
            onClick={() => copyToClipboard(dockerRunScript, 'docker')}
            className="bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors"
          >
            {copiedCode === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode === 'docker' ? 'Copied' : 'Copy Docker Commands'}</span>
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Running Bourbon Alliance inside Docker containers gives you <strong className="text-stone-100">isolation, memory limits, reproducible builds, and unprivileged execution</strong> (dropping root privileges so even a vulnerability cannot compromise your host VPS).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="font-semibold text-stone-200 text-xs">Docker Commands (Run on your VPS):</div>
            <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 font-mono-code text-[11px] text-amber-300 overflow-x-auto">
              <pre>{dockerRunScript}</pre>
            </div>
            <div className="text-[11px] text-stone-400">
              Healthcheck automatically verifies application responsiveness every 30 seconds.
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-stone-200 text-xs">docker-compose.yml Architecture:</div>
            <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 font-mono-code text-[11px] text-stone-300 overflow-x-auto max-h-48">
              <pre>{dockerComposeYaml}</pre>
            </div>
            <div className="text-[11px] text-stone-400">
              Includes CPU and RAM limits to safeguard against out-of-memory crashes during drop stampedes.
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repo Push Instructions */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-serif-brand">
            <GitBranch className="w-5 h-5 text-amber-500" />
            <span>6. Syncing to your GitHub Repository</span>
          </div>

          <button
            onClick={() => copyToClipboard(gitPushScript, 'git')}
            className="bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors"
          >
            {copiedCode === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode === 'git' ? 'Copied Commands' : 'Copy Git Commands'}</span>
          </button>
        </div>

        <p className="text-xs text-stone-300">
          Run these terminal commands in your project folder to push this clean Bourbon Alliance codebase to your repository <code className="text-amber-400 font-mono-code">https://github.com/Jwjw2323/Bourbon-Alliance.git</code>:
        </p>

        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono-code text-xs text-amber-300 overflow-x-auto">
          <pre>{gitPushScript}</pre>
        </div>
      </div>

    </div>
  );
};
