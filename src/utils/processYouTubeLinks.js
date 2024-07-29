import fs from "fs";
import { google } from "googleapis";
import fetch from "node-fetch";

// You need to set up a Google Cloud project and enable the YouTube Data API
// Then, create an API key and replace 'YOUR_API_KEY' with your actual key
const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyCA0hq1fOv1HcUyFjh8RTelVvQGgCg2X0c",
});

async function getVideoDetails(videoId) {
  try {
    const response = await youtube.videos.list({
      part: "snippet,contentDetails",
      id: videoId,
    });

    if (response.data.items.length > 0) {
      const videoData = response.data.items[0].snippet;
      const contentDetails = response.data.items[0].contentDetails;
      return {
        title: videoData.title,
        fullVideoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        duration: contentDetails.duration,
      };
    }
  } catch (error) {
    console.error(`Error fetching details for video ${videoId}:`, error);
  }
  return null;
}

async function getVideoIdFromClipUrl(clipUrl) {
  try {
    const response = await fetch(clipUrl);
    const html = await response.text();
    const match = html.match(/videoId":"([^"]+)"/);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`Error fetching clip URL ${clipUrl}:`, error);
    return null;
  }
}
function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}
async function extractTimesFromUrl(link) {
  const clipId = link.split("/").pop();
  const apiUrl = `https://yt.lemnoslife.com/videos?part=clip&clipId=${clipId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const clip = data.items[0].clip;

    const times = {
      startTime: parseInt(clip.startTimeMs),
      endTime: parseInt(clip.endTimeMs),
    };

    console.log("Start Time:", times.startTime);
    console.log("End Time:", times.endTime);

    return times;
  } catch (error) {
    console.error("Error extracting times:", error);
    return null;
  }
}
function getLibraryFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("gsap")) return "GSAP";
  if (lowerTitle.includes("framer")) return "FRAMER";
  if (lowerTitle.includes("javascript") || lowerTitle.includes("js"))
    return "JAVASCRIPT";
  return "CSS";
}
function extractAdditionalParams(clipUrl) {
  const url = new URL(clipUrl);
  const params = new URLSearchParams(url.search);

  const si = params.get("si");
  const clip = url.pathname.split("/").pop();
  const clipt = params.get("clipt");

  console.log("Session Identifier (si):", si);
  console.log("Unique Clip Identifier (clip):", clip);
  console.log("Clip Timing Information (clipt):", clipt);

  return { si, clip, clipt };
}

async function processLinks() {
  const rawData = fs.readFileSync("src/content/ytLinks.json");
  const ytLinks = JSON.parse(rawData);
  console.log("Starting to process links...");
  let existingData = [];
  try {
    const existingRawData = fs.readFileSync("src/content/ytLinksData.json");
    existingData = JSON.parse(existingRawData).clips;
  } catch (error) {
    console.log(
      "No existing ytLinksData.json found or it's empty. Creating new file.",
    );
  }

  const processedLinks = await Promise.all(
    ytLinks.links.map(async (link) => {
      console.log("Processing link:", link);

      // Check if the link already exists in the data
      const existingLink = existingData.find((item) => item.clipUrl === link);
      if (existingLink) {
        console.log(`Link already exists: ${link}. Skipping.`);
        return existingLink;
      }

      const videoId = await getVideoIdFromClipUrl(link);

      if (!videoId) {
        console.log(`Failed to extract video ID for link: ${link}`);
        return null;
      }

      console.log("Extracted Video ID:", videoId);
      const details = await getVideoDetails(videoId);

      if (details) {
        const times = await extractTimesFromUrl(link);
        const library = getLibraryFromTitle(details.title);
        const additionalParams = extractAdditionalParams(link);
        return {
          clipUrl: link,
          videoId,
          startTime: times ? times.startTime : undefined,
          endTime: times ? times.endTime : undefined,
          title: details.title,
          library: library,
          fullVideoUrl: details.fullVideoUrl,
          si: additionalParams.si,
          clip: additionalParams.clip,
          clipt: additionalParams.clipt,
        };
      }
      return null;
    }),
  );

  const filteredLinks = processedLinks.filter((link) => link !== null);

  console.log("Filtered Links:", filteredLinks);

  fs.writeFileSync(
    "src/content/ytLinksData.json",
    JSON.stringify({ clips: filteredLinks }, null, 2),
  );
  console.log(
    "YouTube clip data has been processed and saved to ytLinksData.json",
  );
}

processLinks();
//console.log(extractTimesFromUrl("UgkxIeOT2YJgtj9XW33BfMO6FNCdEMg_ZqlT"));
