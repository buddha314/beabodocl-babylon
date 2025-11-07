/**
 * Test Component for Error Boundary
 * 
 * This component can be used to test error boundaries in development.
 * 
 * Usage:
 * Import this component and add it to your page to test error handling.
 * <ErrorTest />
 * 
 * Then click the buttons to trigger different types of errors and verify
 * that error boundaries catch and display them properly.
 */

"use client";

import { useState } from "react";

export function ErrorTest() {
	const [throwError, setThrowError] = useState(false);
	const [throwAsyncError, setThrowAsyncError] = useState(false);

	if (throwError) {
		throw new Error("Test Error: This error was deliberately thrown to test the ErrorBoundary!");
	}

	const handleAsyncError = async () => {
		setThrowAsyncError(true);
		await new Promise((resolve) => setTimeout(resolve, 100));
		throw new Error("Test Async Error: This async error was deliberately thrown!");
	};

	const handleNullReference = () => {
		// @ts-ignore - deliberately cause a null reference error
		const obj: any = null;
		console.log(obj.property);
	};

	const handleUndefinedFunction = () => {
		// @ts-ignore - deliberately call undefined function
		const fn: any = undefined;
		fn();
	};

	return (
		<div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
			<h3 className="text-sm font-bold mb-2">Error Boundary Tests</h3>
			<div className="space-y-2">
				<button
					onClick={() => setThrowError(true)}
					className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
				>
					Throw Render Error
				</button>
				<button
					onClick={handleAsyncError}
					className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded"
				>
					Throw Async Error
				</button>
				<button
					onClick={handleNullReference}
					className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded"
				>
					Null Reference Error
				</button>
				<button
					onClick={handleUndefinedFunction}
					className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded"
				>
					Undefined Function Error
				</button>
			</div>
			<p className="text-xs text-gray-400 mt-2">
				(Development only - Remove before production)
			</p>
		</div>
	);
}
