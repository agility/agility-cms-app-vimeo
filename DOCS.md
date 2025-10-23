# Vimeo

The Vimeo App for Agility enables users to seamlessly search, select, and embed Vimeo videos directly into their content with automatic metadata fetching and live previews.

Vimeo is a powerful video hosting platform that enables you to deliver high-quality video experiences to your audience. With advanced privacy controls, customizable players, and reliable streaming, Vimeo is trusted by creators and businesses worldwide.

This integration makes publishing Agility content with Vimeo videos quick and easy.

## Features

-   Embed Vimeo videos directly from Agility CMS content
-   Automatic video metadata fetching via Vimeo's oEmbed API
-   Live video preview using the official Vimeo player
-   Support for multiple Vimeo URL formats
-   Stores complete video metadata in a JSON object which is returned from the Agility API
-   Responsive design that works on desktop and mobile devices
-   No API keys required for public videos

## The Vimeo Video Field

Renders a Video field that allows you to embed Vimeo videos in your content.

When you click the field, you can paste any Vimeo video URL, and the app will automatically fetch the video details and display a live preview.

The field supports various Vimeo URL formats:

-   `https://vimeo.com/123456789`
-   `https://player.vimeo.com/video/123456789`
-   `https://vimeo.com/user/videos/123456789`

## Requirements

In order to use this integration, some set up is required.

-   Ensure you have a [Agility CMS](https://agilitycms.com/trial/) account
-   A [Vimeo](https://vimeo.com) account (optional - required only if you want to upload private videos)
-   Install the app from the Marketplace
-   Create Content Models that use the Vimeo Video custom field
-   Output/render the Vimeo videos in your digital solution (i.e. website or app)

## Install the App

You can install the app from the Settings / Apps section of Agility.

1. Navigate to **Settings** > **Apps**
2. Click **Install** on the Vimeo Video Field app
3. The app will be available immediately for use in your Content Models

## Set Up Content Models to use Vimeo Fields

In order to use Vimeo fields, you need to have Content Models or Page Modules in Agility CMS that utilize this new field type.

Add a Vimeo field to any Content Model in Agility CMS:

-   Navigate to **Models** > **Content Models** > **{Your Content Model}**
-   Click **Add Field**
    -   Field Name: Vimeo Video
    -   Field Type: Custom Field
    -   Custom Field Type: Vimeo Video

Next, create some content using your Content Model:

-   Navigate to an instance of your content that is based off your Content Model
-   Click **+ New**
-   Fill out the fields
    -   On the Vimeo Video field, paste a Vimeo video URL (e.g., `https://vimeo.com/123456789`)
    -   Click **Fetch** to load the video details
    -   The video will appear with a live preview and complete metadata
    -   Click **Save** to save your content

## Render/Output the Vimeo Videos in your Solution

Now that you've set up the field and allow editors to embed Vimeo videos, the next thing you'll need to do is actually output these fields in your digital solution (i.e. website or app).

The value for a Vimeo Video field will be a JSON string returned from the Content Fetch or GraphQL API.

### Vimeo Field Values

In order to properly read your Vimeo video data, you'll need to parse the string to an object.

In JavaScript, this can be accomplished using `JSON.parse(vimeoVideoFieldValue)`.

### API Response Format

```json
{
	// The original Vimeo URL
	"url": "https://vimeo.com/123456789",

	// Video title
	"title": "Example Video Title",

	// Video description
	"description": "This is an example video description",

	// Thumbnail image URL
	"thumbnail_url": "https://i.vimeocdn.com/video/123456789_640.jpg",

	// Thumbnail dimensions
	"thumbnail_width": 1280,
	"thumbnail_height": 720,

	// Video dimensions
	"width": 1920,
	"height": 1080,

	// Video duration in seconds
	"duration": 120,

	// Embed HTML code
	"html": "<iframe src=\"https://player.vimeo.com/video/123456789\" width=\"640\" height=\"360\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen></iframe>",

	// Author information
	"author_name": "Video Creator Name",
	"author_url": "https://vimeo.com/videocreator",

	// Upload date
	"upload_date": "2023-01-15T10:30:00+00:00",

	// Vimeo video ID
	"video_id": 123456789
}
```

### Rendering Example

Here's an example of how to render a Vimeo video field in a Next.js application:

```jsx
import React from "react"

const VimeoVideo = ({ fieldValue }) => {
	// Parse the JSON string
	const videoData = JSON.parse(fieldValue)

	if (!videoData || !videoData.video_id) {
		return null
	}

	return (
		<div className="vimeo-video">
			<h2>{videoData.title}</h2>

			{/* Responsive video container */}
			<div
				className="video-container"
				style={{
					position: "relative",
					paddingBottom: "56.25%", // 16:9 aspect ratio
					height: 0,
					overflow: "hidden"
				}}
			>
				<iframe
					src={`https://player.vimeo.com/video/${videoData.video_id}`}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%"
					}}
					frameBorder="0"
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen
				/>
			</div>

			{/* Video metadata */}
			{videoData.description && <p>{videoData.description}</p>}

			{videoData.author_name && (
				<p className="author">
					By{" "}
					<a href={videoData.author_url} target="_blank" rel="noopener noreferrer">
						{videoData.author_name}
					</a>
				</p>
			)}
		</div>
	)
}

export default VimeoVideo
```

### Using the Vimeo Player SDK

For more advanced use cases, you can use the official [Vimeo Player SDK](https://github.com/vimeo/player.js) to have programmatic control over the video player:

```jsx
import React, { useEffect, useRef } from "react"
import Player from "@vimeo/player"

const VimeoPlayerAdvanced = ({ fieldValue }) => {
	const videoData = JSON.parse(fieldValue)
	const playerRef = useRef(null)
	const vimeoPlayerRef = useRef(null)

	useEffect(() => {
		if (playerRef.current && videoData.video_id) {
			// Initialize the Vimeo player
			vimeoPlayerRef.current = new Player(playerRef.current, {
				id: videoData.video_id,
				width: 640,
				responsive: true
			})

			// Add event listeners
			vimeoPlayerRef.current.on("play", () => {
				console.log("Video started playing")
			})

			vimeoPlayerRef.current.on("ended", () => {
				console.log("Video ended")
			})
		}

		// Cleanup
		return () => {
			if (vimeoPlayerRef.current) {
				vimeoPlayerRef.current.destroy()
			}
		}
	}, [videoData.video_id])

	return (
		<div>
			<h2>{videoData.title}</h2>
			<div ref={playerRef}></div>
		</div>
	)
}

export default VimeoPlayerAdvanced
```

To use the Vimeo Player SDK, install it first:

```bash
npm install @vimeo/player
# or
yarn add @vimeo/player
```

### Displaying Video Thumbnails

You can also use the thumbnail URL to display video previews in listings or grids:

```jsx
const VideoThumbnail = ({ fieldValue }) => {
	const videoData = JSON.parse(fieldValue)

	return (
		<div className="video-thumbnail">
			<img
				src={videoData.thumbnail_url}
				alt={videoData.title}
				width={videoData.thumbnail_width}
				height={videoData.thumbnail_height}
			/>
			<h3>{videoData.title}</h3>
			<p>
				Duration: {Math.floor(videoData.duration / 60)}:{videoData.duration % 60}
			</p>
		</div>
	)
}
```

### Using Vimeo Libraries

Vimeo provides official SDKs and libraries to help you work with their platform:

-   [Vimeo Player SDK (JavaScript)](https://github.com/vimeo/player.js) - Official JavaScript SDK for embedding and controlling Vimeo videos
-   [Vimeo API](https://developer.vimeo.com/api) - Full API documentation for advanced integrations
-   [Vimeo React Player](https://www.npmjs.com/package/react-player) - Popular React component that supports Vimeo (and other platforms)
-   [Vimeo Vue Player](https://github.com/dobromir-hristov/vue-vimeo-player) - Vue.js component for Vimeo videos

For comprehensive documentation and advanced features, visit the [Vimeo Developer Portal](https://developer.vimeo.com/).

## Best Practices

### Performance Optimization

-   Use the thumbnail URL for video previews in list views to avoid loading multiple video players
-   Implement lazy loading for videos that are below the fold
-   Consider using the `loading="lazy"` attribute on iframes (where supported)

### Accessibility

-   Always include the video title in your markup for screen readers
-   Ensure the Vimeo player is keyboard accessible (this is built-in to Vimeo's player)
-   Provide captions when available (Vimeo supports closed captions)

### Privacy and GDPR

-   Vimeo offers privacy controls for your videos
-   Consider using Vimeo's privacy settings in combination with cookie consent for GDPR compliance
-   Learn more at [Vimeo's Privacy Center](https://vimeo.com/privacy)

## Troubleshooting

### Video Not Loading

-   Ensure the Vimeo video is set to **Public** or that you have the appropriate permissions
-   Check that the URL is correctly formatted
-   Verify that the video has not been deleted from Vimeo

### Metadata Not Fetching

-   The app uses Vimeo's public oEmbed API which only works with public videos
-   If you're using private videos, you may need to implement additional authentication
-   Check your network connection and ensure Vimeo's API is accessible

### Player Issues

-   Ensure your browser supports HTML5 video
-   Check that you're not blocking iframes or third-party content
-   Clear your browser cache and try again

## Support

For issues related to:

-   **The Agility CMS Vimeo App**: Contact [Agility CMS Support](https://help.agilitycms.com/)
-   **Vimeo Platform**: Visit [Vimeo Help Center](https://vimeo.com/help)
-   **Video Hosting**: Check [Vimeo's Documentation](https://developer.vimeo.com/)

## Related Resources

-   [Agility CMS Apps Documentation](https://agilitycms.com/docs/apps)
-   [Agility CMS Content Fetch API](https://agilitycms.com/docs/content-fetch-api)
-   [Vimeo Developer Documentation](https://developer.vimeo.com/)
-   [Vimeo Player SDK Documentation](https://developer.vimeo.com/player/sdk)
