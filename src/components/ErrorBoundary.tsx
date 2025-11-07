"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch and handle React errors gracefully.
 * Prevents app crashes and provides user-friendly error messages.
 * 
 * Usage:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		// Update state so the next render will show the fallback UI
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log error details for debugging
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Update state with error info
		this.setState({
			errorInfo,
		});

		// Call optional error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// In production, you might want to log to an error reporting service
		// e.g., Sentry, LogRocket, etc.
		if (process.env.NODE_ENV === "production") {
			// logErrorToService(error, errorInfo);
		}
	}

	handleReset = (): void => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render(): ReactNode {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default fallback UI
			return (
				<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
					<div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8">
						<div className="flex items-center mb-6">
							<svg
								className="w-12 h-12 text-red-500 mr-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<h1 className="text-3xl font-bold">Something went wrong</h1>
						</div>

						<div className="mb-6">
							<p className="text-gray-300 mb-4">
								We're sorry, but something unexpected happened. The error has been logged
								and we'll look into it.
							</p>

							{process.env.NODE_ENV === "development" && this.state.error && (
								<div className="bg-gray-900 rounded p-4 mb-4">
									<h2 className="text-lg font-semibold text-red-400 mb-2">
										Error Details (Development Only):
									</h2>
									<p className="text-sm text-gray-400 mb-2 font-mono">
										{this.state.error.toString()}
									</p>
									{this.state.errorInfo && (
										<details className="mt-2">
											<summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
												Component Stack
											</summary>
											<pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-64">
												{this.state.errorInfo.componentStack}
											</pre>
										</details>
									)}
								</div>
							)}
						</div>

						<div className="flex gap-4">
							<button
								onClick={this.handleReset}
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
							>
								Try Again
							</button>
							<button
								onClick={() => window.location.reload()}
								className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
							>
								Reload Page
							</button>
						</div>

						<div className="mt-6 text-center">
							<a
								href="/"
								className="text-blue-400 hover:text-blue-300 text-sm underline"
							>
								Return to Home
							</a>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

/**
 * Specialized error boundary for 3D/VR scenes.
 * Provides context-specific error messages and recovery options.
 */
export class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("SceneErrorBoundary caught a 3D scene error:", error, errorInfo);

		this.setState({
			errorInfo,
		});

		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	handleReset = (): void => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
					<div className="text-center p-8 max-w-md">
						<svg
							className="w-16 h-16 text-yellow-500 mx-auto mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<h2 className="text-2xl font-bold mb-4">3D Scene Error</h2>
						<p className="text-gray-300 mb-6">
							The 3D scene failed to load. This might be due to WebGL issues,
							missing assets, or browser compatibility.
						</p>

						{process.env.NODE_ENV === "development" && this.state.error && (
							<div className="bg-gray-800 rounded p-4 mb-4 text-left">
								<p className="text-sm text-red-400 font-mono">
									{this.state.error.toString()}
								</p>
							</div>
						)}

						<div className="space-y-3">
							<button
								onClick={this.handleReset}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
							>
								Retry Scene Load
							</button>
							<button
								onClick={() => window.location.reload()}
								className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
							>
								Reload Application
							</button>
						</div>

						<p className="text-sm text-gray-500 mt-6">
							If this problem persists, try updating your browser or checking WebGL support.
						</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
