# Agility CMS Vimeo Video Field App

A custom field application for Agility CMS that enables content editors to easily embed and manage Vimeo videos directly within their content. Built with the Agility Apps SDK v2, this app provides a seamless experience for adding Vimeo videos with automatic metadata fetching and live previews.

![Vimeo App](https://img.shields.io/badge/Vimeo-1AB7EA?style=for-the-badge&logo=vimeo&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎥 Features

### **URL Input & Validation**

-   Simple paste-and-go interface for Vimeo URLs
-   Supports multiple URL formats:
    -   `https://vimeo.com/123456789`
    -   `https://player.vimeo.com/video/123456789`
    -   `https://vimeo.com/user/videos/123456789`
-   Automatic video ID extraction and validation

### **Automatic Metadata Fetching**

-   Uses Vimeo's public oEmbed API to retrieve:
    -   Video title and description
    -   Thumbnail image
    -   Video dimensions (width/height)
    -   Duration
    -   Author information
    -   Upload date
-   No API keys required for public videos

### **Live Video Preview**

-   Embedded Vimeo player using the official [@vimeo/player](https://github.com/vimeo/player.js) SDK
-   Full playback controls
-   Responsive player that adapts to container size
-   Support for all Vimeo player features

### **Responsive Design**

-   **Desktop (≥600px)**: Side-by-side layout with video and details
-   **Mobile (<600px)**: Stacked layout for optimal mobile viewing
-   Automatically adjusts iframe height using `useResizeHeight()`

### **Complete Data Storage**

-   Stores full video metadata as structured JSON
-   Easy access to video information in templates and API responses
-   Persistent storage across content edits

## 🚀 Quick Start

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/agility/agility-cms-app-vimeo.git
    cd agility-cms-app-vimeo
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open in browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Testing the Field

1. Navigate to `/fields/vimeo-field` in your browser
2. Paste a Vimeo URL (try: `https://vimeo.com/76979871`)
3. Click "Fetch" to load the video
4. Preview the video and see the metadata

## 📁 Project Structure

```
app/
├── fields/
│   └── vimeo-field/
│       └── page.tsx              # Main Vimeo field component
├── api/
│   ├── app-uninstall/
│   │   └── route.ts              # Uninstall webhook handler
│   └── hello/
│       └── route.ts              # Health check endpoint
├── layout.tsx                    # Root layout with permissions policy
└── page.tsx                      # Home page with app documentation

components/
└── CommonDashboard.tsx           # Shared dashboard component

public/
└── .well-known/
    └── agility-app.json          # App definition file

styles/
└── globals.css                   # Global styles with Tailwind
```

## 🔧 Technical Implementation

### Core Dependencies

```json
{
	"@agility/app-sdk": "^2.1.0",
	"@vimeo/player": "^2.x",
	"@types/vimeo__player": "^2.x",
	"next": "16.0.0",
	"react": "19.2.0",
	"typescript": "^5.5.4"
}
```

### Key Hooks & Methods Used

#### `useAgilityAppSDK()`

Access SDK functionality and field data:

```typescript
const { initializing, fieldValue } = useAgilityAppSDK()
```

#### `useResizeHeight()`

Automatically adjust iframe height:

```typescript
const containerRef = useResizeHeight(10)
return <div ref={containerRef}>...</div>
```

#### `contentItemMethods.setFieldValue()`

Save video data to the field:

```typescript
contentItemMethods.setFieldValue({
	value: JSON.stringify(videoData)
})
```

### Data Structure

The field stores video data as JSON:

```typescript
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
```

### Vimeo Player Integration

```typescript
import Player from "@vimeo/player"

const player = new Player(containerElement, {
	id: videoData.video_id,
	width: 400,
	height: 225,
	responsive: true,
	autoplay: false
})

player.ready().then(() => {
	console.log("Player is ready")
})
```

## 🔐 Permissions Policy

The app includes proper Permissions Policy headers to avoid browser console warnings:

```typescript
// next.config.js
headers: [
	{
		key: "Permissions-Policy",
		value: "autoplay=*, encrypted-media=*, fullscreen=*, clipboard-write=*, web-share=*"
	}
]
```

Permissions enabled:

-   **autoplay**: Allow video autoplay
-   **encrypted-media**: Support DRM content
-   **fullscreen**: Enable fullscreen video
-   **clipboard-write**: Allow copying URLs
-   **web-share**: Enable sharing features

### App Definition

The app definition is served at `/.well-known/agility-app.json` and includes:

```json
{
	"name": "Vimeo Video Field",
	"version": "1.0.0",
	"description": "Embed and manage Vimeo videos",
	"surfaces": {
		"fields": [
			{
				"name": "vimeo-field",
				"displayName": "Vimeo Video",
				"path": "/fields/vimeo-field"
			}
		]
	}
}
```

## 🐛 Troubleshooting

### Player Not Loading

Check the browser console for errors:

-   **"Invalid Vimeo URL"**: URL format is incorrect
-   **"Failed to fetch video data"**: Video may be private or network issue
-   **"Unable to load video player"**: Player initialization failed

### Console Warnings

Permissions policy warnings have been resolved. If you still see them:

1. Clear browser cache
2. Restart development server
3. Check `next.config.js` headers configuration

### Testing Public Videos

Use these URLs for testing:

-   `https://vimeo.com/76979871`
-   `https://vimeo.com/148751763`

See [VIMEO_DEBUGGING.md](./VIMEO_DEBUGGING.md) for detailed debugging information.

## 📚 Documentation

-   **[VIMEO_FIELD_USAGE.md](./VIMEO_FIELD_USAGE.md)** - Detailed usage guide
-   **[VIMEO_DEBUGGING.md](./VIMEO_DEBUGGING.md)** - Troubleshooting and debugging
-   [Agility CMS Apps Documentation](https://agilitycms.com/docs/apps)
-   [Agility Apps SDK v2](https://github.com/agility/agility-cms-app-sdk)
-   [Vimeo Player SDK](https://developer.vimeo.com/player/sdk)
-   [Vimeo oEmbed API](https://developer.vimeo.com/api/oembed/videos)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

-   Built with [Agility CMS](https://agilitycms.com)
-   Video player by [Vimeo](https://vimeo.com)
-   Powered by [Next.js](https://nextjs.org)
-   Styled with [Tailwind CSS](https://tailwindcss.com)

---

Made with ❤️ for the Agility CMS community
