'use client'

import { useAgilityAppSDK, contentItemMethods, useResizeHeight } from "@agility/app-sdk"
import { useState, useEffect, useRef } from "react"
import Player, { VimeoEmbedParameters } from "@vimeo/player"

interface VimeoVideoData {
	url: string
	title: string
	description: string
	thumbnail_url: string
	thumbnail_width: number
	thumbnail_height: number
	width: number
	height: number
	duration: number
	html: string
	author_name: string
	author_url: string
	upload_date: string
	video_id: number
}

export default function VimeoField() {
	const { initializing, appInstallContext, fieldValue } = useAgilityAppSDK()
	const containerRef = useResizeHeight(10)
	const [inputUrl, setInputUrl] = useState("")
	const [videoData, setVideoData] = useState<VimeoVideoData | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const playerRef = useRef<HTMLDivElement>(null)
	const vimeoPlayerRef = useRef<Player | null>(null)

	// Initialize from existing field value
	useEffect(() => {
		if (fieldValue && typeof fieldValue === 'string') {
			try {
				const parsed = JSON.parse(fieldValue)
				if (parsed && parsed.url) {
					setVideoData(parsed)
					setInputUrl(parsed.url)
				}
			} catch (e) {
				console.error('Failed to parse field value:', e)
			}
		}
	}, [fieldValue])

	// Initialize Vimeo player when video data changes
	useEffect(() => {
		if (videoData && playerRef.current) {
			console.log("Initializing Vimeo player for video:", videoData.video_id);

			// Clean up existing player
			if (vimeoPlayerRef.current) {
				console.log("Destroying existing player");
				try {
					vimeoPlayerRef.current.destroy()
				} catch (e) {
					console.warn("Error destroying existing player:", e)
				}
				vimeoPlayerRef.current = null
			}

			// Add a small delay to ensure DOM is ready
			const timer = setTimeout(() => {
				if (playerRef.current && videoData) {
					try {
						console.log("Creating new Vimeo player");

						// Try using the video ID first (most reliable approach)
						const playerOptions: VimeoEmbedParameters = {
							id: videoData.video_id,
							width: 400,
							height: 225,
							responsive: true,
							autoplay: false,
							byline: false,
							portrait: false,
							title: false,
							fullscreen: false
						}
						console.log("setting player options:", playerOptions);
						vimeoPlayerRef.current = new Player(playerRef.current, playerOptions)

						// Add event listeners to verify player is working
						vimeoPlayerRef.current.ready().then(() => {
							console.log("Vimeo player is ready");
							// Clear any previous errors since player loaded successfully
							setError("")
						}).catch((error) => {
							console.error("Vimeo player ready error:", error);
							setError('Unable to load video player. The video may be private or restricted.')
						})

						vimeoPlayerRef.current.on('play', () => {
							console.log('Video started playing');
						})

						vimeoPlayerRef.current.on('error', (error) => {
							console.error('Vimeo player error:', error);
						})

					} catch (e) {
						console.error('Failed to initialize Vimeo player:', e)
						let errorMessage = 'Failed to load video player'

						if (e instanceof Error) {
							// Check for specific Vimeo player errors
							if (e.message.includes('privacy')) {
								errorMessage = 'This video is private and cannot be embedded'
							} else if (e.message.includes('not found') || e.message.includes('404')) {
								errorMessage = 'Video not found. Please check the URL'
							} else if (e.message.includes('domain')) {
								errorMessage = 'This video cannot be embedded on this domain'
							} else {
								errorMessage = `Player error: ${e.message}`
							}
						}

						setError(errorMessage)
					}
				}
			}, 100)

			return () => {
				clearTimeout(timer)
			}
		}

		return () => {
			if (vimeoPlayerRef.current) {
				try {
					vimeoPlayerRef.current.destroy()
				} catch (e) {
					console.warn("Error during cleanup:", e)
				}
				vimeoPlayerRef.current = null
			}
		}
	}, [videoData])

	const extractVimeoId = (url: string): string | null => {
		const regex = /(?:vimeo\.com\/(?:.*#|.*\/videos\/)?|player\.vimeo\.com\/video\/)(\d+)/
		const match = url.match(regex)
		return match ? match[1] : null
	}

	const fetchVideoData = async (url: string) => {
		setLoading(true)
		setError("")

		try {
			const vimeoId = extractVimeoId(url)
			if (!vimeoId) {
				throw new Error("Invalid Vimeo URL")
			}

			const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=640&height=360`
			const response = await fetch(oembedUrl)

			if (!response.ok) {
				throw new Error("Failed to fetch video data")
			}

			const data = await response.json()
			const videoData: VimeoVideoData = {
				...data,
				url: url,
				video_id: parseInt(vimeoId)
			}

			setVideoData(videoData)
			contentItemMethods.setFieldValue({ value: JSON.stringify(videoData) })
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setLoading(false)
		}
	}

	const handleUrlSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (inputUrl.trim()) {
			fetchVideoData(inputUrl.trim())
		}
	}

	const clearVideo = () => {
		setVideoData(null)
		setInputUrl("")
		contentItemMethods.setFieldValue({ value: "" })
		if (vimeoPlayerRef.current) {
			vimeoPlayerRef.current.destroy()
			vimeoPlayerRef.current = null
		}
	}

	if (initializing) return null

	return (
		<div ref={containerRef} className="p-4 min-h-[400px]">
			<div className="space-y-4">
				{/* URL Input Form */}
				<form onSubmit={handleUrlSubmit} className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Vimeo Video URL
					</label>
					<div className="flex gap-2">
						<input
							type="url"
							value={inputUrl}
							onChange={(e) => setInputUrl(e.target.value)}
							placeholder="https://vimeo.com/123456789"
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							disabled={loading}
						/>
						<button
							type="submit"
							disabled={loading || !inputUrl.trim()}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Loading..." : "Fetch"}
						</button>
					</div>
				</form>

				{/* Error Message */}
				{error && (
					<div className="p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				{/* Video Preview */}
				{videoData && (
					<div className="border border-gray-200 rounded-lg overflow-hidden">
						{/* Responsive container: side-by-side on >=600px, stacked on <600px */}
						<div className="flex flex-col sm:flex-row">
							{/* Video Player */}
							<div className="sm:w-1/2 sm:min-w-[400px]">
								<div
									ref={playerRef}
									className="w-full bg-black min-h-[300px] sm:min-h-[225px] flex items-center justify-center"
									style={{ minHeight: '225px' }}
								>
									{/* Fallback content while player loads */}
									<div className="text-white text-sm">Loading player...</div>
								</div>
							</div>

							{/* Video Details */}
							<div className="sm:w-1/2 p-4 bg-gray-50">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-lg font-semibold text-gray-900">
										{videoData.title}
									</h3>
									<button
										onClick={clearVideo}
										className="text-red-600 hover:text-red-800 text-sm"
									>
										Remove
									</button>
								</div>

								{videoData.description && (
									<p className="text-sm text-gray-600 mb-3">
										{videoData.description}
									</p>
								)}

								<div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
									<div>
										<span className="font-medium">Type:</span> video - mp4
									</div>
									<div>
										<span className="font-medium">Size:</span> {Math.round(videoData.duration / 60)}m {videoData.duration % 60}s
									</div>
									<div>
										<span className="font-medium">Width:</span> {videoData.width}
									</div>
									<div>
										<span className="font-medium">Height:</span> {videoData.height}
									</div>
									<div>
										<span className="font-medium">URL:</span>{" "}
										<a
											href={videoData.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 break-all"
										>
											{videoData.url}
										</a>
									</div>
									<div>
										<span className="font-medium">Author:</span>{" "}
										<a
											href={videoData.author_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800"
										>
											{videoData.author_name}
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Empty State */}
				{!videoData && !loading && (
					<div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
						<div className="text-gray-500">
							<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							<p className="mt-2 text-sm">Enter a Vimeo URL to preview the video</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
