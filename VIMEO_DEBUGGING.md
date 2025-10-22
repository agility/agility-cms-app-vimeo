# Vimeo Player Debugging Guide

## Common Issues and Solutions

### 1. Player Not Loading

If the Vimeo player isn't appearing, check the browser console for these common issues:

#### Console Messages to Look For:

-   `"Initializing Vimeo player for video: [ID]"` - Should appear when loading
-   `"Vimeo player is ready"` - Indicates successful initialization
-   `"Vimeo player ready error:"` - Indicates initialization failed

#### Common Causes:

1. **Video Privacy**: The video may be private or unlisted without proper permissions
2. **Invalid Video ID**: The URL parsing might have failed
3. **Domain Restrictions**: The video may have domain-based embedding restrictions
4. **Network Issues**: CORS or network connectivity problems

### 2. Testing URLs

Try these test URLs to verify functionality:

#### Public Vimeo Videos (should work):

-   `https://vimeo.com/76979871` - Classic test video
-   `https://vimeo.com/148751763` - Another public video

#### Unlisted Videos:

-   These require the `h` parameter in the URL
-   Example: `https://vimeo.com/123456789?h=abcdef1234`

### 3. Debugging Steps

1. **Check Browser Console**: Look for error messages
2. **Network Tab**: Check if oEmbed API calls are successful
3. **Element Inspector**: Verify the player div has content after initialization
4. **Test Different Videos**: Try with different public Vimeo videos

### 4. Player Options

The current player configuration:

```javascript
{
  id: videoData.video_id,
  width: 400,
  height: 225,
  responsive: true,
  autoplay: false,
  byline: false,
  portrait: false,
  title: false
}
```

### 5. Responsive Layout

The component uses a responsive layout:

-   **Desktop (≥600px)**: Video and details displayed side-by-side
-   **Mobile (<600px)**: Video and details stacked vertically
-   Video player dimensions: 400x225 base size with responsive scaling

### 6. Error Messages

-   **"Invalid Vimeo URL"**: The URL format doesn't match expected patterns
-   **"Failed to fetch video data"**: oEmbed API call failed (network or video privacy)
-   **"Unable to load video player"**: Player initialization failed

### 6. Browser Compatibility

Ensure you're using a modern browser that supports:

-   ES6+ JavaScript features
-   HTML5 video
-   Iframe embedding
-   CORS requests

### 7. Development Environment

Make sure:

-   Development server is running on `http://localhost:3001`
-   No console errors related to missing dependencies
-   Network connectivity is working
