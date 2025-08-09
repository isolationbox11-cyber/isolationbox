export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-orange-400">
      <h1 className="text-4xl font-bold mb-4">🎃 Salem Cyber Vault 🎃</h1>
      <p className="mb-6 text-lg">Welcome to your Halloween-themed cybersecurity dashboard!</p>
      <ul className="space-y-2">
        <li>🛡️ Security Score Monitoring</li>
        <li>👻 Threat Intelligence</li>
        <li>🗺️ Live Threat Map</li>
        <li>📊 Asset Monitoring</li>
        <li>🔍 Vulnerability Analysis</li>
        <li>📚 Learn Mode</li>
        <li>🔮 Spooky Scan</li>
      </ul>
      <p className="mt-8 text-sm opacity-60">Edit <code>app/page.tsx</code> to customize your homepage.</p>
    </main>
  );
}