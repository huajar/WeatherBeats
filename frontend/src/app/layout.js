import './globals.css';

export const metadata = {
  title: 'WeatherBeats',
  description: 'Music recommendations based on weather conditions',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}