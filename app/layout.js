import '../_ds/nocturne-e22f44ae-e1ef-4b64-9584-5d75362c65a2/styles.css';
import '../page-shell.css';

export const metadata = {
  title: 'Luxia-IT',
  description: 'Corporate technology brand of the Legrand-Tech ecosystem.',
};

export default function RootLayout({ children }) {
  const importMap = JSON.stringify({
    imports: {
      three: '/lib/three.module.js',
    },
  });

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo Luxia-IT.png" />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: importMap }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
