import './globals.css';

export const metadata = {
  title: 'WeatherBeats',
  description: 'Obtén el clima y recomendaciones musicales por ciudad.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}