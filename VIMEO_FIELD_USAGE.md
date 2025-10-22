# Vimeo Field Component

This component creates a Vimeo video field for Agility CMS that allows users to:

1. **Input Vimeo URLs** - Paste any Vimeo video URL
2. **Fetch Video Details** - Automatically retrieve video metadata via Vimeo's oEmbed API
3. **Preview Videos** - Display the video using the official Vimeo player
4. **Store Video Data** - Save complete video information as JSON in the field value

## Features

### URL Input

-   Accepts various Vimeo URL formats:
    -   `https://vimeo.com/123456789`
    -   `https://player.vimeo.com/video/123456789`
    -   `https://vimeo.com/user/videos/123456789`

### Video Preview

-   Embedded Vimeo player using [@vimeo/player](https://github.com/vimeo/player.js)
-   Responsive design (640x360 default, scales down)
-   Full player controls and functionality

### Video Details Display

-   Video title and description
-   Author name and profile link
-   Video dimensions (width/height)
-   Duration
-   Direct link to video
-   Thumbnail information

### Data Storage

The field stores a JSON object with complete video metadata:

```json
{
	"url": "https://vimeo.com/123456789",
	"title": "Video Title",
	"description": "Video description",
	"thumbnail_url": "https://i.vimeocdn.com/video/...",
	"thumbnail_width": 1280,
	"thumbnail_height": 720,
	"width": 1920,
	"height": 1080,
	"duration": 120,
	"html": "<iframe src=\"https://player.vimeo.com/video/123456789\" ...",
	"author_name": "Author Name",
	"author_url": "https://vimeo.com/user",
	"upload_date": "2023-01-01T00:00:00+00:00",
	"video_id": 123456789
}
```

## Usage

1. **Add URL**: Paste a Vimeo video URL into the input field
2. **Fetch Video**: Click "Fetch" to retrieve video details
3. **Preview**: The video will automatically load in the embedded player
4. **Remove**: Click "Remove" to clear the video and start over

## Technical Details

### Dependencies

-   `@vimeo/player` - Official Vimeo player for JavaScript
-   `@types/vimeo__player` - TypeScript definitions

### API Usage

-   Uses Vimeo's public oEmbed API: `https://vimeo.com/api/oembed.json`
-   No authentication required for public videos
-   Supports responsive embeds

### Error Handling

-   Invalid URL detection
-   Network error handling
-   Graceful fallbacks for missing data

## Installation

The component is ready to use with the existing project setup. Required dependencies are already installed:

```bash
npm install @vimeo/player @types/vimeo__player --legacy-peer-deps
```

## Browser Support

Works with all modern browsers that support:

-   ES6+ JavaScript features
-   HTML5 video
-   Vimeo's player.js library
