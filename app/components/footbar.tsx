export function Footer() {
    return (
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Rehab Visualizer. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    );
  }