import './globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Product Management Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}