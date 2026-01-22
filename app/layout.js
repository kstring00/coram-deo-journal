import "./globals.css";

export const metadata = {
  title: "Coram Deo Journal",
  description: "A Scripture-first journaling tool that points the heart toward Christ."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          {children}
        </div>
      </body>
    </html>
  );
}
