import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Beabodocl-Babylon - 3D Research Visualization',
	description: 'AI-powered scientific research visualization in 3D and VR',
};

export default function RootLayout({
	children,
}: {
    children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ErrorBoundary>
					{children}
				</ErrorBoundary>
			</body>
		</html>
	);
}
