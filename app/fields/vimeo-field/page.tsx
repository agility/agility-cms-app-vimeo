'use client'

import { useAgilityAppSDK, contentItemMethods, useResizeHeight } from "@agility/app-sdk"
import { useState, useEffect, useRef } from "react"

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

			console.log("Fetched video data:", data);

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

	}

	if (initializing) return null

	return (
		<div ref={containerRef} className="min-h-[200px]">
			<div className="space-y-4 ">


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
							<div className="sm:w-1/2 w-full min-h-[200px]">
								<div className="video-container relative h-full min-h-[200px]" dangerouslySetInnerHTML={{ __html: videoData.html }}></div>

							</div>

							{/* Video Details */}
							<div className="sm:w-1/2 p-4 ">
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
					<>
						{/* URL Input Form */}
						<form onSubmit={handleUrlSubmit} className="space-y-2 text-sm p-1">
							<label className="block text-sm font-medium text-gray-700">
								Vimeo Video URL
							</label>
							<div className="flex gap-2">
								<input
									type="url"
									value={inputUrl}
									onChange={(e) => setInputUrl(e.target.value)}
									placeholder="https://vimeo.com/123456789"
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
									disabled={loading}
								/>
								<button
									type="submit"
									disabled={loading || !inputUrl.trim()}
									className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									{loading ? "Loading..." : "Fetch"}
								</button>
							</div>
						</form>
						<div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">



							<div className="text-gray-500">

								<img src="/logo-black-vimeo.svg" alt="Vimeo Logo" className="mx-auto h-10  text-gray-400" />
								<p className="mt-2 text-sm">Enter a Vimeo URL to preview the video</p>
							</div>
						</div>
					</>
				)}
			</div>
		</div >
	)
}
