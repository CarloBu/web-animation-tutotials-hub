import fs from 'fs';
import axios from 'axios';

const filePath = 'src/content/tutorials/tutorials.json';

function getLibraryFromTitle(title) {
	const lowerTitle = title.toLowerCase();
	if (lowerTitle.includes('gsap')) return 'GSAP';
	if (lowerTitle.includes('framer')) return 'FRAMER';
	if (lowerTitle.includes('js') || lowerTitle.includes('js')) return 'JS';
	return 'CSS';
}

async function processTutorials() {
	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		for (let tutorial of data.tutorial) {
			const videoId = tutorial.src.split('/').pop().split('.')[0];
			tutorial.link = `https://youtu.be/${videoId}`;

			if (!tutorial.title || !tutorial.channelTitle) {
				const apiUrl = `https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${videoId}`;

				try {
					const response = await axios.get(apiUrl);
					const snippet = response.data.items[0].snippet;
					tutorial.title = snippet.title;
					tutorial.channelTitle = snippet.channelTitle;
					tutorial.library = getLibraryFromTitle(tutorial.title);
					console.log(
						`Added title, channelTitle, library, and link for video ${videoId}: ${tutorial.title} (${tutorial.library}) by ${tutorial.channelTitle}`,
					);
				} catch (error) {
					console.error(`Error fetching data for video ${videoId}:`, error.message);
				}
			} else if (!tutorial.library) {
				tutorial.library = getLibraryFromTitle(tutorial.title);
				console.log(
					`Added library and link for existing title: ${tutorial.title} (${tutorial.library})`,
				);
			} else {
				console.log(`Added link for existing tutorial: ${tutorial.title}`);
			}
		}

		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
		console.log('Processing complete. File updated successfully.');
	} catch (error) {
		console.error('Error processing tutorials:', error.message);
	}
}

processTutorials();
